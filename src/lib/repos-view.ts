import { t } from "../i18n";
import type { Repo } from "./data";

type Variante = "neutro" | "info" | "alerta";

/**
 * Propriedades do Card para um repositório. Repositórios privados não têm URL
 * (url === "") e por isso nunca viram link; o selo explica o acesso sob convite.
 */
export function cardPropsRepo(r: Repo) {
  const badges: { variante: Variante; texto: string }[] = [
    r.privado
      ? { variante: "alerta", texto: t("repos.privado") }
      : { variante: "neutro", texto: t("repos.publico") },
  ];
  if (r.linguagem) badges.push({ variante: "neutro", texto: r.linguagem });
  if (r.ano > 0) badges.push({ variante: "neutro", texto: t("repos.atualizado", { ano: r.ano }) });
  if (r.fork) badges.push({ variante: "neutro", texto: t("repos.fork") });

  return {
    titulo: r.name,
    href: r.url || undefined,
    externo: Boolean(r.url),
    descricao: r.descricao || t("repos.semDescricao"),
    // Descrições de forks vêm do GitHub em inglês (ver descricaoRevisar).
    descricaoLang: r.fork && r.descricao ? "en" : undefined,
    badges,
    imagem: r.imagem ?? undefined,
    alt: r.imagem ? (r.alt ?? `Captura de tela do projeto ${r.name}`) : undefined,
    placeholder: r.imagem ? undefined : (r.linguagem ?? undefined),
  };
}
