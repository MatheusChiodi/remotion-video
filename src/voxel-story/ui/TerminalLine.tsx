import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TimedText } from "../data/portfolio";
import { clamp, fonts, palette, progress } from "../theme";
import { SAFE, snap, splitAccent, useLayout } from "./layout";
import { PixelPanel } from "./PixelPanel";

const CHARS_PER_FRAME = 1.1;

export const TerminalLine: React.FC<{
  line: TimedText;
  accentColor?: string;
  exit?: boolean;
}> = ({ line, accentColor = palette.accent, exit = false }) => {
  const frame = useCurrentFrame();
  const { unit, vertical, maxWidth } = useLayout();

  if (frame < line.from || frame > line.to) {
    return null;
  }

  const enter = progress(frame, line.from, line.from + 8);
  const leave = exit
    ? interpolate(frame, [line.to - 8, line.to], [1, 0], clamp)
    : 1;
  const typed = Math.floor((frame - line.from - 4) * CHARS_PER_FRAME);
  const done = typed >= line.text.length;
  const cursorOn = !done || Math.floor(frame / 8) % 2 === 0;

  let remaining = Math.max(0, typed);
  const segments = splitAccent(line).map((segment) => {
    const visible = segment.text.slice(0, remaining);
    remaining = Math.max(0, remaining - segment.text.length);
    return { ...segment, text: visible };
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: vertical ? 260 : 110,
        display: "flex",
        justifyContent: "center",
        opacity: enter * leave,
        transform: `translateY(${snap((1 - enter) * 40)}px)`,
      }}
    >
      <PixelPanel
        padding={`${16 * unit}px ${30 * unit}px`}
        style={{ maxWidth, marginLeft: SAFE, marginRight: SAFE }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 68 * unit,
            lineHeight: 1,
            color: palette.text,
            whiteSpace: "pre",
          }}
        >
          {segments.map((segment, i) => (
            <span
              key={i}
              style={{ color: segment.accent ? accentColor : undefined }}
            >
              {segment.text}
            </span>
          ))}
          <span
            style={{
              display: "inline-block",
              width: 26 * unit,
              height: 48 * unit,
              marginLeft: 6,
              verticalAlign: "-10%",
              background: palette.text,
              opacity: cursorOn ? 1 : 0,
            }}
          />
        </div>
      </PixelPanel>
    </div>
  );
};
