import type { Publicacao } from "./citation";

/** Estado dos filtros, espelhado na query string (?tipo=&ano=&tema=&q=). */
export interface FiltroQuery {
  tipo: string;
  ano: string;
  tema: string;
  q: string;
}

/** Campos necessários para decidir se um item passa pelos filtros. */
export interface FiltroItem {
  tipo: string;
  ano: string | number;
  tema: string;
  texto: string;
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

export function parseQuery(search: string): FiltroQuery {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    tipo: (params.get("tipo") ?? "").trim(),
    ano: (params.get("ano") ?? "").trim(),
    tema: (params.get("tema") ?? "").trim(),
    q: (params.get("q") ?? "").trim().slice(0, MAX_Q),
  };
}

/** Retorna "" quando não há filtros; caso contrário "?chave=valor&..." (somente valores preenchidos). */
export function serializeQuery(q: FiltroQuery): string {
  const params = new URLSearchParams();
  if (q.tipo.trim()) params.set("tipo", q.tipo.trim());
  if (q.ano.trim()) params.set("ano", q.ano.trim());
  if (q.tema.trim()) params.set("tema", q.tema.trim());
  if (q.q.trim()) params.set("q", q.q.trim());
  const s = params.toString();
  return s ? `?${s}` : "";
}
