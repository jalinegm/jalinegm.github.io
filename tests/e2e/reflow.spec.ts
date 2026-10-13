import { test, expect } from "@playwright/test";
import { rotasDoBuild } from "../support/rotas";

// WCAG 1.4.10: 320 CSS px de largura não podem gerar rolagem horizontal.
test.use({ viewport: { width: 320, height: 640 } });

for (const rota of rotasDoBuild()) {
  test(`${rota} sem rolagem horizontal em 320px`, async ({ page }) => {
    await page.goto(rota);
    const medidas = await page.evaluate(() => ({
      largura: document.documentElement.scrollWidth,
      visivel: document.documentElement.clientWidth,
      // Elementos que ultrapassam a largura da janela (diagnóstico em caso de falha).
      estouros: Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
    }));
    expect(medidas.largura, `estouros: ${medidas.estouros.join(", ")}`).toBeLessThanOrEqual(medidas.visivel);
  });
}
