import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Smoke test sobre o HTML gerado (dist/). Exige `npm run build` antes.
// Substitui temporariamente o teste Playwright da Tarefa 5 (ainda sem Playwright instalado).
const DIST = join(fileURLToPath(new URL("../..", import.meta.url)), "dist");
const NAV_ORDER = ["/", "/pesquisa", "/projetos"];
const FORBIDDEN = [
  "consultoria", "consultora", "contratar", "contrate", "cliente",
  "serviço", "serviços", "orçamento", "freelance", "hire",
];
const PAGES: { file: string; current: string | null }[] = [
  { file: "index.html", current: "/" },
  { file: "colaboracao/index.html", current: null }, // fora da nav principal (botão da home e rodapé)
  { file: "404.html", current: null },
];

const html = (file: string) => readFileSync(join(DIST, file), "utf8");

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error("dist/ não encontrado: rode `npm run build` antes dos testes de páginas");
});

describe.each(PAGES)("página $file", ({ file, current: esperado }) => {
  it("tem exatamente um h1", () => {
    expect(html(file).match(/<h1[\s>]/g)?.length ?? 0).toBe(1);
  });

  it("começa com o link de pular conteúdo apontando para #conteudo", () => {
    const first = html(file).match(/<a [^>]*>/);
    expect(first?.[0]).toContain('class="skip-link"');
    expect(first?.[0]).toContain('href="#conteudo"');
  });

  it("nav principal tem as entradas na ordem da navegação", () => {
    const nav = html(file).match(/<nav aria-label="Menu principal"[^>]*>([\s\S]*?)<\/nav>/);
    expect(nav).not.toBeNull();
    const hrefs = [...nav![1].matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(NAV_ORDER);
  });

  it("aria-current=page marca somente a página atual (nunca no 404)", () => {
    const nav = html(file).match(/<nav aria-label="Menu principal"[^>]*>([\s\S]*?)<\/nav>/)![1];
    const current = [...nav.matchAll(/<a href="([^"]+)"[^>]*aria-current="page"/g)].map((m) => m[1]);
    expect(current).toEqual(esperado ? [esperado] : []);
  });

  it("toda imagem tem alt", () => {
    for (const img of html(file).match(/<img [^>]*>/g) ?? []) expect(img).toMatch(/\salt="/);
  });

  it("não contém vocabulário proibido", () => {
    const text = html(file).toLowerCase();
    for (const word of FORBIDDEN) expect(text.includes(word), word).toBe(false);
  });
});
