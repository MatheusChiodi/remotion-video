import React from "react";
import { useCurrentFrame } from "remotion";
import type { IconName } from "../data/portfolio";
import { fonts, palette, progress } from "../theme";
import { SAFE, snap, useLayout } from "./layout";
import { PixelIcon } from "./PixelIcon";
import { PixelPanel } from "./PixelPanel";

export const AchievementToast: React.FC<{
  title: string;
  label: string;
  icon: IconName;
  from: number;
  to: number;
  align?: "center" | "left";
}> = ({ title, label, icon, from, to, align = "center" }) => {
  const frame = useCurrentFrame();
  const { unit, vertical } = useLayout();

  if (frame < from || frame > to) {
    return null;
  }

  const enter = progress(frame, from, from + 12);
  const iconSize = 84 * unit;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        right: SAFE,
        top: vertical ? 140 : 90,
        display: "flex",
        justifyContent: align === "left" ? "flex-start" : "center",
        opacity: enter,
        transform: `translateY(${snap((enter - 1) * 120)}px)`,
      }}
    >
      <PixelPanel padding={`${18 * unit}px ${28 * unit}px`}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 * unit }}>
          <div
            style={{
              width: iconSize,
              height: iconSize,
              padding: 8 * unit,
              boxSizing: "border-box",
              background: "#23254A",
              border: `4px solid ${palette.panelInner}`,
            }}
          >
            <PixelIcon name={icon} size={iconSize - 16 * unit - 8} />
          </div>
          <div>
            {title ? (
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 44 * unit,
                  lineHeight: 1,
                  color: palette.muted,
                  marginBottom: 10 * unit,
                }}
              >
                {title}
              </div>
            ) : null}
            <div
              style={{
                fontFamily: fonts.title,
                fontSize: 30 * unit,
                lineHeight: 1.2,
                color: palette.text,
              }}
            >
              {label}
            </div>
          </div>
        </div>
      </PixelPanel>
    </div>
  );
};
