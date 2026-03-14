// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { ogImagesIntegration } from "./src/integrations/og-images/index.ts";

export default defineConfig({
  site: "https://desertthunder.dev",
  integrations: [ogImagesIntegration()],
  vite: { plugins: [tailwindcss()], ssr: { external: ["@takumi-rs/core"] } },
});
