import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { DIST, rotasDoBuild } from "./support/rotas";

// Links internos do build: cada href/src local aponta para um arquivo existente, e cada
// #fragmento tem um id correspondente na página de destino. Exige `npm run build` antes.

const arquivoDaRota = (rota: string) =>
  rota === "/" ? "index.html" : rota.endsWith(".html") ? rota.slice(1) : `${rota.slice(1)}/index.html`;

/** Arquivo do build para um caminho absoluto do site (/x, /x/, /x.pdf). */
function arquivoDoCaminho(caminho: string): string | null {
  const limpo = decodeURIComponent(caminho.split("?")[0]).replace(/\/+$/, "");
  const candidatos = limpo === "" ? ["index.html"] : [
    `${limpo.slice(1)}`,
    `${limpo.slice(1)}/index.html`,
    `${limpo.slice(1)}.html`,
  ];
  for (const c of candidatos) {
    const abs = `${DIST}/${c}`;
    if (existsSync(abs) && statSync(abs).isFile()) return c;
  }
  return null;
}

const ids = new Map<string, Set<string>>();
const idsDe = (arquivo: string) => {
  if (!ids.has(arquivo)) {
    const html = readFileSync(`${DIST}/${arquivo}`, "utf8");
    ids.set(arquivo, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return ids.get(arquivo)!;
};

const referencias = rotasDoBuild().map((rota) => ({
  pagina: arquivoDaRota(rota),
  html: readFileSync(`${DIST}/${arquivoDaRota(rota)}`, "utf8"),
}));

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error("dist/ não encontrado: rode `npm run build` antes dos testes");
});

describe("links internos do build", () => {
  it("todo href/src local aponta para um arquivo gerado e todo #fragmento tem destino", () => {
    const quebrados: string[] = [];
    for (const { pagina, html } of referencias) {
      for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
        const alvo = m[1];
        if (!alvo.startsWith("/") && !alvo.startsWith("#")) continue; // externos e mailto: ficam de fora
        const [caminho, fragmento] = alvo.split("#");
        const arquivo = caminho === "" ? pagina : arquivoDoCaminho(caminho);
        if (arquivo === null) {
          quebrados.push(`${pagina}: ${alvo} (arquivo inexistente)`);
          continue;
        }
        if (fragmento && !idsDe(arquivo).has(fragmento)) {
          quebrados.push(`${pagina}: ${alvo} (id "${fragmento}" inexistente em ${arquivo})`);
        }
      }
    }
    expect(quebrados, quebrados.join("\n")).toEqual([]);
  });

  it("há links internos suficientes para o teste ser significativo", () => {
    const total = referencias.reduce((n, r) => n + [...r.html.matchAll(/\shref="\//g)].length, 0);
    expect(total).toBeGreaterThan(20);
  });
});
