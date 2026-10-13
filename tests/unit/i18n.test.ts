import { describe, it, expect } from "vitest";
import { t } from "../../src/i18n";

describe("t", () => {
  it("returns the string for a known key", () => {
    expect(t("nav.inicio")).toBe("Início");
  });
  it("interpolates variables", () => {
    expect(t("filtro.resultados", { n: 12 })).toBe("12 publicações encontradas");
  });
  it("throws on missing key", () => {
    expect(() => t("nao.existe")).toThrow(/nao.existe/);
  });
});
