import { test, expect } from "@playwright/test";
import repos from "../../src/data/repos.json";

const CASOS = [
  "clat",
  "identificador-cedulas",
  "paineis-pnp-indicadores",
  "automacao-academico-regulatoria",
  "alcance-global-citacoes",
  "cecate-nordeste",
];
const PRIVADO = "Privado — acesso sob convite";
const privados = repos.filter((r) => r.privado && !r.ocultar).map((r) => r.name);

test.describe("páginas de projeto", () => {
  for (const slug of CASOS) {
    test(`/projetos/${slug} responde 200 com um único h1`, async ({ page }) => {
      const resposta = await page.goto(`/projetos/${slug}`);
      expect(resposta?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }
});

test.describe("catálogo de repositórios", () => {
  test("repositório privado exibe o selo de acesso sob convite", async ({ page }) => {
    await page.goto("/projetos");
    await expect(page.getByText(PRIVADO).first()).toBeVisible();
  });

  test("nenhum link do catálogo aponta para um repositório privado", async ({ page }) => {
    await page.goto("/projetos");
    const hrefs = await page.locator("a[href*='github.com/jalinegm/']").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href") ?? ""),
    );
    for (const nome of privados) {
      expect(hrefs.some((h) => h.endsWith(`/${nome}`))).toBe(false);
    }
  });

  test("material didático é um <details> recolhido que abre e fecha pelo teclado", async ({ page }) => {
    await page.goto("/projetos");
    const bloco = page.locator("details.didatico");
    const resumo = bloco.locator("summary");
    await expect(bloco).not.toHaveAttribute("open", "");
    await resumo.focus();
    await page.keyboard.press("Enter");
    await expect(bloco).toHaveAttribute("open", "");
    await resumo.focus();
    await page.keyboard.press("Space");
    await expect(bloco).not.toHaveAttribute("open", "");
  });

  test("?visibilidade=privado mostra somente repositórios privados", async ({ page }) => {
    await page.goto("/projetos?visibilidade=privado");
    const visiveis = page.locator("li[data-filtro-item]:not([hidden])");
    const quantidade = await visiveis.count();
    expect(quantidade).toBeGreaterThan(0);
    for (let i = 0; i < quantidade; i++) {
      await expect(visiveis.nth(i)).toHaveAttribute("data-visibilidade", "privado");
    }
    await expect(page.locator("[data-contagem]")).toHaveText(`${quantidade} repositórios encontrados`);
  });

  test("busca sem resultados mostra o estado vazio com Limpar filtros", async ({ page }) => {
    await page.goto("/projetos");
    await page.fill("#repos-lista-q", "zzzz-sem-resultado");
    await page.locator("form[data-filtro]").dispatchEvent("input");
    await expect(page.locator("[data-vazio]")).toBeVisible();
    await expect(page.locator("[data-vazio]").getByText("Limpar filtros")).toBeVisible();
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("catálogo completo visível no HTML", async ({ page }) => {
    await page.goto("/projetos");
    const itens = page.locator("li[data-filtro-item]");
    const total = await itens.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      await expect(itens.nth(i)).toBeVisible();
    }
  });
});
