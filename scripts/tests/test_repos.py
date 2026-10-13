import json
from pathlib import Path

from scripts.repos import build_repos, first_readme_image, is_didatico, merge_curation, validar_curadoria

FIX = Path(__file__).parent / "fixtures" / "gh-repos-mini.json"


def test_curation_overrides_api_description():
    api = {"name": "x", "description": "en text", "isPrivate": True}
    out = merge_curation(api, {"descricao": "texto PT"})
    assert out["descricao"] == "texto PT"


def test_missing_description_flags_revisar():
    out = merge_curation({"name": "x", "description": None, "isPrivate": False}, None)
    assert out["descricao"] == "" and out["descricaoRevisar"] is True


def test_first_image_markdown_and_html():
    assert first_readme_image("![a](docs/p.png) text") == "docs/p.png"
    assert first_readme_image('<img src="https://x/y.jpg" width=3>') == "https://x/y.jpg"
    assert first_readme_image("no image") is None


def test_first_image_skips_badges():
    readme = "![build](https://img.shields.io/badge/x.svg)\n\n![tela](docs/tela.png)"
    assert first_readme_image(readme) == "docs/tela.png"


def test_didatico_patterns():
    for n in ["POO2019", "LISTA1", "Sistema", "FXMLTableView", "PrimeiroProjeto", "Prototipo2", "jogo7erros"]:
        assert is_didatico(n)
    assert not is_didatico("baixar-boletins-sigaa")
    assert not is_didatico("Sistemas-web")


def test_private_repo_never_exposes_url_or_image():
    api = {"name": "Rede-DSBR", "description": None, "isPrivate": True, "url": "https://github.com/jalinegm/Rede-DSBR"}
    out = merge_curation(api, None, imagem=None)
    assert out["privado"] is True
    assert out["url"] == ""
    assert out["imagem"] is None


def test_build_repos_is_sorted_and_deterministic():
    api_list = json.loads(FIX.read_text(encoding="utf-8"))
    curadoria = {"baixar-boletins-sigaa": {"tema": "automacao", "destaque": True}}
    imagens = {"baixar-boletins-sigaa": "/repos/baixar-boletins-sigaa.png", "Rede-DSBR": "/repos/Rede-DSBR.png"}
    primeira = build_repos(api_list, curadoria, imagens)
    segunda = build_repos(list(reversed(api_list)), curadoria, imagens)
    assert primeira == segunda
    assert [r["name"] for r in primeira] == sorted(r["name"] for r in api_list)


def test_build_repos_fixture_rules():
    api_list = json.loads(FIX.read_text(encoding="utf-8"))
    repos = {r["name"]: r for r in build_repos(api_list, {}, {"baixar-boletins-sigaa": "/repos/baixar-boletins-sigaa.png"})}

    # privado sem descrição: placeholder vazio, revisão marcada, grupo didático, sem URL nem imagem
    assert repos["POO_Aula02"]["privado"] and repos["POO_Aula02"]["descricao"] == ""
    assert repos["POO_Aula02"]["descricaoRevisar"] is True
    assert repos["POO_Aula02"]["grupo"] == "didatico"
    assert repos["POO_Aula02"]["url"] == ""
    assert repos["Sistema"]["grupo"] == "didatico"

    # privado com imagem na API (OpenGraph) não pode vazar a URL
    assert repos["Rede-DSBR"]["imagem"] is None
    assert "opengraph" not in json.dumps(repos["Rede-DSBR"])

    # público com imagem local, fork e linguagem nula
    assert repos["baixar-boletins-sigaa"]["imagem"] == "/repos/baixar-boletins-sigaa.png"
    assert repos["baixar-boletins-sigaa"]["alt"] == "Captura de tela do projeto baixar-boletins-sigaa"
    assert repos["baixar-boletins-sigaa"]["topicos"] == ["playwright", "sigaa"]
    assert repos["baixar-boletins-sigaa"]["ano"] == 2026
    assert repos["react-native-image-modal"]["fork"] is True
    assert repos["Rede-DSBR"]["linguagem"] is None


def test_validar_curadoria_rejects_unknown_fields():
    try:
        validar_curadoria({"x": {"descrição": "typo"}})
    except ValueError as exc:
        assert "desconhecidos" in str(exc)
    else:
        raise AssertionError("campo desconhecido deveria falhar")
