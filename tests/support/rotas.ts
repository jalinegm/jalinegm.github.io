import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** Raiz do build estático. Os testes de integração exigem `npm run build` antes. */
export const DIST = fileURLToPath(new URL("../../dist", import.meta.url));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? walk(caminho) : [caminho];
  });
}

/**
 * Converte os HTML gerados em URLs do site: dist/sobre/index.html -> /sobre,
 * dist/index.html -> /, dist/404.html -> /404.html.
 */
export function rotasDoBuild(): string[] {
  return walk(DIST)
    .filter((f) => f.endsWith(".html"))
    .map((f) => relative(DIST, f).split(sep).join("/"))
    .map((rel) => {
      if (rel === "index.html") return "/";
      if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"/index.html".length);
      return "/" + rel;
    })
    .sort();
}
