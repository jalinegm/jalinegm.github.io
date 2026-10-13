"""Extrai o currículo Lattes (XML ISO-8859-1) para src/data/lattes.json.

Uso (a partir da raiz do repositório):
    .venv\\Scripts\\python.exe -I scripts/lattes.py

Saída determinística: chaves ordenadas, UTF-8, sem BOM, quebras de linha \\n.
"""

from __future__ import annotations

import html
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent
XML_PATH = ROOT / "data" / "lattes" / "5793944765294091.xml"
CURADORIA_PATH = ROOT / "data" / "publicacoes-curadoria.yaml"
OUT_PATH = ROOT / "src" / "data" / "lattes.json"

TEMAS = ("alfabetizacao-cci", "acessibilidade", "educacao-computacao", "dados-educacionais", "outros")

# Padrões aplicados ao texto sem acento e em minúsculas (ver _fold).
# A ordem importa: o primeiro tema que casar vence.
TEMA_PADROES: tuple[tuple[str, tuple[str, ...]], ...] = (
    (
        "alfabetizacao-cci",
        (r"escrita", r"spelling", r"literacy", r"alfabetiza", r"child", r"crianc", r"infantil", r"handwriting", r"ortograf"),
    ),
    (
        "acessibilidade",
        (r"deficien", r"ceg[oa]s?\b", r"visual(is)?\b", r"libras", r"assistiv", r"nictalopia", r"acessib", r"accessib", r"blind"),
    ),
    (
        "educacao-computacao",
        (r"programac", r"programming", r"pensamento computacional", r"computational thinking", r"app inventor", r"gamific", r"ensino", r"meninas"),
    ),
    (
        "dados-educacionais",
        (r"dados", r"data\b", r"indicador", r"nilo pecanha", r"censo", r"e-mec", r"sistec", r"painel"),
    ),
)
_TEMA_REGEX = tuple(
    (tema, re.compile(r"\b(?:" + "|".join(padroes) + ")"))
    for tema, padroes in TEMA_PADROES
)

_LIGATURA_RE = re.compile(r"[ﬀ-ﬆ]")  # ligaturas de apresentação, ex.: ﬁ (U+FB01)
_ESPACO_INTERMED_Q_RE = re.compile(r"\s\?\s")  # " ? " usado como travessão
_APOSTROFO_Q_RE = re.compile(r"(?<=[^\W\d_])[?¿](?=[^\W\d_])")  # "Children?s", "Children¿s" -> "Children's"
_ALNUM_Q_RE = re.compile(r"(?<=[^\W_])\?(?=[^\W_])")  # "WebMedia?2020" -> "WebMedia 2020"
_ESPACOS_RE = re.compile(r"\s+")
_DOI_PREFIXO_RE = re.compile(r"^(?:doi:\s*|(?:https?://)?(?:dx\.)?doi\.org/)", re.IGNORECASE)
_DOI_VALIDO_RE = re.compile(r"^10\.\d{4,9}/\S+$")
_INICIAL_VAZIA_RE = re.compile(r",\s*\.\s*")  # "SOUSA, . K. L. L." (inicial ausente)


def _unescape(texto: str) -> str:
    """Remove entidades HTML. O Lattes escapa algumas duas vezes (&amp;#64257;)."""
    for _ in range(3):
        novo = html.unescape(texto)
        if novo == texto:
            break
        texto = novo
    return texto


def _normalizar(texto: str) -> str:
    texto = _LIGATURA_RE.sub(lambda m: unicodedata.normalize("NFKC", m.group()), texto)
    texto = unicodedata.normalize("NFC", texto)
    return _ESPACOS_RE.sub(" ", texto).strip()


def clean_text(raw: str | None) -> str:
    """Texto livre (resumos, descrições): entidades, ligaturas e espaços. Preserva '?'."""
    return _normalizar(_unescape(raw or ""))


def clean_title(raw: str | None) -> str:
    """Título ou nome de veículo: além do que clean_text faz, corrige '?' usado como
    apóstrofo ou travessão no lugar de caracteres perdidos na exportação."""
    texto = clean_text(raw)
    texto = _ESPACO_INTERMED_Q_RE.sub(" – ", texto)
    texto = _APOSTROFO_Q_RE.sub("'", texto)
    texto = _ALNUM_Q_RE.sub(" ", texto)
    return _normalizar(texto)


def clean_author(raw: str | None) -> str:
    """Nome para citação, ex.: 'MOMBACH, J. G.'. Remove inicial vazia ('SOUSA, . K.')."""
    texto = clean_text(raw).split(";")[0].strip()
    return _ESPACOS_RE.sub(" ", _INICIAL_VAZIA_RE.sub(", ", texto)).strip()


