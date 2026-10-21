import { t } from "../i18n";
import type { Repo } from "./data";

type Variante = "neutro" | "info" | "alerta";

/**
 * Propriedades do Card para um repositório, com link e selo de visibilidade.
 */
export function cardPropsRepo(r: Repo) {
  // Captura fornecida pela autora; preservada independentemente da sincronização do GitHub.
  const imagens: Record<string, string> = {
    "perfilELD2026": "/projetos/perfil-eld2026.png",
    "alcance-global-citacoes-iffar": "/projetos/mapa-citacoes-iffar.png",
    "mapa_citacoes_iffar": "/projetos/mapa-citacoes-iffar.png",
    "baixar-boletins-sigaa": "/projetos/automacao-academico-regulatoria.png",
    "prompts-livro-iffar": "/projetos/prompts-livro-iffar.png",
    "Rede-DSBR": "/projetos/plataforma-nilo-pecanha.png",
    "painelPosIFFar": "/projetos/paineis-pnp-indicadores/pos-graduacao.webp",
    "relatorios-pnp2026-iffar": "/projetos/paineis-pnp-indicadores/relatorio-campus.webp",
  };
  const imagem = imagens[r.name] ?? r.imagem;
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
    imagem: imagem ?? undefined,
    alt: imagem ? (r.name === "baixar-boletins-sigaa" ? "Boletins SIGAA: seleção de arquivo CSV de matrículas para baixar boletins." : r.alt ?? `Captura de tela do projeto ${r.name}`) : undefined,
    placeholder: imagem ? undefined : (r.linguagem ?? undefined),
    mostrarPlaceholder: !imagem,
  };
}
