import { ImageResponse } from "@takumi-rs/image-response";
import { readFile } from "node:fs/promises";
import React from "react";

const colors = {
  bg: "#0a0a0a",
  bgSecondary: "#111111",
  border: "#1e3a5f",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#475569",
  primary: "#3b82f6",
  primaryBright: "#60a5fa",
  secondary: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

const h = React.createElement;
const protoFontBaseUrl = new URL("../../../public/fonts/0xProto/", import.meta.url);
const recursiveFontBaseUrl = new URL("../../../public/fonts/Recursive/", import.meta.url);
const atkinsonFontBaseUrl = new URL("../../../public/fonts/AtkinsonHyperlegibleNext/", import.meta.url);

const backgroundImage = readFile(new URL("src/integrations/og-images/bliss.jpg", `file://${process.cwd()}/`)).then(
  (data) => `data:image/jpeg;base64,${data.toString("base64")}`,
);

const fonts = Promise.all([
  readFile(new URL("0xProto-Regular.ttf", protoFontBaseUrl)).then((data) => {
    return { name: "0xProto", data, weight: 400, style: "normal" as const };
  }),
  readFile(new URL("0xProto-Bold.ttf", protoFontBaseUrl)).then((data) => {
    return { name: "0xProto", data, weight: 700, style: "normal" as const };
  }),
  readFile(new URL("0xProto-Italic.ttf", protoFontBaseUrl)).then((data) => {
    return { name: "0xProto", data, weight: 400, style: "italic" as const };
  }),
  readFile(new URL("recursive-latin-full-normal.woff2", recursiveFontBaseUrl)).then((data) => {
    return { name: "Recursive Variable", data, weight: 400, style: "normal" as const };
  }),
  readFile(new URL("atkinson-hyperlegible-next-latin-wght-normal.woff2", atkinsonFontBaseUrl)).then((data) => {
    return { name: "Atkinson Hyperlegible Next Variable", data, weight: 700, style: "normal" as const };
  }),
]);

export async function generateOGImage() {
  return new ImageResponse(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.primary,
          fontFamily: '"Recursive Variable", system-ui, sans-serif',
          fontVariationSettings: '"CASL" 0.2, "MONO" 0.05',
          position: "relative",
          overflow: "hidden",
        },
      },
      h("img", {
        src: await backgroundImage,
        style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
      }),
      h("div", { style: { position: "absolute", inset: 0, backgroundColor: "rgba(10, 10, 10, 0.25)" } }),
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            zIndex: 1,
            margin: "60px",
            border: `2px solid ${colors.primaryBright}`,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: colors.bg,
          },
        },
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.bgSecondary,
              borderBottom: `1px solid ${colors.border}`,
              padding: "16px 24px",
              fontWeight: "500",
            },
          },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "12px" } },
            h(
              "div",
              { style: { display: "flex", gap: "8px" } },
              h("div", {
                style: { width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colors.error },
              }),
              h("div", {
                style: { width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colors.warning },
              }),
              h("div", {
                style: { width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colors.success },
              }),
            ),
            h("div", { style: { width: "1px", height: "16px", backgroundColor: colors.border, marginLeft: "8px" } }),
            h("span", { style: { color: colors.text, fontSize: "20px" } }, "Desert Thunder"),
          ),
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "8px" } },
            h("span", { style: { color: colors.text, fontSize: "18px" } }, "Austin, TX"),
          ),
        ),
        h(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: colors.bg,
              fontFamily: '"0xProto", "SF Mono", monospace',
              fontVariationSettings: "normal",
              padding: "48px",
              justifyContent: "center",
              maxWidth: "800px",
            },
          },
          h(
            "h1",
            {
              style: {
                fontFamily: '"Recursive Variable", system-ui, sans-serif',
                fontVariationSettings: '"CASL" 0.2, "MONO" 0.05',
                fontSize: "56px",
                fontWeight: "700",
                color: colors.primaryBright,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "24px",
                whiteSpace: "nowrap",
              },
            },
            "Owais Jamil",
          ),
          h(
            "p",
            {
              style: { fontSize: "24px", color: colors.text, lineHeight: 1.5, maxWidth: "700px", whiteSpace: "nowrap" },
            },
            "Software Engineer & Writer with a passion for learning.",
          ),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.bgSecondary,
              borderTop: `1px solid ${colors.border}`,
              padding: "12px 24px",
              fontSize: "17px",
              fontWeight: "500",
              color: colors.text,
            },
          },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "24px" } },
            h("span", null, "github.com/desertthunder"),
          ),
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "24px" } },
            h("span", null, "desertthunder.dev"),
          ),
        ),
      ),
      h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            pointerEvents: "none",
            opacity: 0.02,
            zIndex: -1,
          },
        },
        ...Array.from({ length: 16 }).map((_, i) =>
          h("div", {
            key: `h-${i}`,
            style: { width: "100%", height: "1px", backgroundColor: colors.primary, marginBottom: "40px" },
          }),
        ),
      ),
    ),
    { width: 1200, height: 630, format: "png", fonts: await fonts },
  );
}
