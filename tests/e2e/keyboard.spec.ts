import { test, expect, type Page } from "@playwright/test";
import { rotasDoBuild } from "../support/rotas";

const ROTAS = rotasDoBuild().filter((r) => r !== "/404.html");

/** Elemento focado agora, com a identificação necessária para comparar sequências. */
async function focoAtual(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return "body";
    return `${el.tagName.toLowerCase()}#${el.id}|${el.textContent?.trim().slice(0, 40)}`;
  });
}

test.describe("link para pular conteúdo", () => {
  test("primeiro foco é o link e Enter move o foco para <main>", async ({ page }) => {
    await page.goto("/sobre");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await expect(page.locator(".skip-link")).toBeVisible();
    await page.keyboard.press("Enter");
    const alvo = await page.evaluate(() => document.activeElement?.id);
    expect(alvo).toBe("conteudo");
    // Depois do link, a próxima Tab cai dentro do conteúdo, não no cabeçalho.
    await page.keyboard.press("Tab");
    const dentroMain = await page.evaluate(() => Boolean(document.activeElement?.closest("main")));
    expect(dentroMain).toBe(true);
  });
});

test.describe("foco visível e sem armadilhas", () => {
  for (const rota of ROTAS) {
    test(`${rota}: todo elemento focado tem contorno >= 2px e não fica sob outro elemento`, async ({ page }) => {
      await page.goto(rota);
      const problemas: string[] = [];
      const visitados = new Set<string>();
      for (let i = 0; i < 80; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          el.scrollIntoView({ block: "center", inline: "nearest" });
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const topo = document.elementFromPoint(cx, cy);
          const sobreposto = topo !== null && !el.contains(topo) && !topo.contains(el);
          return {
            id: `${el.tagName.toLowerCase()}#${el.id}|${(el.textContent ?? "").trim().slice(0, 40)}`,
            contorno: cs.outlineStyle,
            largura: parseFloat(cs.outlineWidth),
            sobreposto,
            topo: topo?.tagName.toLowerCase() ?? "",
          };
        });
        if (!info) break;
        visitados.add(info.id);
        if (info.contorno === "none" || info.largura < 2) problemas.push(`sem contorno >= 2px: ${info.id}`);
        if (info.sobreposto) problemas.push(`coberto por <${info.topo}>: ${info.id}`);
      }
      expect(problemas).toEqual([]);
      expect(visitados.size, "sequência de Tab deve percorrer a página").toBeGreaterThan(3);
    });
  }

  test("Tab percorre a página até sair do documento (sem armadilha de foco)", async ({ page }) => {
    await page.goto("/pesquisa");
    let saiu = false;
    for (let i = 0; i < 200 && !saiu; i++) {
      await page.keyboard.press("Tab");
      saiu = (await focoAtual(page)) === "body";
    }
    expect(saiu).toBe(true);
  });
});

test.describe("operação pelo teclado", () => {
  test("botão de tema alterna com Enter e atualiza aria-pressed", async ({ page }) => {
    await page.goto("/sobre");
    const botao = page.locator("#theme-toggle");
    await botao.focus();
    const antes = await page.locator("html").getAttribute("data-theme");
    await page.keyboard.press("Enter");
    const depois = await page.locator("html").getAttribute("data-theme");
    expect(depois).not.toBe(antes);
    await expect(botao).toHaveAttribute("aria-pressed", depois === "dark" ? "true" : "false");
  });

  test("botão Copiar citação responde ao teclado com texto de estado", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/pesquisa");
    const botao = page.locator("button[data-copy]").first();
    await botao.focus();
    await page.keyboard.press("Enter");
    const status = botao.locator("xpath=following-sibling::span[contains(@class,'copy-status')]");
    await expect(status).not.toHaveText("");
  });

  test("Limpar filtros é alcançável por teclado", async ({ page }) => {
    await page.goto("/pesquisa?q=zzzz-sem-resultado");
    const limpar = page.locator("[data-vazio] [data-limpar]");
    await limpar.focus();
    await expect(limpar).toBeFocused();
  });
});
