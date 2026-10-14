import { test, expect, type Page } from "@playwright/test";

const LISTA = "#publicacoes-lista > li[data-filtro-item]";
const VISIVEIS = `${LISTA}:not([hidden])`;

/** Número anunciado em [data-contagem] ("12 publicações encontradas" / "1 publicação encontrada"). */
function contagemAnunciada(texto: string): number {
  return /^1 /.test(texto) ? 1 : Number(texto.match(/^(\d+)/)?.[1] ?? NaN);
}

/** Erros não tratados, de console e diálogos (alert/confirm) coletados durante a navegação. */
function coletarErros(page: Page) {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(`console: ${m.text()}`);
  });
  page.on("dialog", (d) => {
    erros.push(`dialog: ${d.message()}`);
    void d.dismiss();
  });
  return erros;
}

test.describe("publicações: filtros via URL", () => {
  test("?tipo= mostra somente itens do tipo e anuncia a contagem correta", async ({ page }) => {
    await page.goto("/pesquisa");
    const tipo = await page.locator("select[name=tipo] option").nth(1).getAttribute("value");
    expect(tipo).toBeTruthy();
    await page.goto(`/pesquisa?tipo=${tipo}`);
    const visiveis = page.locator(VISIVEIS);
    const n = await visiveis.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) await expect(visiveis.nth(i)).toHaveAttribute("data-tipo", tipo!);
    const anunciado = await page.locator("[data-contagem]").textContent();
    expect(contagemAnunciada(anunciado ?? "")).toBe(n);
  });

  test("?ano= mostra somente itens do ano", async ({ page }) => {
    await page.goto("/pesquisa");
    const ano = await page.locator("select[name=ano] option").nth(1).getAttribute("value");
    await page.goto(`/pesquisa?ano=${ano}`);
    const visiveis = page.locator(VISIVEIS);
    const n = await visiveis.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) await expect(visiveis.nth(i)).toHaveAttribute("data-ano", ano!);
  });

  test("?q= filtra por texto sem acento e a contagem bate com os itens exibidos", async ({ page }) => {
    await page.goto("/pesquisa?q=cedulas");
    const n = await page.locator(VISIVEIS).count();
    expect(n).toBeGreaterThan(0);
    await expect(page.locator("[data-contagem]")).toHaveText(
      n === 1 ? "1 publicação encontrada" : `${n} publicações encontradas`,
    );
  });

  test("Enter no campo de busca atualiza a URL com ?q=", async ({ page }) => {
    await page.goto("/pesquisa");
    await page.fill("#publicacoes-lista-q", "acessibilidade");
    await page.locator("#publicacoes-lista-q").press("Enter");
    await expect(page).toHaveURL(/\?q=acessibilidade$/);
  });
});

test.describe("publicações: entradas hostis em ?q=", () => {
  const ENTRADAS = ["<script>alert(1)</script>", "(", "[", ".*", "\\", "a|b", "(?<x>", "%"];

  for (const entrada of ENTRADAS) {
    test(`?q=${JSON.stringify(entrada)} não lança exceção, não abre diálogo e não injeta HTML`, async ({ page }) => {
      const erros = coletarErros(page);
      await page.goto(`/pesquisa?q=${encodeURIComponent(entrada)}`);
      await expect(page.locator("[data-contagem]")).toBeVisible();
      await expect(page.locator("script:not([src]):has-text('alert(1)')")).toHaveCount(0);
      await expect(page.locator("[onerror]")).toHaveCount(0);
      expect(erros, erros.join("\n")).toEqual([]);
    });
  }

  test("?q=<script> mostra o texto literal, estado vazio e Limpar filtros", async ({ page }) => {
    await page.goto("/pesquisa?q=%3Cscript%3E");
    await expect(page.locator("#publicacoes-lista-q")).toHaveValue("<script>");
    const vazio = page.locator("[data-vazio]");
    await expect(vazio).toBeVisible();
    await expect(vazio.getByText("Limpar filtros")).toBeVisible();
    await expect(page.locator(VISIVEIS)).toHaveCount(0);
  });

  test("digitar ( no campo busca não quebra a lista", async ({ page }) => {
    const erros = coletarErros(page);
    await page.goto("/pesquisa");
    await page.fill("#publicacoes-lista-q", "(");
    await page.locator("#publicacoes-lista-q").dispatchEvent("input");
    await expect(page.locator("[data-contagem]")).toBeVisible();
    expect(erros, erros.join("\n")).toEqual([]);
  });
});

test.describe("publicações: estado vazio e limpar", () => {
  test("Limpar filtros restaura todas as publicações e remove a query", async ({ page }) => {
    await page.goto("/pesquisa");
    const total = await page.locator(LISTA).count();
    await page.goto("/pesquisa?q=zzzz-sem-resultado");
    await expect(page.locator("[data-vazio]")).toBeVisible();
    await page.locator("[data-vazio] [data-limpar]").click();
    await expect(page.locator("[data-vazio]")).toBeHidden();
    await expect(page.locator(VISIVEIS)).toHaveCount(total);
    await expect(page).toHaveURL(/\/pesquisa\/?$/);
    await expect(page.locator("#publicacoes-lista-q")).toHaveValue("");
  });

  test("o anúncio de resultados segue a digitação com debounce, não a cada tecla", async ({ page }) => {
    await page.goto("/pesquisa");
    const contagem = page.locator("[data-contagem]");
    const inicial = (await contagem.textContent()) ?? "";
    // Digitação rápida (30 ms entre teclas): o anúncio não deve mudar a cada tecla.
    await page.locator("#publicacoes-lista-q").pressSequentially("acess", { delay: 30 });
    await expect(contagem).toHaveText(inicial);
    // Depois do silêncio (400 ms), o texto final é anunciado.
    await expect(contagem).not.toHaveText(inicial, { timeout: 3000 });
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("lista completa de publicações visível e navegação funcional", async ({ page }) => {
    await page.goto("/pesquisa");
    const itens = page.locator(LISTA);
    const total = await itens.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) await expect(itens.nth(i)).toBeVisible();
    await page.getByRole("navigation", { name: "Menu principal" }).getByRole("link", { name: "Portfólio" }).click();
    await expect(page).toHaveURL(/\/projetos$/);
    await expect(page.locator("h1")).toHaveText("Portfólio");
  });
});

test.describe("localStorage indisponível", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("blocked", "SecurityError");
        },
      });
    });
  });

  test("carregar a página não gera exceção e o tema alterna mesmo assim", async ({ page }) => {
    const erros = coletarErros(page);
    await page.goto("/sobre");
    const alvo = page.locator("#theme-toggle");
    const antes = await page.locator("html").getAttribute("data-theme");
    await alvo.click();
    const depois = await page.locator("html").getAttribute("data-theme");
    expect(depois).not.toBe(antes);
    await expect(alvo).toHaveAttribute("aria-pressed", depois === "dark" ? "true" : "false");
    expect(erros, erros.join("\n")).toEqual([]);
  });

  test("filtros de publicações continuam funcionando", async ({ page }) => {
    const erros = coletarErros(page);
    await page.goto("/pesquisa?q=zzzz-sem-resultado");
    await expect(page.locator("[data-vazio]")).toBeVisible();
    await page.locator("[data-vazio] [data-limpar]").click();
    await expect(page.locator("[data-vazio]")).toBeHidden();
    expect(erros, erros.join("\n")).toEqual([]);
  });
});
