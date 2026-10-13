import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import lattes from "../../src/data/lattes.json";

// Verificações sobre o HTML gerado (dist/). Exige `npm run build` antes.
// Cobrem o comportamento sem JavaScript: a lista completa precisa estar no HTML.
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const DIST = join(ROOT, "dist");
const FORBIDDEN = [
  "consultoria", "consultora", "contratar", "contrate", "cliente",
  "serviço", "serviços", "orçamento", "freelance", "hire",
];

const html = (file: string) => readFileSync(join(DIST, file), "utf8");

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error("dist/ não encontrado: rode `npm run build` antes dos testes de páginas");
});

describe("pesquisa/index.html", () => {
  const page = () => html("pesquisa/index.html");

  it("tem exatamente um h1", () => {
    expect(page().match(/<h1[\s>]/g)?.length ?? 0).toBe(1);
  });

  it("nav principal na ordem da spec e aria-current somente em Pesquisa", () => {
    const nav = page().match(/<nav aria-label="Menu principal"[^>]*>([\s\S]*?)<\/nav>/);
    expect(nav).not.toBeNull();
    const hrefs = [...nav![1].matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(["/", "/sobre", "/pesquisa", "/projetos"]);
    const current = [...nav![1].matchAll(/<a href="([^"]+)"[^>]*aria-current="page"/g)].map((m) => m[1]);
    expect(current).toEqual(["/pesquisa"]);
  });

  it("renderiza todas as publicações no HTML (sem JS, nada oculto)", () => {
    const items = page().match(/<li data-tipo="[^"]*"[^>]*>/g) ?? [];
    expect(items.length).toBe(lattes.publicacoes.length);
    for (const li of items) expect(li).not.toMatch(/\shidden[\s>]/);
  });

  it("cada publicação com DOI tem link doi.org e as sem DOI não têm", () => {
    const comDoi = lattes.publicacoes.filter((p) => p.doi).length;
    const links = page().match(/href="https:\/\/doi\.org\/[^"]*"/g) ?? [];
    expect(links.length).toBe(comDoi);
    expect(page()).not.toMatch(/doi\.org\/(undefined|null)/);
  });

  it("região de resultados é aria-live=polite e a lista tem id", () => {
    expect(page()).toMatch(/<p class="resultados" aria-live="polite" data-contagem[^>]*>/);
    expect(page()).toContain('id="publicacoes-lista"');
  });

  it("estado vazio existe, começa oculto e oferece Limpar filtros", () => {
    expect(page()).toMatch(/<div class="vazio" data-vazio hidden[^>]*>/);
    expect(page()).toContain("Limpar filtros");
  });

  it("formulário de filtros usa GET e não reflete a query no HTML", () => {
    expect(page()).toMatch(/<form class="filtros" method="get"/);
    expect(page()).toContain('name="q"');
  });

  it("títulos em inglês são marcados com lang=en", () => {
    expect(page()).toMatch(/<span lang="en"[^>]*>The New Web Attack Surface/);
  });

  it("links externos de DOI têm texto de link externo oculto", () => {
    expect(page()).toMatch(/<span class="visually-hidden"[^>]*> \(link externo\)<\/span>/);
  });

  it("carrega o script de filtros como módulo", () => {
    expect(page()).toMatch(/<script type="module"[^>]*>/);
  });

  it("não contém vocabulário proibido fora da lista de publicações (títulos são citados como constam no Lattes)", () => {
    const h = page();
    const fora = (h.slice(0, h.indexOf('id="publicacoes-lista"')) + h.slice(h.indexOf("</main>"))).toLowerCase();
    for (const word of FORBIDDEN) expect(fora.includes(word), word).toBe(false);
  });
});

describe("pesquisa/<slug>/index.html", () => {
  for (const slug of ["tese-clat", "dissertacao"]) {
    it(`${slug}: um h1, link de PDF e sem DOI quebrado`, () => {
      const page = html(`pesquisa/${slug}/index.html`);
      expect(page.match(/<h1[\s>]/g)?.length ?? 0).toBe(1);
      expect(page).toMatch(/href="\/docs\/[^"]+\.pdf"/);
      expect(page).not.toMatch(/doi\.org\/(undefined|null)/);
      expect(page.toLowerCase()).not.toMatch(/consultori|freelance|cliente/);
    });
  }
});
