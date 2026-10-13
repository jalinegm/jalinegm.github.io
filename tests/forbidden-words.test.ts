import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { DIST, rotasDoBuild } from "./support/rotas";

// Enquadramento institucional (spec §1): nenhuma palavra proibida em nenhum HTML gerado,
// PT e EN, sem diferenciar maiúsculas nem acentos. Exige `npm run build` antes.

const PROIBIDAS = [
  "consultoria", "consultora", "contratar", "contrate", "cliente", "servico", "orcamento", "freelance", "hire",
];
// "serviço(s)" entra como palavra inteira: "serviços" e "servico" sem acento são o mesmo termo após normalização.
const PADRAO = new RegExp(`\\b(?:${PROIBIDAS.join("|")}|servicos?)(?:s)?\\b`, "gi");

/**
 * Exceções documentadas. Cada entrada é uma frase literal (sem acento, minúscula) que aparece em
 * conteúdo de terceiros, copiado do Lattes, e que não descreve atuação ou oferta da autora.
 * A frase é removida antes da busca; qualquer outra ocorrência continua reprovando o build.
 */
const ALLOWLIST: { frase: string; motivo: string }[] = [
  {
    frase: "sistemas produto-servico",
    motivo:
      "Título de publicação de terceiros (Lattes, Uma abordagem para a promoção de habilidades empreendedoras...): " +
      "'sistemas produto-serviço' é termo técnico de sustentabilidade (product-service systems), não oferta de serviço.",
  },
];

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function textoDaPagina(html: string): string {
  let texto = normalizar(html);
  for (const { frase } of ALLOWLIST) texto = texto.split(frase).join(" ");
  return texto;
}

/** Arquivo gerado para uma rota: "/" -> index.html, "/sobre" -> sobre/index.html, "/404.html" -> 404.html. */
const arquivoDaRota = (rota: string) =>
  rota === "/" ? "index.html" : rota.endsWith(".html") ? rota.slice(1) : `${rota.slice(1)}/index.html`;

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error("dist/ não encontrado: rode `npm run build` antes dos testes");
});

describe("palavras proibidas no HTML gerado", () => {
  it("nenhuma página contém termos proibidos (PT/EN, sem acento, maiúsculas indiferentes)", () => {
    const achados: string[] = [];
    for (const rota of rotasDoBuild()) {
      const caminho = arquivoDaRota(rota);
      const html = readFileSync(`${DIST}/${caminho}`, "utf8");
      const texto = textoDaPagina(html);
      for (const m of texto.matchAll(PADRAO)) {
        const i = m.index ?? 0;
        achados.push(`${caminho}: "${m[0]}" em "...${texto.slice(Math.max(0, i - 20), i + m[0].length + 20)}..."`);
      }
    }
    expect(achados, achados.join("\n")).toEqual([]);
  });

  it("a exceção documentada é realmente usada (não é uma exceção morta)", () => {
    const html = readFileSync(`${DIST}/pesquisa/index.html`, "utf8");
    expect(normalizar(html)).toContain(ALLOWLIST[0].frase);
  });
});
