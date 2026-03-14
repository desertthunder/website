// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { ogImagesIntegration } from "./src/integrations/og-images";

export default defineConfig({
  site: "https://desertthunder.dev",
  integrations: [ogImagesIntegration()],
  vite: { plugins: [tailwindcss()] },
});
