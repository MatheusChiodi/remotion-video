import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TimedText } from "../data/portfolio";
import { clamp, fonts, palette, progress } from "../theme";
import { SAFE, snap, splitAccent, useLayout } from "./layout";
import { PixelPanel } from "./PixelPanel";

export const Caption: React.FC<{
  line: TimedText;
  sceneEnd: number;
  position?: "top" | "bottom";
  footer?: string;
}> = ({ line, sceneEnd, position = "bottom", footer }) => {
  const frame = useCurrentFrame();
  const { unit, vertical, maxWidth } = useLayout();

  if (frame < line.from || frame > line.to) {
    return null;
  }

  const enter = progress(frame, line.from, line.from + 10);
  // Legenda que vai até o fim da cena sai junto com a transição, sem fade próprio.
  const leave =
    line.to >= sceneEnd
      ? 1
      : interpolate(frame, [line.to - 8, line.to], [1, 0], clamp);
  const direction = position === "bottom" ? 1 : -1;
  const edge = vertical ? 230 : 100;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        right: SAFE,
        [position]: edge,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: enter * leave,
        transform: `translateY(${snap((1 - enter) * 36 * direction)}px)`,
      }}
    >
      <PixelPanel
        padding={`${18 * unit}px ${34 * unit}px`}
        style={{ maxWidth }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 64 * unit,
            lineHeight: 1.05,
            color: palette.text,
            textAlign: "center",
          }}
        >
          {splitAccent(line).map((segment, i) => (
            <span
              key={i}
              style={{ color: segment.accent ? palette.accent : undefined }}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </PixelPanel>
      {footer ? (
        <div
          style={{
            marginTop: 18 * unit,
            padding: `${8 * unit}px ${20 * unit}px`,
            background: palette.text,
            color: palette.panel,
            fontFamily: fonts.title,
            fontSize: 22 * unit,
            boxShadow: `8px 8px 0 ${palette.shadow}`,
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
};
