/** Publicação do currículo Lattes (ver src/data/lattes.json, campo publicacoes). */
export interface Publicacao {
  id: string;
  tipo: string;
  titulo: string;
  autores: string[];
  veiculo: string;
  ano: number;
  doi: string | null;
  tema: string;
}

// DOI no formato 10.<registrante>/<sufixo>, sem espaços nem caracteres de HTML.
const DOI_RE = /^10(?:\.\d+)+\/[^\s<>"]+$/;

/** Link https://doi.org/ somente para DOI válido; caso contrário null (sem link quebrado). */
export function doiUrl(doi: string | null | undefined): string | null {
  const limpo = (doi ?? "").trim();
  if (!DOI_RE.test(limpo)) return null;
  return `https://doi.org/${limpo}`;
}

function ponto(texto: string): string {
  return /[.?!]$/.test(texto) ? texto : `${texto}.`;
}

const EN_WORDS = ["the", "and", "of", "for", "with", "in", "using", "an", "to", "from", "on", "by"];
const PT_WORDS = ["de", "da", "do", "das", "dos", "para", "com", "em", "uma", "um", "no", "na", "nos", "nas", "por", "sobre", "que"];

/** Heurística simples por palavras funcionais, para marcar títulos em inglês com lang="en". */
export function idiomaTitulo(titulo: string): "pt" | "en" {
  const palavras = titulo.toLowerCase().split(/[^\p{L}']+/u).filter(Boolean);
  const en = palavras.filter((w) => EN_WORDS.includes(w)).length;
  const pt = palavras.filter((w) => PT_WORDS.includes(w)).length;
  return en >= 2 && en > pt ? "en" : "pt";
}

/**
 * Citação em estilo ABNT simplificado:
 * SOBRENOME, Nome; ... Título. Veículo, ano. DOI: https://doi.org/<doi>
 */
export function formatCitation(p: Publicacao): string {
  const partes: string[] = [];
  if (p.autores.length > 0) partes.push(ponto(p.autores.join("; ")));
  partes.push(ponto(p.titulo));
  partes.push(ponto(`${p.veiculo}, ${p.ano}`));
  const url = doiUrl(p.doi);
  if (url) partes.push(`DOI: ${url}`);
  return partes.join(" ");
}
