import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts, SAFE_X, shadow } from "./theme";

export const Paper: React.FC<{
  children?: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
  padY?: number;
}> = ({ children, justify = "center", padY = 120 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.paper,
      backgroundImage: `radial-gradient(${colors.line} 2px, transparent 2px)`,
      backgroundSize: "40px 40px",
      padding: `${padY}px ${SAFE_X}px`,
      justifyContent: justify,
      fontFamily: fonts.body,
      color: colors.ink,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Rise: React.FC<{
  delay: number;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay, duration = 0.5, distance = 40, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, duration);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

type Part = { text: string; accent?: boolean };

// Frase serifada palavra a palavra, com a palavra-chave em coral itálico
export const Phrase: React.FC<{
  parts: Part[];
  delay: number;
  size?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ parts, delay, size = 96, stagger = 0.06, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = parts.flatMap((part) =>
    part.text.split(" ").map((word) => ({ word, accent: part.accent })),
  );

  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: "-0.02em",
        color: colors.ink,
        ...style,
      }}
    >
      {words.map(({ word, accent }, i) => {
        const p = enter(frame, fps, delay + i * stagger, 0.55);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              padding: "0 0.08em 0.1em 0",
              marginRight: "0.16em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 115}%)`,
                color: accent ? colors.coral : undefined,
                fontStyle: accent ? "italic" : "normal",
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
}> = ({ children, color = colors.slate600 }) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
}> = ({ children, accent, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 26px",
      borderRadius: 9999,
      fontSize: 28,
      fontWeight: 600,
      backgroundColor: accent ? colors.coral : colors.white,
      color: accent ? colors.white : colors.ink,
      border: accent ? "none" : `2px solid ${colors.line}`,
      boxShadow: shadow.card,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Window: React.FC<{
  title: string;
  children: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ title, children, dark, style }) => (
  <div
    style={{
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: dark ? colors.night : colors.white,
      border: `2px solid ${dark ? "rgba(255,255,255,0.08)" : colors.line}`,
      boxShadow: shadow.raised,
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 24px",
        borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.08)" : colors.line}`,
      }}
    >
      {[colors.coral, colors.glowPeach, colors.emerald].map((c) => (
        <div
          key={c}
          style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c }}
        />
      ))}
      <div
        style={{
          marginLeft: 16,
          fontFamily: fonts.mono,
          fontSize: 22,
          color: dark ? colors.slate300 : colors.slate600,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);
