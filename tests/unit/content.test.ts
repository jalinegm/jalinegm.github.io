import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import repos from "../../src/data/repos.json";

type Frontmatter = Record<string, any>;
type Doc = { name: string; data: Frontmatter };

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const dir = (...p: string[]) => join(ROOT, "src", "content", ...p);
const mdFiles = (...p: string[]): Doc[] =>
  readdirSync(dir(...p))
    .filter((f: string) => f.endsWith(".md"))
    .map((f: string) => ({ name: f, data: matter(readFileSync(dir(...p, f), "utf8")).data as Frontmatter }));

const repoNames = new Set((repos as { name: string }[]).map((r) => r.name));
const FORBIDDEN = [
  "consultoria", "consultora", "contratar", "contrate", "cliente",
  "serviço", "serviços", "orçamento", "freelance", "hire",
];

describe("casos collection", () => {
  const casos = mdFiles("casos");

  it("includes the eight case studies, including the prompts book", () => {
    expect(casos.length).toBe(8);
  });

  it.each(casos.map((c): [string, Frontmatter] => [c.name, c.data]))("%s has required frontmatter", (_name, d) => {
    expect(typeof d.titulo).toBe("string");
    expect(typeof d.slug).toBe("string");
    expect(typeof d.vinculo).toBe("string");
    expect(typeof d.resumo).toBe("string");
    expect(Array.isArray(d.tecnologias)).toBe(true);
    expect(Array.isArray(d.repos)).toBe(true);
    expect(typeof d.destaque).toBe("boolean");
    expect(typeof d.ordem).toBe("number");
  });

  it("every referenced repo exists in src/data/repos.json", () => {
    for (const c of casos) {
      for (const r of c.data.repos as string[]) {
        expect(repoNames.has(r), `${c.name} -> ${r}`).toBe(true);
      }
    }
  });

  it("has between 3 and 4 featured cases", () => {
    const n = casos.filter((c) => c.data.destaque === true).length;
    expect(n).toBeGreaterThanOrEqual(3);
    expect(n).toBeLessThanOrEqual(4);
  });
});

describe("pesquisa collection", () => {
  const pesquisa = mdFiles("pesquisa");

  it("has thesis and dissertation", () => {
    const slugs = pesquisa.map((p) => p.data.slug);
    expect(slugs).toEqual(expect.arrayContaining(["tese-clat", "dissertacao"]));
  });

  it.each(["tese-clat", "dissertacao"])("%s has a valid https repository url", (slug) => {
    const p = pesquisa.find((x) => x.data.slug === slug);
    expect(p).toBeDefined();
    expect(String(p!.data.repositorioUrl)).toMatch(/^https:\/\//);
  });
});

describe("forbidden vocabulary in content", () => {
  it("no forbidden word appears in src/content", () => {
    const hits: string[] = [];
    for (const sub of ["casos", "pesquisa", "paginas"]) {
      const d = dir(sub);
      if (!existsSync(d)) continue;
      for (const f of readdirSync(d)) {
        const text = readFileSync(join(d, f), "utf8").toLowerCase();
        for (const w of FORBIDDEN) if (text.includes(w)) hits.push(`${sub}/${f}: ${w}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
