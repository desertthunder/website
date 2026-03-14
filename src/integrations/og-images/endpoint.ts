import type { APIRoute } from "astro";
import { generateOGImage } from "./template";

/**
 * OG Image API Endpoint
 *
 * Generates the main Open Graph image for the site using copy from content collection
 */
export const GET: APIRoute = async () => {
  try {
    const imageResponse = await generateOGImage();

    return new Response(imageResponse.body, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
};

export async function getStaticPaths() {
  return [{ params: {} }];
}

export const prerender = true;