def normalize_doi(raw: str | None) -> str | None:
    """DOI em minúsculas, sem prefixo de URL. Valores malformados viram None (sem link)."""
    texto = _unescape(raw or "").strip()
    texto = _DOI_PREFIXO_RE.sub("", texto).strip().rstrip(".").lower()
    return texto if _DOI_VALIDO_RE.match(texto) else None


def _fold(texto: str) -> str:
    """Minúsculas e sem acento, para comparação de palavras-chave."""
    decomposto = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in decomposto if not unicodedata.combining(c)).lower()


def slugify(texto: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", _fold(texto)).strip("-")


def classify_theme(titulo: str) -> str:
    """Classifica por palavras-chave (sem acento). Retorna um dos TEMAS."""
    texto = _fold(titulo)
    for tema, regex in _TEMA_REGEX:
        if regex.search(texto):
            return tema
    return "outros"


def _int_ou_none(valor: str | None) -> int | None:
    valor = (valor or "").strip()
    return int(valor) if valor.isdigit() else None


def _ano_obrigatorio(valor: str | None, titulo: str) -> int:
    ano = _int_ou_none(valor)
    if ano is None:
        raise ValueError(f"Ano ausente ou inválido para publicação: {titulo!r}")
    return ano


def _autores(elemento: ET.Element) -> list[str]:
    registros = elemento.findall("AUTORES")
    registros.sort(key=lambda a: (_int_ou_none(a.get("ORDEM-DE-AUTORIA")) or 9999))
    nomes = [clean_author(a.get("NOME-PARA-CITACAO")) for a in registros]
    return [n for n in nomes if n]


def _publicacao(elemento: ET.Element) -> dict[str, Any]:
    if elemento.tag == "ARTIGO-PUBLICADO":
        tipo = "artigo"
        basicos = elemento.find("DADOS-BASICOS-DO-ARTIGO")
        detalhe = elemento.find("DETALHAMENTO-DO-ARTIGO")
        titulo_raw = basicos.get("TITULO-DO-ARTIGO")
        ano_raw = basicos.get("ANO-DO-ARTIGO")
        veiculo_raw = detalhe.get("TITULO-DO-PERIODICO-OU-REVISTA") if detalhe is not None else None
    elif elemento.tag == "TRABALHO-EM-EVENTOS":
        tipo = "evento"
        basicos = elemento.find("DADOS-BASICOS-DO-TRABALHO")
        detalhe = elemento.find("DETALHAMENTO-DO-TRABALHO")
        titulo_raw = basicos.get("TITULO-DO-TRABALHO")
        ano_raw = basicos.get("ANO-DO-TRABALHO")
        veiculo_raw = detalhe.get("NOME-DO-EVENTO") if detalhe is not None else None
    else:
        tipo = "capitulo"
        basicos = elemento.find("DADOS-BASICOS-DO-CAPITULO")
        detalhe = elemento.find("DETALHAMENTO-DO-CAPITULO")
        titulo_raw = basicos.get("TITULO-DO-CAPITULO-DO-LIVRO")
        ano_raw = basicos.get("ANO")
        veiculo_raw = detalhe.get("TITULO-DO-LIVRO") if detalhe is not None else None

    titulo = clean_title(titulo_raw)
    if not titulo:
        raise ValueError(f"Publicação sem título ({tipo})")
    ano = _ano_obrigatorio(ano_raw, titulo)
    doi = normalize_doi(basicos.get("DOI"))
    return {
        "autores": _autores(elemento),
        "ano": ano,
        "doi": doi,
        "id": doi or f"{slugify(titulo)}-{ano}",
        "tema": classify_theme(titulo),
        "tipo": tipo,
        "titulo": titulo,
        "veiculo": clean_title(veiculo_raw),
    }


def _publicacoes(producao: ET.Element | None, overrides: dict[str, dict[str, str]]) -> list[dict[str, Any]]:
    if producao is None:
        return []
    registros = []
    for tag in ("ARTIGO-PUBLICADO", "TRABALHO-EM-EVENTOS", "CAPITULO-DE-LIVRO-PUBLICADO"):
        registros.extend(_publicacao(el) for el in producao.iter(tag))

    for pub in registros:
        ajuste = overrides.get(pub["doi"] or "") or overrides.get(slugify(pub["titulo"]))
        if ajuste and "tema" in ajuste:
            pub["tema"] = ajuste["tema"]

    registros.sort(key=lambda p: (-p["ano"], p["titulo"]))
    vistos: set[str] = set()
    for pub in registros:
        base, n = pub["id"], 2
        while pub["id"] in vistos:
            pub["id"] = f"{base}-{n}"
            n += 1
        vistos.add(pub["id"])
    return registros


# Tipos de formação aceitos. Doutorado incompleto (2017-2019) é excluído.
_FORMACAO_TIPOS = {
    "GRADUACAO": "graduacao",
    "ESPECIALIZACAO": "especializacao",
    "MESTRADO": "mestrado",
    "DOUTORADO": "doutorado",
    "POS-DOUTORADO": "pos-doutorado",
}
_FORMACAO_TITULO = {
    "GRADUACAO": "TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO",
    "ESPECIALIZACAO": "TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO",
}


def _formacao(dados: ET.Element) -> list[dict[str, Any]]:
    formacoes = []
    fa = dados.find("FORMACAO-ACADEMICA-TITULACAO")
    for el in (fa if fa is not None else []):
        if el.tag not in _FORMACAO_TIPOS:
            continue
        status = (el.get("STATUS-DO-CURSO") or "").strip().upper()
        if status == "INCOMPLETO":
            continue
        titulo_tag = _FORMACAO_TITULO.get(el.tag, "TITULO-DA-DISSERTACAO-TESE")
        formacoes.append(
            {
                "conclusao": _int_ou_none(el.get("ANO-DE-CONCLUSAO")),
                "curso": clean_title(el.get("NOME-CURSO")),
                "inicio": _int_ou_none(el.get("ANO-DE-INICIO")),
                "instituicao": clean_title(el.get("NOME-INSTITUICAO")),
                "orientador": clean_title(el.get("NOME-DO-ORIENTADOR") or el.get("NOME-COMPLETO-DO-ORIENTADOR")) or None,
                "status": status.lower(),
                "tipo": _FORMACAO_TIPOS[el.tag],
                "titulo": clean_title(el.get(titulo_tag)) or None,
            }
        )
    formacoes.sort(key=lambda f: (-(f["conclusao"] or f["inicio"] or 0), f["tipo"]))
    return formacoes


def _atuacao(dados: ET.Element) -> list[dict[str, Any]]:
    registros = []
    atuacoes = dados.find("ATUACOES-PROFISSIONAIS")
    for at in (atuacoes if atuacoes is not None else []):
        instituicao = clean_title(at.get("NOME-INSTITUICAO"))
        vinculos = at.findall("VINCULOS")
        if not vinculos:
            registros.append({"cargo": None, "fim": None, "inicio": None, "instituicao": instituicao, "tipo": None})
            continue
        for v in vinculos:
            cargo = clean_title(v.get("OUTRO-ENQUADRAMENTO-FUNCIONAL-INFORMADO")) or None
            registros.append(
                {
                    "cargo": cargo,
                    "fim": _int_ou_none(v.get("ANO-FIM")),
                    "inicio": _int_ou_none(v.get("ANO-INICIO")),
                    "instituicao": instituicao,
                    "tipo": (v.get("TIPO-DE-VINCULO") or "").lower() or None,
                }
            )
    registros.sort(key=lambda a: (a["fim"] is not None, -(a["fim"] or 9999), -(a["inicio"] or 0), a["instituicao"]))
    return registros


def _premios(dados: ET.Element) -> list[dict[str, Any]]:
    premios = []
    pt = dados.find("PREMIOS-TITULOS")
    for p in (pt if pt is not None else []):
        premios.append(
            {
                "ano": _int_ou_none(p.get("ANO-DA-PREMIACAO")),
                "entidade": clean_title(p.get("NOME-DA-ENTIDADE-PROMOTORA")),
                "titulo": clean_title(p.get("NOME-DO-PREMIO-OU-TITULO")),
            }
        )
    premios.sort(key=lambda p: (-(p["ano"] or 0), p["titulo"]))
    return premios


def _projetos(root: ET.Element) -> list[dict[str, Any]]:
    projetos = []
    for p in root.iter("PROJETO-DE-PESQUISA"):
        projetos.append(
            {
                "descricao": clean_text(p.get("DESCRICAO-DO-PROJETO")) or None,
                "fim": _int_ou_none(p.get("ANO-FIM")),
                "inicio": _int_ou_none(p.get("ANO-INICIO")),
                "situacao": (p.get("SITUACAO") or "").lower() or None,
                "titulo": clean_title(p.get("NOME-DO-PROJETO")),
            }
        )
    # Em andamento primeiro (sem ano de fim), depois mais recentes.
    projetos.sort(key=lambda p: (p["fim"] is not None, -(p["inicio"] or 0), p["titulo"]))
    return projetos


def _software(root: ET.Element) -> list[dict[str, Any]]:
    softwares = []
    for sw in root.iter("SOFTWARE"):
        basicos = sw.find("DADOS-BASICOS-DO-SOFTWARE")
        detalhe = sw.find("DETALHAMENTO-DO-SOFTWARE")
        if basicos is None:
            continue
        softwares.append(
            {
                "ano": _int_ou_none(basicos.get("ANO")),
                "finalidade": (clean_title(detalhe.get("FINALIDADE")) or None) if detalhe is not None else None,
                "titulo": clean_title(basicos.get("TITULO-DO-SOFTWARE")),
            }
        )
    softwares.sort(key=lambda s: (-(s["ano"] or 0), s["titulo"]))
    return softwares


def _patente(root: ET.Element) -> dict[str, Any] | None:
    patente = root.find(".//PATENTE/DADOS-BASICOS-DA-PATENTE")
    if patente is None:
        return None
    return {
        "ano": _int_ou_none(patente.get("ANO-DESENVOLVIMENTO")),
        "pais": clean_title(patente.get("PAIS")) or None,
        "titulo": clean_title(patente.get("TITULO")),
    }


def _areas(dados: ET.Element) -> list[str]:
    nomes: list[str] = []
    areas = dados.find("AREAS-DE-ATUACAO")
    for a in (areas if areas is not None else []):
        nome = clean_title(a.get("NOME-DA-AREA-DO-CONHECIMENTO"))
        if nome and nome not in nomes:
            nomes.append(nome)
    return nomes


def parse_lattes(xml_bytes: bytes, overrides: dict[str, dict[str, str]] | None = None) -> dict[str, Any]:
    """Converte o XML do Lattes em dicionário pronto para JSON.

    ``overrides`` mapeia DOI (minúsculas) ou slug do título para ajustes, ex.: {"tema": "..."}.
    """
    root = ET.fromstring(xml_bytes)  # respeita a declaração ISO-8859-1 do arquivo
    dados = root.find("DADOS-GERAIS")
    if dados is None:
        raise ValueError("Seção DADOS-GERAIS ausente no XML")
    overrides = overrides or {}

    resumo_el = dados.find("RESUMO-CV")
    return {
        "areas": _areas(dados),
        "atuacao": _atuacao(dados),
        "formacao": _formacao(dados),
        "patente": _patente(root),
        "premios": _premios(dados),
        "projetos": _projetos(root),
        "publicacoes": _publicacoes(root.find("PRODUCAO-BIBLIOGRAFICA"), overrides),
        "resumo": clean_text(resumo_el.get("TEXTO-RESUMO-CV-RH") if resumo_el is not None else None),
        "software": _software(root),
    }


def load_overrides(path: Path) -> dict[str, dict[str, str]]:
    """Lê data/publicacoes-curadoria.yaml. Chaves: DOI ou slug do título."""
    if not path.exists():
        return {}
    bruto = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(bruto, dict):
        raise ValueError(f"{path.name} deve ser um mapeamento")
    overrides: dict[str, dict[str, str]] = {}
    for chave, valor in bruto.items():
        if not isinstance(valor, dict):
            raise ValueError(f"Ajuste inválido para {chave!r}")
        tema = valor.get("tema")
        if tema is not None and tema not in TEMAS:
            raise ValueError(f"Tema inválido para {chave!r}: {tema!r}")
        overrides[str(chave).strip().lower()] = valor
    return overrides


def render(dados: dict[str, Any]) -> str:
    return json.dumps(dados, ensure_ascii=False, sort_keys=True, indent=2) + "\n"


def main() -> int:
    overrides = load_overrides(CURADORIA_PATH)
    dados = parse_lattes(XML_PATH.read_bytes(), overrides)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(render(dados), encoding="utf-8", newline="\n")

    pubs = dados["publicacoes"]
    por_tipo: dict[str, int] = {}
    for p in pubs:
        por_tipo[p["tipo"]] = por_tipo.get(p["tipo"], 0) + 1
    print(f"publicacoes: {len(pubs)} {dict(sorted(por_tipo.items()))}")
    print(f"  com DOI: {sum(1 for p in pubs if p['doi'])}; sem DOI: {sum(1 for p in pubs if not p['doi'])}")
    print(f"  sem autores: {sum(1 for p in pubs if not p['autores'])}; sem veiculo: {sum(1 for p in pubs if not p['veiculo'])}")
    print(f"formacao: {len(dados['formacao'])}; atuacao: {len(dados['atuacao'])}; premios: {len(dados['premios'])}")
    print(f"projetos: {len(dados['projetos'])}; software: {len(dados['software'])}; patente: {'sim' if dados['patente'] else 'nao'}")
    print(f"saida: {OUT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
