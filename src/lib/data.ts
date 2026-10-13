import lattesData from "../data/lattes.json";
import reposData from "../data/repos.json";

export type Lattes = typeof lattesData;
export type Repo = (typeof reposData)[number];

export function getLattes(): Lattes {
  return lattesData;
}

export function getRepos(): Repo[] {
  return reposData;
}

/**
 * Resolve repo names to repo records. Throws when a name is missing so that
 * case studies cannot silently reference a repository that does not exist.
 */
export function reposByNames(names: string[]): Repo[] {
  const byName = new Map(reposData.map((r) => [r.name, r] as const));
  return names.map((name) => {
    const repo = byName.get(name);
    if (!repo) throw new Error(`Repositório não encontrado em repos.json: ${name}`);
    return repo;
  });
}
