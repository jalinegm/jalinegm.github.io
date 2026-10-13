"""Sincroniza os repositórios do GitHub (jalinegm) para src/data/repos.json.

Usa o CLI `gh` local e autenticado (sem tokens no repositório). Imagens de
README públicas vão para public/repos/<nome>.<ext>. Repositórios privados
nunca têm imagem baixada nem URL exposta: só nome, descrição e selo.

Uso (a partir da raiz do repositório):
    .venv\\Scripts\\python.exe -I scripts/repos.py

Saída determinística: lista ordenada por nome, chaves ordenadas, UTF-8 sem BOM,
quebras de linha \\n.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parent.parent
OWNER = "jalinegm"
CURADORIA_PATH = ROOT / "data" / "repos-curadoria.yaml"
OUT_PATH = ROOT / "src" / "data" / "repos.json"
IMG_DIR = ROOT / "public" / "repos"

EXTENSOES_IMAGEM = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")
CAMPOS_CURADORIA = {"descricao", "tema", "destaque", "grupo", "ocultar", "alt", "revisar"}

# Repositórios de material didático (2018-2021), agrupados em <details> no site.
PADROES_DIDATICO = (
    r"POO.*",
    r"LISTA\d+",
    r"Sistema",
    r"FXMLTableView",
    r"PrimeiroProjeto",
    r"Prototipo2",
    r"jogo7erros",
)
_DIDATICO_RE = re.compile(r"(?:" + "|".join(PADROES_DIDATICO) + r")")

_MD_IMG_RE = re.compile(r"!\[[^\]]*\]\(\s*<?([^)\s>]+)")
_HTML_IMG_RE = re.compile(r"<img\b[^>]*?\bsrc\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE)
# Selos (badges) de CI/licença não são a imagem de apresentação do projeto.
_BADGE_RE = re.compile(r"img\.shields\.io|badge|travis-ci|/actions/workflows/", re.IGNORECASE)


def is_didatico(name: str) -> bool:
    return _DIDATICO_RE.fullmatch(name) is not None


def first_readme_image(markdown: str) -> str | None:
    """Primeira imagem do README (Markdown ou <img>), ignorando selos. Pode ser relativa."""
    candidatos: list[tuple[int, str]] = []
    for regex in (_MD_IMG_RE, _HTML_IMG_RE):
        for m in regex.finditer(markdown):
            candidatos.append((m.start(), m.group(1)))
    for _, url in sorted(candidatos):
        if not _BADGE_RE.search(url):
            return url
    return None


def _topicos(api_repo: dict[str, Any]) -> list[str]:
    nomes = []
    for t in api_repo.get("repositoryTopics") or []:
        nome = t.get("name") if isinstance(t, dict) else str(t)
        if nome:
            nomes.append(nome)
    return sorted(nomes)


def merge_curation(api_repo: dict[str, Any], cur: dict[str, Any] | None, imagem: str | None = None) -> dict[str, Any]:
    """Combina os dados da API do GitHub com a curadoria manual (curadoria tem precedência)."""
    cur = cur or {}
    name = api_repo["name"]
    privado = bool(api_repo.get("isPrivate", False))

    if cur.get("descricao"):
        descricao = str(cur["descricao"]).strip()
        descricao_revisar = bool(cur.get("revisar", False))
    else:
        # Sem texto curado em português: usa a descrição da API (se houver) e marca para revisão.
        descricao = (api_repo.get("description") or "").strip()
        descricao_revisar = True

    linguagem_obj = api_repo.get("primaryLanguage") or {}
    updated = api_repo.get("updatedAt") or ""
    alt = cur.get("alt")
    if imagem and not alt:
        alt = f"Captura de tela do projeto {name}"

    return {
        "name": name,
        "url": "" if privado else (api_repo.get("url") or ""),
        "descricao": descricao,
        "descricaoRevisar": descricao_revisar,
        "linguagem": linguagem_obj.get("name") or None,
        "privado": privado,
        "fork": bool(api_repo.get("isFork", False)),
        "ano": int(updated[:4]) if updated else 0,
        "criadoEm": api_repo.get("createdAt") or "",
        "tema": cur.get("tema"),
        "destaque": bool(cur.get("destaque", False)),
        "grupo": cur["grupo"] if "grupo" in cur else ("didatico" if is_didatico(name) else None),
        "ocultar": bool(cur.get("ocultar", False)),
        "imagem": imagem,
        "alt": alt,
        "topicos": _topicos(api_repo),
    }


def build_repos(api_list: list[dict[str, Any]], curadoria: dict[str, dict[str, Any]], imagens: dict[str, str]) -> list[dict[str, Any]]:
    """Monta a lista final ordenada por nome. Imagens: nome -> caminho local do site."""
    nomes_api = {r["name"] for r in api_list}
    for nome in sorted(set(curadoria) - nomes_api):
        print(f"AVISO: curadoria para repositório inexistente ignorada: {nome}", file=sys.stderr)
    repos = []
    for api in api_list:
        nome = api["name"]
        imagem = None if api.get("isPrivate") else imagens.get(nome)
        repos.append(merge_curation(api, curadoria.get(nome), imagem))
    return sorted(repos, key=lambda r: r["name"])


def validar_curadoria(data: Any) -> dict[str, dict[str, Any]]:
    if data is None:
        return {}
    if not isinstance(data, dict):
        raise ValueError("repos-curadoria.yaml deve ser um mapa nome -> campos")
    for nome, campos in data.items():
        if not isinstance(campos, dict):
            raise ValueError(f"{nome}: campos devem ser um mapa")
        extras = set(campos) - CAMPOS_CURADORIA
        if extras:
            raise ValueError(f"{nome}: campos desconhecidos {sorted(extras)}")
        for booleano in ("destaque", "ocultar", "revisar"):
            if booleano in campos and not isinstance(campos[booleano], bool):
                raise ValueError(f"{nome}: {booleano} deve ser true/false")
        if "grupo" in campos and campos["grupo"] not in ("didatico", None):
            raise ValueError(f"{nome}: grupo inválido {campos['grupo']!r}")
    return data


def carregar_curadoria(path: Path = CURADORIA_PATH) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}
    return validar_curadoria(yaml.safe_load(path.read_text(encoding="utf-8")))


# ---------------------------------------------------------------- I/O via gh

def _gh() -> str:
    return shutil.which("gh") or "gh"


def _gh_bytes(args: list[str]) -> subprocess.CompletedProcess[bytes]:
    return subprocess.run([_gh(), *args], capture_output=True, check=False)


def fetch_repos() -> list[dict[str, Any]]:
    campos = ",".join([
        "name", "description", "primaryLanguage", "isPrivate", "isFork", "updatedAt",
        "createdAt", "url", "repositoryTopics", "homepageUrl",
        "usesCustomOpenGraphImage", "openGraphImageUrl",
    ])
    proc = _gh_bytes(["repo", "list", OWNER, "--limit", "200", "--json", campos])
    if proc.returncode != 0:
        raise SystemExit(f"gh repo list falhou: {proc.stderr.decode('utf-8', 'replace').strip()}")
    return json.loads(proc.stdout.decode("utf-8"))


def fetch_readme(name: str) -> str | None:
    proc = _gh_bytes(["api", f"repos/{OWNER}/{name}/readme", "-H", "Accept: application/vnd.github.raw"])
    if proc.returncode != 0:
        return None  # sem README (404) ou erro: segue sem imagem
    return proc.stdout.decode("utf-8", "replace")


def _ext(ref: str) -> str | None:
    suf = Path(urllib.parse.urlparse(ref).path).suffix.lower()
    return suf if suf in EXTENSOES_IMAGEM else None


def download_image(name: str, ref: str, relativo: bool) -> bytes | None:
    if relativo:
        caminho = ref.lstrip("./").lstrip("/")
        proc = _gh_bytes([
            "api", f"repos/{OWNER}/{name}/contents/{urllib.parse.quote(caminho)}",
            "-H", "Accept: application/vnd.github.raw",
        ])
        return proc.stdout if proc.returncode == 0 and proc.stdout else None
    try:
        with urllib.request.urlopen(ref, timeout=20) as resp:  # noqa: S310 - URL pública vinda do README
            return resp.read()
    except Exception as exc:  # rede/404: segue sem imagem
        print(f"AVISO: {name}: não foi possível baixar {ref}: {exc}", file=sys.stderr)
        return None


def sync_images(api_list: list[dict[str, Any]]) -> dict[str, str]:
    """Baixa a imagem de cada repositório público e devolve nome -> caminho do site."""
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    imagens: dict[str, str] = {}
    for api in api_list:
        name = api["name"]
        if api.get("isPrivate"):
            continue  # privado: nada de imagem (conteúdo e URLs podem exigir login)
        readme = fetch_readme(name)
        ref = first_readme_image(readme) if readme else None
        if ref is None and api.get("usesCustomOpenGraphImage") and api.get("openGraphImageUrl"):
            ref = api["openGraphImageUrl"]
        ext = _ext(ref) if ref else None
        if not ref or not ext:
            continue
        dados = download_image(name, ref, relativo=not ref.startswith(("http://", "https://")))
        if not dados:
            continue
        for antiga in IMG_DIR.glob(f"{name}.*"):
            antiga.unlink()
        (IMG_DIR / f"{name}{ext}").write_bytes(dados)
        imagens[name] = f"/repos/{name}{ext}"

    # Remove imagens órfãs de repositórios que deixaram de ter imagem.
    for arquivo in IMG_DIR.iterdir():
        if arquivo.is_file() and arquivo.stem not in imagens and arquivo.stem in {a["name"] for a in api_list}:
            arquivo.unlink()
    return imagens


def main() -> None:
    api_list = fetch_repos()
    curadoria = carregar_curadoria()
    imagens = sync_images(api_list)
    repos = build_repos(api_list, curadoria, imagens)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    texto = json.dumps(repos, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    with OUT_PATH.open("w", encoding="utf-8", newline="\n") as fh:
        fh.write(texto)
    sem_desc = sum(1 for r in repos if r["descricaoRevisar"])
    print(f"{len(repos)} repositórios -> {OUT_PATH.relative_to(ROOT)}")
    print(f"  privados: {sum(r['privado'] for r in repos)}, com imagem: {len(imagens)}, descrição a revisar: {sem_desc}")


if __name__ == "__main__":
    main()
