import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import repos from "../../src/data/repos.json";
import { didaticos, filterRepos, type RepoFiltravel } from "../../src/lib/filters";

// Verificações sobre o HTML gerado (dist/). Exige `npm run build` antes.
// Cobrem o comportamento sem JavaScript: catálogo completo no HTML e privacidade dos repositórios.
const DIST = join(fileURLToPath(new URL("../..", import.meta.url)), "dist");
const FORBIDDEN = [
  "consultoria", "consultora", "contratar", "contrate", "cliente",
  "serviço", "serviços", "orçamento", "freelance", "hire",
];
const CASOS = ["clat", "identificador-cedulas", "paineis-pnp-indicadores", "automacao-academico-regulatoria", "cecate-nordeste", "plataforma-nilo-pecanha", "prompts-livro-iffar"];
const PRIVADO = "Privado — acesso sob convite";

type Repo = (typeof repos)[number];
const html = (file: string) => readFileSync(join(DIST, file), "utf8");
const h1Count = (h: string) => h.match(/<h1[\s>]/g)?.length ?? 0;
// Nome de repositório como texto de elemento (Astro pode acrescentar espaços em volta).
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
const comoTexto = (nome: string) => new RegExp(">\\s*" + escapeRe(nome) + "\\s*<");

const principal = filterRepos(repos as RepoFiltravel[], {}) as Repo[];
const didaticas = didaticos(repos as RepoFiltravel[]) as Repo[];
const privados = (repos as Repo[]).filter((r) => r.privado && !r.ocultar);

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error("dist/ não encontrado: rode `npm run build` antes dos testes de páginas");
});

describe("projetos/index.html", () => {
  const page = () => html("projetos/index.html");

  it("tem exatamente um h1", () => {
    expect(h1Count(page())).toBe(1);
  });

  it("nav principal com Projetos marcado como atual", () => {
    const nav = page().match(/<nav aria-label="Menu principal"[^>]*>([\s\S]*?)<\/nav>/)![1];
    const current = [...nav.matchAll(/<a href="([^"]+)"[^>]*aria-current="page"/g)].map((m) => m[1]);
    expect(current).toEqual(["/projetos"]);
  });

  it("lista principal renderiza todos os repositórios filtráveis, sem JS e sem item oculto", () => {
    const items = page().match(/<li data-filtro-item[^>]*>/g) ?? [];
    expect(items.length).toBe(principal.length);
    for (const li of items) expect(li).not.toMatch(/\shidden[\s>]/);
  });

  it("não lista repositórios ocultos nem didáticos na lista principal", () => {
    const h = page();
    for (const r of repos as Repo[]) {
      if (r.ocultar) expect(h, r.name).not.toMatch(comoTexto(r.name));
    }
    const principalHtml = h.slice(h.indexOf("data-filtro-item"), h.indexOf("<details"));
    for (const r of didaticas) expect(principalHtml, r.name).not.toMatch(comoTexto(r.name));
  });

  it("repositórios privados mantêm links para acesso autenticado", () => {
    const h = page();
    for (const r of privados) {
      expect(h, r.name).toContain(`href="${r.url}"`);
    }
    expect(h).not.toMatch(/raw\.githubusercontent\.com/);
  });

  it("repositórios públicos da lista principal linkam para o GitHub", () => {
    const h = page();
    for (const r of principal.filter((x) => !x.privado)) {
      expect(h, r.name).toContain(`href="${r.url}"`);
    }
  });

  it("cada repositório privado exibe o selo de acesso sob convite", () => {
    const principalPriv = principal.filter((r) => r.privado).length;
    const selos = page().split(PRIVADO).length - 1;
    expect(selos).toBeGreaterThanOrEqual(principalPriv);
  });

  it("material didático fica em <details> recolhido", () => {
    const h = page();
    expect(h).toMatch(/<details class="didatico"(?![^>]*\sopen)[^>]*>/);
    expect(h).toContain("Material didático (2018–2021)");
    const bloco = h.slice(h.indexOf('<details class="didatico"'), h.indexOf("</details>"));
    for (const r of didaticas) expect(bloco, r.name).toMatch(comoTexto(r.name));
  });

  it("estudos de caso linkam para os projetos selecionados", () => {
    const h = page();
    for (const slug of CASOS) expect(h).toContain(`href="/projetos/${slug}"`);
  });

  it("formulário de filtros com visibilidade, linguagem, ano e busca, mirrored em GET", () => {
    const h = page();
    expect(h).toMatch(/<form class="filtros" method="get"[^>]*data-filtro/);
    // Astro acrescenta atributos de escopo (data-astro-cid-*), por isso o padrão não fixa a ordem.
    expect(h).toMatch(/<select[^>]*name="visibilidade"/);
    expect(h).toMatch(/<select[^>]*name="linguagem"/);
    expect(h).toMatch(/<select[^>]*name="ano"/);
    expect(h).toMatch(/<input[^>]*name="q"/);
    expect(h).toMatch(/<p class="resultados" aria-live="polite" data-contagem/);
    expect(h).toMatch(/<div class="vazio" data-vazio hidden/);
  });

  it("imagens têm alt e espaços reservados são decorativos", () => {
    const h = page();
    for (const img of h.match(/<img [^>]*>/g) ?? []) expect(img).toMatch(/\salt="/);
    expect(h).toMatch(/class="card-placeholder" aria-hidden="true"/);
  });

  it("não contém vocabulário proibido", () => {
    const text = page().toLowerCase();
    for (const word of FORBIDDEN) expect(text.includes(word), word).toBe(false);
  });
});

describe.each(CASOS)("projetos/%s/index.html", (slug) => {
  const file = `projetos/${slug}/index.html`;

  it("existe, tem um h1 e breadcrumbs até Projetos", () => {
    const h = html(file);
    expect(h1Count(h)).toBe(1);
    expect(h).toMatch(/<nav aria-label="Você está em"/);
    expect(h).toContain('href="/projetos"');
  });

  it("repositórios relacionados privados mantêm links quando exibidos", () => {
    const h = html(file);
    for (const r of privados) {
      if (comoTexto(r.name).test(h)) expect(h, r.name).toContain(`href="${r.url}"`);
    }
  });

  it("não contém vocabulário proibido", () => {
    const text = html(file).toLowerCase();
    for (const word of FORBIDDEN) expect(text.includes(word), word).toBe(false);
  });
});

describe("projetos/clat/index.html", () => {
  it("linka a tese relacionada em /pesquisa/tese-clat", () => {
    expect(html("projetos/clat/index.html")).toContain('href="/pesquisa/tese-clat"');
  });
});
