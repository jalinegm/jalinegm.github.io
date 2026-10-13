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
