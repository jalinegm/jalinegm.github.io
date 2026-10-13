import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Razões de contraste WCAG 2.x calculadas a partir dos tokens reais de src/styles/tokens.css,
// nos três blocos de tema (claro; escuro pelo SO; escuro manual). Texto >= 4.5:1; UI e foco >= 3:1.

const css = readFileSync(fileURLToPath(new URL("../../src/styles/tokens.css", import.meta.url)), "utf8");

/** Extrai o corpo do bloco cujo seletor contém o trecho dado (primeira ocorrência). */
function bloco(trecho: string): string {
  const i = css.indexOf(trecho);
  if (i < 0) throw new Error(`bloco não encontrado: ${trecho}`);
  const abre = css.indexOf("{", i);
  const fecha = css.indexOf("}", abre);
  return css.slice(abre + 1, fecha);
}

function tokens(corpo: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of corpo.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2];
  return out;
}

function luminancia(hex: string): number {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function razao(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const TEMAS: Record<string, Record<string, string>> = {
  claro: tokens(bloco(":root {")),
  "escuro (SO)": tokens(bloco(':root:not([data-theme="light"])')),
  "escuro (manual)": tokens(bloco(':root[data-theme="dark"]')),
};

const TEXTO = ["text", "text-muted", "link"] as const;
const UI = ["border", "focus"] as const;

describe.each(Object.entries(TEMAS))("contraste no tema %s", (_nome, t) => {
  for (const fundo of ["bg", "surface"]) {
    for (const nome of TEXTO) {
      it(`${nome} sobre ${fundo} >= 4.5:1`, () => {
        expect(razao(t[nome], t[fundo])).toBeGreaterThanOrEqual(4.5);
      });
    }
    for (const nome of UI) {
      it(`${nome} sobre ${fundo} >= 3:1`, () => {
        expect(razao(t[nome], t[fundo])).toBeGreaterThanOrEqual(3);
      });
    }
  }
});

describe("tokens de tema completos", () => {
  it("cada tema define todos os tokens de cor usados", () => {
    for (const [nome, t] of Object.entries(TEMAS)) {
      for (const chave of ["bg", "surface", "text", "text-muted", "link", "border", "accent", "focus"]) {
        expect(t[chave], `${nome}: --color-${chave}`).toBeDefined();
      }
    }
  });
});
