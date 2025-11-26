// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

/**
 * https://astro.build/config
 */
export default defineConfig({
  site: "https://desertthunder.dev",
  integrations: [sitemap()],

  vite: {
    resolve: {
      alias: {
        $components: "/src/components",
        $pages: "/src/pages",
        $layouts: "/src/layouts",
        $styles: "/src/styles",
        $utils: "/src/utils",
        $lib: "/src/lib",
      },
    },
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({ imageService: "compile" }),
});
