import { defineConfig } from "astro/config";
import rehypeRaw from "rehype-raw";
import rehypeFiguraLink from "./src/lib/rehype-figura-link.mjs";

export default defineConfig({
  site: "https://jalinegm.github.io",
  output: "static",
  trailingSlash: "ignore",
  markdown: { rehypePlugins: [rehypeRaw, rehypeFiguraLink] },
  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
