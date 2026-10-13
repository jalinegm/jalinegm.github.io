import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jalinegm.github.io",
  output: "static",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
