import fs from "node:fs";
import path from "node:path";

const EXTENSOES = ["png", "jpg", "jpeg", "webp", "gif", "svg"];

/**
 * Convenção: a imagem de um estudo de caso é o arquivo public/projetos/<slug>.<ext>.
 * Sem arquivo, retorna undefined e a lista mostra o espaço reservado.
 */
export function imagemCaso(slug: string): string | undefined {
  for (const ext of EXTENSOES) {
    if (fs.existsSync(path.join(process.cwd(), "public", "projetos", `${slug}.${ext}`))) {
      return `/projetos/${slug}.${ext}`;
    }
  }
  return undefined;
}
