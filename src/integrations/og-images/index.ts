import type { AstroIntegration } from "astro";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * OG Images Integration
 *
 * Generates Open Graph images using Takumi
 */
export function ogImagesIntegration(): AstroIntegration {
  return {
    name: "desertthunder-og-images",
    hooks: {
      "astro:config:setup": async ({ injectRoute, logger }) => {
        logger.info("Setting up OG image generation...");

        injectRoute({ pattern: "/og.png", entrypoint: join(__dirname, "endpoint.ts"), prerender: true });

        logger.info("OG image routes injected successfully");
      },
    },
  };
}
