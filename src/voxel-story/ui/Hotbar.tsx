import React from "react";
import { useCurrentFrame } from "remotion";
import type { IconName } from "../data/portfolio";
import { palette, pop, progress } from "../theme";
import { SAFE, snap, useLayout } from "./layout";
import { PixelIcon } from "./PixelIcon";
import { Tooltip } from "./Tooltip";

export type HotbarItem = {
  name: string;
  description: string;
  icon: IconName;
};

export const Hotbar: React.FC<{
  items: HotbarItem[];
  fill: { start: number; stagger: number };
  selected: number;
  selectedSince: number;
}> = ({ items, fill, selected, selectedSince }) => {
  const frame = useCurrentFrame();
  const { unit, vertical, fps } = useLayout();
  // Em paisagem a dica fica ao lado da barra, com largura fixa para a barra não pular.
  const tooltipBox: React.CSSProperties = vertical
    ? {}
    : { width: 660 * unit, display: "flex", justifyContent: "flex-start" };
  const slot = 120 * unit;
  const gap = 14 * unit;
  const barEnter = progress(frame, 0, 12);
  const current = selected >= 0 ? items[selected] : null;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        right: SAFE,
        bottom: vertical ? 220 : 90,
        display: "flex",
        flexDirection: vertical ? "column" : "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 34 * unit,
      }}
    >
      <div style={tooltipBox}>
        {current ? (
          <Tooltip
            name={current.name}
            description={current.description}
            enter={progress(frame, selectedSince, selectedSince + 8)}
          />
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          gap,
          padding: gap,
          background: palette.panel,
          border: `5px solid ${palette.panelBorder}`,
          boxShadow: `10px 10px 0 ${palette.shadow}`,
          opacity: barEnter,
          transform: `translateY(${snap((1 - barEnter) * 60)}px)`,
        }}
      >
        {items.map((item, i) => {
          const isSelected = i === selected;
          const lift = isSelected
            ? progress(frame, selectedSince, selectedSince + 6)
            : 0;
          const filled = pop(frame, fill.start + i * fill.stagger, fps);
          return (
            <div
              key={item.name}
              style={{
                width: slot,
                height: slot,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isSelected ? "#2B2E58" : "#1C1D3C",
                border: `5px solid ${isSelected ? palette.text : palette.panelInner}`,
                transform: `translateY(${snap(-lift * 16)}px)`,
              }}
            >
              <div style={{ transform: `scale(${filled})`, display: "flex" }}>
                <PixelIcon name={item.icon} size={slot * 0.66} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
