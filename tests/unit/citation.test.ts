import { describe, it, expect } from "vitest";
import { formatCitation, doiUrl, idiomaTitulo, type Publicacao } from "../../src/lib/citation";

const comDoi: Publicacao = {
  id: "a",
  tipo: "artigo",
  titulo: "Escrita infantil",
  autores: ["MOMBACH, J."],
  veiculo: "Rev",
  ano: 2022,
  doi: "10.1/x",
  tema: "alfabetizacao-cci",
};

const semDoi: Publicacao = {
  ...comDoi,
  id: "b",
  tipo: "evento",
  titulo: "Cédulas",
  veiculo: "SBIE",
  ano: 2017,
  doi: null,
  tema: "acessibilidade",
};

describe("formatCitation", () => {
  it("includes DOI only when present", () => {
    expect(formatCitation(comDoi)).toContain("https://doi.org/10.1/x");
    expect(formatCitation(semDoi)).not.toContain("doi.org");
  });

  it("includes authors, title, venue and year", () => {
    const c = formatCitation(comDoi);
    expect(c).toContain("MOMBACH, J.");
    expect(c).toContain("Escrita infantil.");
    expect(c).toContain("Rev, 2022");
  });

  it("does not duplicate final punctuation when the title already ends with one", () => {
    const c = formatCitation({ ...semDoi, titulo: "Isso funciona?" });
    expect(c).toContain("Isso funciona? SBIE, 2017");
    expect(c).not.toContain("?.");
  });

  it("joins several authors with semicolons", () => {
    const c = formatCitation({ ...semDoi, autores: ["A, B.", "C, D."] });
    expect(c.startsWith("A, B.; C, D.")).toBe(true);
  });
});

describe("doiUrl", () => {
  it("builds the doi.org link for valid DOIs", () => {
    expect(doiUrl("10.1109/access.2026.3680147")).toBe("https://doi.org/10.1109/access.2026.3680147");
    expect(doiUrl("10.1007/978-3-030-77889-7_7")).toBe("https://doi.org/10.1007/978-3-030-77889-7_7");
  });

  it("returns null when DOI is missing or malformed", () => {
    expect(doiUrl(null)).toBeNull();
    expect(doiUrl("")).toBeNull();
    expect(doiUrl("   ")).toBeNull();
    expect(doiUrl("javascript:alert(1)")).toBeNull();
    expect(doiUrl("10.1/x y")).toBeNull();
    expect(doiUrl('10.1/x"><script>')).toBeNull();
  });
});

describe("idiomaTitulo", () => {
  it("detects English titles", () => {
    expect(idiomaTitulo("Designing an App for Remotely Children's Spelling Assessment")).toBe("en");
    expect(idiomaTitulo("The New Web Attack Surface: A Taxonomy of Semantic and Agentic Threats in AI Browsers")).toBe("en");
  });

  it("treats Portuguese titles as pt", () => {
    expect(idiomaTitulo("Empoderamento de gênero mediado pelas tecnologias")).toBe("pt");
    expect(idiomaTitulo("Uma abordagem para a promoção de habilidades empreendedoras")).toBe("pt");
  });
});
