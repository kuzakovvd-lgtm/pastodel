import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const sitemapExcludedPages = new Set([
  "https://pastodel.ru/politika-konfidentsialnosti/",
  "https://pastodel.ru/soglasie-na-obrabotku-dannyh/",
]);

export default defineConfig({
  site: "https://pastodel.ru",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !sitemapExcludedPages.has(page),
    }),
  ],
  vite: {
    server: {
      host: true,
    },
  },
});
