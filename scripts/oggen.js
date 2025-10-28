#!/usr/bin/env node
import { createCanvas, registerFont } from "canvas";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { writeFileSync } from "fs";

const argv = yargs(hideBin(process.argv))
  .option("title", { type: "string", demandOption: true, desc: "Main title text" })
  .option("subtitle", { type: "string", default: "", desc: "Optional subtitle" })
  .option("mode", { type: "string", choices: ["grid", "dot", "hex"], default: "grid", desc: "Background style" })
  .option("out", { type: "string", default: "og.png", desc: "Output PNG path" })
  .option("w", { alias: "width", type: "number", default: 1200, desc: "Image width" })
  .option("h", { alias: "height", type: "number", default: 630, desc: "Image height" })
  .option("spacing", { type: "number", default: 28, desc: "Grid/dot spacing (px)" })
  .option("hexSize", { type: "number", default: 22, desc: "Hexagon radius (px)" })
  .option("brand", { type: "string", default: "", desc: "Optional brand/footer text" })
  .option("fontPath", { type: "string", default: "./fonts/JetBrainsMono-Regular.ttf", desc: "Path to JetBrains Mono Regular" })
  .option("fontPathBold", { type: "string", default: "./fonts/JetBrainsMono-Bold.ttf", desc: "Path to JetBrains Mono Bold" })
  .help()
  .parseSync();

const C = {
  bg: "#161821",
  fg: "#c6c8d1",
  panel: "#1e2132",
  line: "#353a50",
  blue: "#84a0c6",
  cyan: "#89b8c2",
  green: "#b4be82",
  yellow: "#e2a478",
  red: "#e27878",
  magenta: "#a093c7",
};

try {
  registerFont(argv.fontPath, { family: "JetBrains Mono", weight: "400" });
  registerFont(argv.fontPathBold, { family: "JetBrains Mono", weight: "700" });
} catch (e) {
  console.warn("Font registration failed; falling back to system monospace:", e.message);
}

const W = argv.w;
const H = argv.h;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function setShadow(ctx, y = 2, blur = 24, color = "rgba(0,0,0,0.35)") {
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = y;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
}

function wrapText(ctx, text, maxWidth) {
  const words = (text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    const m = ctx.measureText(test).width;
    if (m > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawGrid(spacing = 28) {
  ctx.save();
  ctx.strokeStyle = "rgba(197, 200, 210, 0.08)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= W; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDots(spacing = 28, r = 1.2) {
  ctx.save();
  ctx.fillStyle = "rgba(197, 200, 210, 0.12)";
  for (let y = 0; y <= H; y += spacing) {
    for (let x = 0; x <= W; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawHex(hexR = 22) {
  const w = hexR * 2;
  const h = Math.sqrt(3) * hexR;
  const horiz = (3 / 4) * w;
  const vert = h;
  ctx.save();
  ctx.strokeStyle = "rgba(197, 200, 210, 0.10)";
  ctx.lineWidth = 1;

  function hexPath(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + i * (Math.PI / 3);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  let row = 0;
  for (let y = -h; y < H + h; y += vert) {
    const xOffset = row % 2 === 0 ? 0 : horiz / 2;
    for (let x = -w; x < W + w; x += horiz) {
      hexPath(x + xOffset, y, hexR);
      ctx.stroke();
    }
    row++;
  }
  ctx.restore();
}

ctx.fillStyle = C.bg;
ctx.fillRect(0, 0, W, H);

const grad = ctx.createRadialGradient(W * 0.5, H * 0.4, H * 0.1, W * 0.5, H * 0.4, H * 0.8);
grad.addColorStop(0, "rgba(30,33,50,0.35)");
grad.addColorStop(1, "rgba(22,24,33,0.0)");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

switch (argv.mode) {
  case "grid":
    drawGrid(argv.spacing);
    break;
  case "dot":
    drawDots(argv.spacing, 1.2);
    break;
  case "hex":
    drawHex(argv.hexSize);
    break;
}

const pad = 64;
const panelR = 24;
const panelX = pad;
const panelY = pad;
const panelW = W - pad * 2;
const panelH = H - pad * 2;

ctx.save();
setShadow(ctx, 6, 40, "rgba(0,0,0,0.45)");
ctx.fillStyle = C.panel;
ctx.strokeStyle = C.line;
ctx.lineWidth = 1;

ctx.beginPath();
const r = panelR;
ctx.moveTo(panelX + r, panelY);
ctx.lineTo(panelX + panelW - r, panelY);
ctx.quadraticCurveTo(panelX + panelW, panelY, panelX + panelW, panelY + r);
ctx.lineTo(panelX + panelW, panelY + panelH - r);
ctx.quadraticCurveTo(panelX + panelW, panelY + panelH, panelX + panelW - r, panelY + panelH);
ctx.lineTo(panelX + r, panelY + panelH);
ctx.quadraticCurveTo(panelX, panelY + panelH, panelX, panelY + panelH - r);
ctx.lineTo(panelX, panelY + r);
ctx.quadraticCurveTo(panelX, panelY, panelX + r, panelY);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();

const barY = panelY + 18;
const dotY = barY + 10;

function dot(x, color) {
  ctx.beginPath();
  ctx.arc(x, dotY, 7, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.stroke();
}

dot(panelX + 22, C.red);
dot(panelX + 48, C.yellow);
dot(panelX + 74, C.green);

ctx.strokeStyle = C.line;
ctx.beginPath();
ctx.moveTo(panelX, barY + 28);
ctx.lineTo(panelX + panelW, barY + 28);
ctx.stroke();

const contentX = panelX + 36;
let cursorY = barY + 28 + 42;

ctx.fillStyle = C.cyan;
ctx.font = "700 60px 'JetBrains Mono', ui-monospace, monospace";
ctx.textBaseline = "top";
const titleMaxWidth = panelW - 72;
for (const line of wrapText(ctx, argv.title, titleMaxWidth)) {
  ctx.fillText(line, contentX, cursorY);
  cursorY += 68;
}

if (argv.subtitle) {
  cursorY += 10;
  ctx.fillStyle = C.fg;
  ctx.font = "400 30px 'JetBrains Mono', ui-monospace, monospace";
  for (const line of wrapText(ctx, argv.subtitle, titleMaxWidth)) {
    ctx.fillText(line, contentX, cursorY);
    cursorY += 42;
  }
}

if (argv.brand) {
  const brandY = panelY + panelH - 56;
  ctx.fillStyle = C.blue;
  ctx.font = "700 26px 'JetBrains Mono', ui-monospace, monospace";
  ctx.fillText(`$ ${argv.brand}`, contentX, brandY);
}

writeFileSync(argv.out, canvas.toBuffer("image/png"));
console.log(`wrote ${argv.out} (${W}×${H})`);
