import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pastodel.ru",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    server: {
      host: true,
    },
  },
});
