import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { rotasDoBuild } from "../support/rotas";

// Todas as páginas geradas, em três temas: claro (SO), escuro (SO) e escuro escolhido
// manualmente (localStorage, lido pelo script do <head>).
const ROTAS = rotasDoBuild();
const TEMAS = [
  { nome: "claro", esquema: "light" as const, manual: null },
  { nome: "escuro (SO)", esquema: "dark" as const, manual: null },
  { nome: "escuro (manual)", esquema: "light" as const, manual: "dark" },
];
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function preparar(page: Page, tema: (typeof TEMAS)[number]) {
  await page.emulateMedia({ colorScheme: tema.esquema });
  if (tema.manual) {
    await page.addInitScript((valor) => localStorage.setItem("theme", valor), tema.manual);
  }
}

for (const tema of TEMAS) {
  test.describe(`axe — tema ${tema.nome}`, () => {
    test.beforeEach(async ({ page }) => {
      await preparar(page, tema);
    });

    for (const rota of ROTAS) {
      test(`${rota} sem violações WCAG 2.2 AA`, async ({ page }) => {
        const resposta = await page.goto(rota);
        expect(resposta?.status()).toBe(200);
        const resultado = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        const resumo = resultado.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join(" | ")}`,
        );
        expect(resumo, resumo.join("\n")).toEqual([]);
      });
    }
  });
}

test("o script do <head> aplica o tema salvo antes da primeira pintura", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/sobre");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
