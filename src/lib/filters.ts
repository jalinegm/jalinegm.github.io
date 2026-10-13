import type { Publicacao } from "./citation";

/** Estado dos filtros, espelhado na query string (?tipo=&ano=&tema=&q=). */
export interface FiltroQuery {
  tipo: string;
  ano: string;
  tema: string;
  q: string;
  /** Usados só pelo catálogo de repositórios; ausentes nas publicações. */
  linguagem?: string;
  visibilidade?: string;
}

/** Campos necessários para decidir se um item passa pelos filtros. */
export interface FiltroItem {
  tipo: string;
  ano: string | number;
  tema: string;
  texto: string;
  linguagem?: string | null;
  visibilidade?: string;
}

const MAX_Q = 200;

/** Minúsculas e sem acentos. Nunca gera RegExp a partir da entrada do usuário. */
export function normalizeText(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** Texto pesquisável de uma publicação: título, autores e veículo. */
export function searchText(p: Publicacao): string {
  return [p.titulo, p.autores.join(" "), p.veiculo].join(" ");
}

export function matchesFiltro(item: FiltroItem, q: Partial<FiltroQuery>): boolean {
  if (q.tipo && item.tipo !== q.tipo) return false;
  if (q.ano && String(item.ano) !== q.ano) return false;
  if (q.tema && item.tema !== q.tema) return false;
  if (q.linguagem && item.linguagem !== q.linguagem) return false;
  if (q.visibilidade && item.visibilidade !== q.visibilidade) return false;
  const termos = normalizeText(q.q ?? "").split(/\s+/).filter(Boolean);
  if (termos.length === 0) return true;
  const texto = normalizeText(item.texto);
  // Todas as palavras precisam aparecer (E lógico); comparação literal com includes.
  return termos.every((termo) => texto.includes(termo));
}

export function filterPublicacoes(items: Publicacao[], q: Partial<FiltroQuery>): Publicacao[] {
  return items.filter((p) =>
    matchesFiltro({ tipo: p.tipo, ano: p.ano, tema: p.tema, texto: searchText(p) }, q),
  );
}

/** Mais recentes primeiro; empate por título em ordem pt-BR. Não altera a entrada. */
export function ordenarPublicacoes(items: Publicacao[]): Publicacao[] {
  return [...items].sort(
    (a, b) => b.ano - a.ano || a.titulo.localeCompare(b.titulo, "pt-BR"),
  );
}

const CHAVES_EXTRAS = ["linguagem", "visibilidade"] as const;

export function parseQuery(search: string): FiltroQuery {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const q: FiltroQuery = {
    tipo: (params.get("tipo") ?? "").trim(),
    ano: (params.get("ano") ?? "").trim(),
    tema: (params.get("tema") ?? "").trim(),
    q: (params.get("q") ?? "").trim().slice(0, MAX_Q),
  };
  for (const chave of CHAVES_EXTRAS) {
    if (params.has(chave)) q[chave] = (params.get(chave) ?? "").trim();
  }
  return q;
}

/** Retorna "" quando não há filtros; caso contrário "?chave=valor&..." (somente valores preenchidos). */
export function serializeQuery(q: FiltroQuery): string {
  const params = new URLSearchParams();
  if (q.tipo.trim()) params.set("tipo", q.tipo.trim());
  if (q.ano.trim()) params.set("ano", q.ano.trim());
  if (q.tema.trim()) params.set("tema", q.tema.trim());
  if (q.q.trim()) params.set("q", q.q.trim());
  for (const chave of CHAVES_EXTRAS) {
    const valor = q[chave]?.trim();
    if (valor) params.set(chave, valor);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

// ---- Repositórios (catálogo de /projetos) ----

/** Campos de um repositório usados pelos filtros (compatível com src/data/repos.json). */
export interface RepoFiltravel {
  name: string;
  descricao: string;
  linguagem: string | null;
  privado: boolean;
  ano: number;
  tema: string | null;
  fork: boolean;
  ocultar: boolean;
  grupo: string | null;
}

export interface RepoFiltroQuery {
  tema?: string;
  linguagem?: string;
  visibilidade?: "publico" | "privado";
  ano?: string | number;
  q?: string;
}

/**
 * Lista principal do catálogo: sem repositórios ocultos nem o grupo didático
 * (que tem lista própria, ver `didaticos`). Filtros inválidos são ignorados.
 */
export function filterRepos<T extends RepoFiltravel>(items: T[], q: RepoFiltroQuery): T[] {
  const termos = normalizeText(q.q ?? "").split(/\s+/).filter(Boolean);
  return items.filter((r) => {
    if (r.ocultar || r.grupo === "didatico") return false;
    if (q.visibilidade === "publico" && r.privado) return false;
    if (q.visibilidade === "privado" && !r.privado) return false;
    if (q.linguagem && r.linguagem !== q.linguagem) return false;
    if (q.tema && r.tema !== q.tema) return false;
    if (q.ano && String(r.ano) !== String(q.ano)) return false;
    const texto = normalizeText(`${r.name} ${r.descricao}`);
    return termos.every((termo) => texto.includes(termo));
  });
}

/** Material didático (2018–2021), exibido em bloco recolhido; ocultos ficam de fora. */
export function didaticos<T extends RepoFiltravel>(items: T[]): T[] {
  return items.filter((r) => r.grupo === "didatico" && !r.ocultar);
}

/** Mais recentes primeiro, forks por último, empate por nome em ordem pt-BR. Não altera a entrada. */
export function ordenarRepos<T extends RepoFiltravel>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      Number(a.fork) - Number(b.fork) ||
      b.ano - a.ano ||
      a.name.localeCompare(b.name, "pt-BR"),
  );
}
