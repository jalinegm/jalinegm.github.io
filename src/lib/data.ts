import lattesData from "../data/lattes.json";
import reposData from "../data/repos.json";

export type Lattes = typeof lattesData;
/** Registro de src/data/repos.json (gerado por scripts/repos.py). Tipado à mão: o JSON infere `null` para campos sempre vazios. */
export interface Repo {
  name: string;
  /** Link do GitHub; repositórios privados exigem uma conta com acesso. */
  url: string;
  descricao: string;
  descricaoRevisar: boolean;
  linguagem: string | null;
  privado: boolean;
  fork: boolean;
  ano: number;
  criadoEm: string;
  tema: string | null;
  destaque: boolean;
  grupo: string | null;
  ocultar: boolean;
  imagem: string | null;
  alt: string | null;
  topicos: string[];
}

export function getLattes(): Lattes {
  return lattesData;
}

export function getRepos(): Repo[] {
  return reposData as Repo[];
}

/**
 * Resolve repo names to repo records. Throws when a name is missing so that
 * case studies cannot silently reference a repository that does not exist.
 */
export function reposByNames(names: string[]): Repo[] {
  const byName = new Map(getRepos().map((r) => [r.name, r] as const));
  return names.map((name) => {
    const repo = byName.get(name);
    if (!repo) throw new Error(`Repositório não encontrado em repos.json: ${name}`);
    return repo;
  });
}
