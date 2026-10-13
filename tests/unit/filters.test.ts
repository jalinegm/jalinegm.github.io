import { describe, it, expect } from "vitest";
import {
  filterPublicacoes,
  matchesFiltro,
  normalizeText,
  ordenarPublicacoes,
  parseQuery,
  searchText,
  serializeQuery,
} from "../../src/lib/filters";
import type { Publicacao } from "../../src/lib/citation";

const pubs: Publicacao[] = [
  { id: "a", tipo: "artigo", titulo: "Escrita infantil", autores: ["MOMBACH, J."], veiculo: "Rev", ano: 2022, doi: "10.1/x", tema: "alfabetizacao-cci" },
  { id: "b", tipo: "evento", titulo: "Cédulas", autores: ["MOMBACH, J."], veiculo: "SBIE", ano: 2017, doi: null, tema: "acessibilidade" },
  { id: "c", tipo: "evento", titulo: "Jogos e programação", autores: ["SILVA, A."], veiculo: "WebMedia", ano: 2017, doi: null, tema: "educacao-computacao" },
];

describe("filterPublicacoes", () => {
  it("filters by tipo and ano", () => {
    expect(filterPublicacoes(pubs, { tipo: "evento" }).map((p) => p.id)).toEqual(["b", "c"]);
    expect(filterPublicacoes(pubs, { ano: "2022" }).map((p) => p.id)).toEqual(["a"]);
  });

  it("filters by tema and combines filters", () => {
    expect(filterPublicacoes(pubs, { tema: "acessibilidade" }).map((p) => p.id)).toEqual(["b"]);
    expect(filterPublicacoes(pubs, { tipo: "evento", ano: "2017", tema: "educacao-computacao" }).map((p) => p.id)).toEqual(["c"]);
  });

  it("returns everything when no filter is set", () => {
    expect(filterPublicacoes(pubs, {}).length).toBe(3);
    expect(filterPublicacoes(pubs, { tipo: "", ano: "", tema: "", q: "   " }).length).toBe(3);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterPublicacoes(pubs, { tipo: "capitulo" })).toEqual([]);
  });

  it("text search is accent-insensitive", () => {
    expect(filterPublicacoes(pubs, { q: "cedulas" }).map((p) => p.id)).toEqual(["b"]);
    expect(filterPublicacoes(pubs, { q: "CÉDULAS" }).map((p) => p.id)).toEqual(["b"]);
  });

  it("searches authors and venue too", () => {
    expect(filterPublicacoes(pubs, { q: "webmedia" }).map((p) => p.id)).toEqual(["c"]);
    expect(filterPublicacoes(pubs, { q: "silva" }).map((p) => p.id)).toEqual(["c"]);
  });

  it("requires every word of the search to match", () => {
    expect(filterPublicacoes(pubs, { q: "escrita infantil" }).map((p) => p.id)).toEqual(["a"]);
    expect(filterPublicacoes(pubs, { q: "escrita cedulas" })).toEqual([]);
  });

  it("treats regex and HTML characters literally", () => {
    expect(() => filterPublicacoes(pubs, { q: "(" })).not.toThrow();
    expect(() => filterPublicacoes(pubs, { q: "[" })).not.toThrow();
    expect(() => filterPublicacoes(pubs, { q: ".*" })).not.toThrow();
    expect(() => filterPublicacoes(pubs, { q: "\\" })).not.toThrow();
    expect(filterPublicacoes(pubs, { q: "(" })).toEqual([]);
    expect(filterPublicacoes(pubs, { q: "[" })).toEqual([]);
    expect(filterPublicacoes(pubs, { q: ".*" })).toEqual([]);
    expect(filterPublicacoes(pubs, { q: "<script>" })).toEqual([]);
  });
});

describe("matchesFiltro", () => {
  it("accepts numeric ano values", () => {
    expect(matchesFiltro({ tipo: "artigo", ano: 2022, tema: "outros", texto: "x" }, { ano: "2022" })).toBe(true);
    expect(matchesFiltro({ tipo: "artigo", ano: 2022, tema: "outros", texto: "x" }, { ano: "2021" })).toBe(false);
  });
});

describe("searchText", () => {
  it("joins title, authors and venue", () => {
    expect(searchText(pubs[0])).toBe("Escrita infantil MOMBACH, J. Rev");
  });
});

