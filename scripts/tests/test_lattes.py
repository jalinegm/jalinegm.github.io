from pathlib import Path

from scripts.lattes import classify_theme, clean_title, parse_lattes

FIX = Path(__file__).parent / "fixtures" / "mini-lattes.xml"


def test_entities_unescaped():
    assert clean_title("Ef&#64257;ciency of &apos;apps&apos;") == "Efficiency of 'apps'"


def test_stray_question_mark_becomes_apostrophe_or_dash():
    assert clean_title("Remote Assessing Children?s Handwriting") == "Remote Assessing Children's Handwriting"
    assert clean_title("Anais do EATI ? Encontro") == "Anais do EATI – Encontro"
    assert clean_title("Remotely Children¿s Spelling") == "Remotely Children's Spelling"


def test_doi_optional_and_id_stable():
    data = parse_lattes(FIX.read_bytes())
    pubs = {p["titulo"]: p for p in data["publicacoes"]}
    assert any(p["doi"] is None for p in pubs.values())
    assert all(p["id"] for p in pubs.values())
    assert len({p["id"] for p in pubs.values()}) == len(pubs)


def test_doi_normalized_and_no_broken_link_without_doi():
    data = parse_lattes(FIX.read_bytes())
    for p in data["publicacoes"]:
        if p["doi"] is None:
            assert p["id"].endswith(str(p["ano"]))
        else:
            assert p["doi"] == p["doi"].lower()
            assert not p["doi"].startswith("http")


def test_authors_ordered_and_cleaned():
    data = parse_lattes(FIX.read_bytes())
    pubs = {p["titulo"]: p for p in data["publicacoes"]}
    artigo = next(p for p in pubs.values() if p["tipo"] == "artigo")
    assert artigo["autores"] == ["SOUZA, P.", "MOMBACH, J. G."]
    capitulo = next(p for p in pubs.values() if p["tipo"] == "capitulo")
    assert capitulo["autores"] == ["SOUSA, K. L. L."]


def test_sorted_newest_first_and_deterministic():
    a = parse_lattes(FIX.read_bytes())
    b = parse_lattes(FIX.read_bytes())
    assert a == b
    anos = [p["ano"] for p in a["publicacoes"]]
    assert anos == sorted(anos, reverse=True)


def test_incomplete_doctorate_excluded():
    data = parse_lattes(FIX.read_bytes())
    assert all(f["status"] != "incompleto" for f in data["formacao"])


def test_theme_keywords():
    assert classify_theme("Percepção de imagens por pessoas cegas") == "acessibilidade"
    assert classify_theme("Avaliação da escrita infantil em tablets") == "alfabetizacao-cci"
    assert classify_theme("Ensino de programação com App Inventor") == "educacao-computacao"
    assert classify_theme("Indicadores da Plataforma Nilo Peçanha") == "dados-educacionais"
    assert classify_theme("Algo sem palavra-chave") == "outros"
