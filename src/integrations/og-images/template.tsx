import { ImageResponse } from "@takumi-rs/image-response";
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

export async function generateOGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.primaryBright,
        fontFamily: '"JetBrains Mono", "SF Mono", monospace',
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          margin: "40px",
          border: `2px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: colors.bg,
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.bgSecondary,
            borderBottom: `1px solid ${colors.border}`,
            padding: "16px 24px",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colors.error }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colors.warning }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colors.success }} />
            </div>
            <div style={{ width: "1px", height: "16px", backgroundColor: colors.border, marginLeft: "8px" }} />
            <span style={{ color: colors.primary, fontSize: "14px" }}>Desert Thunder</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: colors.textMuted, fontSize: "13px" }}>Austin, TX</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: colors.bg,
            padding: "48px",
            justifyContent: "center",
            maxWidth: "800px",
          }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "700",
              color: colors.text,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "24px",
              whiteSpace: "nowrap",
            }}>
            Owais Jamil
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: colors.textMuted,
              lineHeight: 1.5,
              maxWidth: "700px",
              whiteSpace: "nowrap",
            }}>
            Software Engineer & Writer with a passion for learning.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.bgSecondary,
            borderTop: `1px solid ${colors.border}`,
            padding: "12px 24px",
            fontSize: "12px",
            color: colors.textDim,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span>github.com/desertthunder</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span>desertthunder.dev</span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none",
          opacity: 0.02,
          zIndex: -1,
        }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={`h-${i}`}
            style={{ width: "100%", height: "1px", backgroundColor: colors.primary, marginBottom: "40px" }}
          />
        ))}
      </div>
    </div>,
    { width: 1200, height: 630, format: "png" },
  );
}
