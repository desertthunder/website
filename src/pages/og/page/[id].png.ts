import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

/**
 * Generate static path for home OG image.
 * All non-blog pages use this default image.
 */
export async function getStaticPaths() {
  return [
    {
      params: { id: "home" },
      props: { title: "Owais Jamil", description: "Software engineer and writer.", pageUrl: "desertthunder.dev" },
    },
  ];
}

/**
 * Generate OG image for static page.
 *
 * Uses satori to convert React-like markup to SVG, then resvg to convert to PNG.
 */
export const GET: APIRoute = async ({ props }) => {
  const { title, description, subtitle, pageUrl } = props as {
    title: string;
    description: string;
    subtitle?: string;
    pageUrl: string;
  };

  const fontDataRegular = await readFile(resolve("./fonts/JetBrainsMono-Regular.ttf"));
  const fontDataBold = await readFile(resolve("./fonts/JetBrainsMono-Bold.ttf"));

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#161821",
          fontFamily: "JetBrains Mono",
          position: "relative",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 50% 40%, rgba(30, 33, 50, 0.35) 10%, rgba(22, 24, 33, 0) 80%)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                margin: 64,
                background: "#1e2132",
                border: "1px solid #353a50",
                borderRadius: 24,
                boxShadow: "0 6px 40px rgba(0, 0, 0, 0.45)",
                flex: 1,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: 24,
                      paddingBottom: 20,
                      borderBottom: "1px solid #353a50",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", gap: 12 },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: {
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: "#e27878",
                                  border: "1px solid #353a50",
                                },
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: "#e2a478",
                                  border: "1px solid #353a50",
                                },
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: "#b4be82",
                                  border: "1px solid #353a50",
                                },
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 20, color: "#c6c8d1", fontWeight: 400 },
                          children: "Desert Thunder | Owais Jamil",
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column", gap: 32, flex: 1, padding: 48 },
                    children: [
                      subtitle && {
                        type: "div",
                        props: {
                          style: { fontSize: 28, fontWeight: 400, color: "#b4be82", marginBottom: -8 },
                          children: subtitle,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 72, fontWeight: 700, color: "#89b8c2", lineHeight: 1.1 },
                          children: title,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 32, fontWeight: 400, color: "#c6c8d1", lineHeight: 1.4 },
                          children: description,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 24px",
                      background: "#161821",
                      borderTop: "1px solid #353a50",
                      borderBottomLeftRadius: 24,
                      borderBottomRightRadius: 24,
                      fontSize: 20,
                      color: "#c6c8d1",
                    },
                    children: [
                      { type: "div", props: { children: pageUrl } },
                      { type: "div", props: { children: "github.com/desertthunder" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "JetBrains Mono", data: fontDataRegular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: fontDataBold, weight: 700, style: "normal" },
      ],
    },
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  });
};