describe("normalizeText", () => {
  it("removes accents and lowercases", () => {
    expect(normalizeText("Educação Ñandú")).toBe("educacao nandu");
  });
});

describe("ordenarPublicacoes", () => {
  it("sorts newest first and then by title", () => {
    expect(ordenarPublicacoes(pubs).map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("does not mutate the input", () => {
    const copia = [...pubs];
    ordenarPublicacoes(pubs);
    expect(pubs).toEqual(copia);
  });
});

describe("parseQuery", () => {
  it("reads all four parameters with or without leading ?", () => {
    expect(parseQuery("?tipo=evento&ano=2017&tema=acessibilidade&q=cedulas")).toEqual({
      tipo: "evento",
      ano: "2017",
      tema: "acessibilidade",
      q: "cedulas",
    });
    expect(parseQuery("tipo=artigo")).toEqual({ tipo: "artigo", ano: "", tema: "", q: "" });
  });

  it("returns empty values for an empty string", () => {
    expect(parseQuery("")).toEqual({ tipo: "", ano: "", tema: "", q: "" });
  });

  it("keeps hostile input as plain text and caps its length", () => {
    expect(parseQuery("?q=%3Cscript%3E").q).toBe("<script>");
    expect(parseQuery(`?q=${"a".repeat(500)}`).q.length).toBe(200);
  });
});

describe("serializeQuery", () => {
  it("omits empty values and returns empty string when nothing is set", () => {
    expect(serializeQuery({ tipo: "", ano: "", tema: "", q: "" })).toBe("");
    expect(serializeQuery({ tipo: "evento", ano: "", tema: "", q: "  " })).toBe("?tipo=evento");
  });

  it("round-trips with parseQuery", () => {
    const q = { tipo: "evento", ano: "2017", tema: "acessibilidade", q: "cédulas (x)" };
    expect(parseQuery(serializeQuery(q))).toEqual(q);
  });
});

// ---- Repositórios (Tarefa 7) ----
import { didaticos, filterRepos, ordenarRepos, type RepoFiltravel } from "../../src/lib/filters";

function repo(over: Partial<RepoFiltravel> & { name: string }): RepoFiltravel {
  return {
    descricao: "",
    linguagem: "Java",
    privado: false,
    ano: 2024,
    tema: null,
    fork: false,
    ocultar: false,
    grupo: null,
    ...over,
  };
}

const repos: RepoFiltravel[] = [
  repo({ name: "painelPosIFFar", descricao: "Painel de indicadores da pós-graduação", linguagem: null, privado: false, ano: 2026 }),
  repo({ name: "baixar-boletins-sigaa", descricao: "Emissão de boletins do SIGAA", linguagem: "Python", privado: false, ano: 2025 }),
  repo({ name: "Rede-DSBR", descricao: "Arquivos do projeto PNP", linguagem: "HTML", privado: true, ano: 2025 }),
  repo({ name: "POO_Aula02", linguagem: "Java", privado: true, ano: 2018, grupo: "didatico" }),
  repo({ name: "oculto-teste", descricao: "não deve aparecer", ocultar: true, ano: 2024 }),
  repo({ name: "react-native-image-modal", descricao: "the simple image modal", linguagem: "TypeScript", fork: true, ano: 2023 }),
];

describe("filterRepos", () => {
  it("returns the main list without hidden or didactic repos when no filter is set", () => {
    const nomes = filterRepos(repos, {}).map((r) => r.name);
    expect(nomes).toEqual(["painelPosIFFar", "baixar-boletins-sigaa", "Rede-DSBR", "react-native-image-modal"]);
  });

  it("excludes ocultar: true and grupo didatico even when a filter would match them", () => {
    expect(filterRepos(repos, { q: "teste" })).toEqual([]);
    expect(filterRepos(repos, { q: "POO" })).toEqual([]);
    expect(filterRepos(repos, { linguagem: "Java" })).toEqual([]);
  });

  it("filters by visibilidade", () => {
    expect(filterRepos(repos, { visibilidade: "privado" }).map((r) => r.name)).toEqual(["Rede-DSBR"]);
    expect(filterRepos(repos, { visibilidade: "publico" }).map((r) => r.name)).toEqual([
      "painelPosIFFar",
      "baixar-boletins-sigaa",
      "react-native-image-modal",
    ]);
  });

  it("ignores an unknown visibilidade value instead of failing", () => {
    expect(filterRepos(repos, { visibilidade: "xpto" as "publico" }).length).toBe(4);
  });

  it("filters by linguagem and ano", () => {
    expect(filterRepos(repos, { linguagem: "Python" }).map((r) => r.name)).toEqual(["baixar-boletins-sigaa"]);
    expect(filterRepos(repos, { ano: 2025 }).map((r) => r.name)).toEqual(["baixar-boletins-sigaa", "Rede-DSBR"]);
    expect(filterRepos(repos, { ano: "2025" }).length).toBe(2);
  });

  it("filters by tema when the repo has one", () => {
    const comTema = [...repos, repo({ name: "com-tema", tema: "acessibilidade", ano: 2024 })];
    expect(filterRepos(comTema, { tema: "acessibilidade" }).map((r) => r.name)).toEqual(["com-tema"]);
  });

  it("searches name and description, accent-insensitive, all words required", () => {
    expect(filterRepos(repos, { q: "SIGAA" }).map((r) => r.name)).toEqual(["baixar-boletins-sigaa"]);
    expect(filterRepos(repos, { q: "emissao boletins" }).map((r) => r.name)).toEqual(["baixar-boletins-sigaa"]);
    expect(filterRepos(repos, { q: "emissao painel" })).toEqual([]);
    expect(filterRepos(repos, { q: "pnp" }).map((r) => r.name)).toEqual(["Rede-DSBR"]);
  });

  it("treats regex and HTML characters literally", () => {
    expect(filterRepos(repos, { q: "(" })).toEqual([]);
    expect(filterRepos(repos, { q: ".*" })).toEqual([]);
    expect(filterRepos(repos, { q: "<script>" })).toEqual([]);
  });

  it("does not mutate the input", () => {
    const copia = [...repos];
    filterRepos(repos, { visibilidade: "privado" });
    expect(repos).toEqual(copia);
  });
});

describe("didaticos", () => {
  it("returns only the didactic group, excluding hidden ones", () => {
    const extra = [...repos, repo({ name: "Sistema", grupo: "didatico", ano: 2019 }), repo({ name: "LISTA1", grupo: "didatico", ocultar: true })];
    expect(didaticos(extra).map((r) => r.name)).toEqual(["POO_Aula02", "Sistema"]);
  });
});

describe("ordenarRepos", () => {
  it("sorts newest first, forks last, then by name", () => {
    expect(ordenarRepos(repos).map((r) => r.name)).toEqual([
      "painelPosIFFar",
      "baixar-boletins-sigaa",
      "Rede-DSBR",
      "oculto-teste",
      "POO_Aula02",
      "react-native-image-modal",
    ]);
  });
});

// ---- Filtros de repositórios na query string (linguagem, visibilidade) ----
describe("query de repositórios", () => {
  it("parseQuery lê linguagem e visibilidade quando presentes", () => {
    expect(parseQuery("?visibilidade=privado&linguagem=Java")).toEqual({
      tipo: "",
      ano: "",
      tema: "",
      q: "",
      visibilidade: "privado",
      linguagem: "Java",
    });
  });

  it("serializeQuery emite linguagem e visibilidade só quando preenchidas e faz round-trip", () => {
    const q = { tipo: "", ano: "2025", tema: "", q: "sigaa", linguagem: "Python", visibilidade: "publico" };
    expect(serializeQuery(q)).toBe("?ano=2025&q=sigaa&linguagem=Python&visibilidade=publico");
    expect(parseQuery(serializeQuery(q))).toEqual(q);
  });

  it("matchesFiltro aplica visibilidade e linguagem a itens que as declaram", () => {
    const item = { tipo: "", ano: 2025, tema: "", texto: "x", visibilidade: "privado", linguagem: "Python" };
    expect(matchesFiltro(item, { visibilidade: "privado" })).toBe(true);
    expect(matchesFiltro(item, { visibilidade: "publico" })).toBe(false);
    expect(matchesFiltro(item, { linguagem: "Java" })).toBe(false);
    expect(matchesFiltro(item, { linguagem: "Python", ano: "2025" })).toBe(true);
  });
});
