import React from "react";
import { fonts, palette } from "../theme";
import { snap, useLayout } from "./layout";
import { PixelPanel } from "./PixelPanel";

export const Tooltip: React.FC<{
  name: string;
  description: string;
  enter: number;
}> = ({ name, description, enter }) => {
  const { unit, maxWidth } = useLayout();

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${snap((1 - enter) * 24)}px)`,
      }}
    >
      <PixelPanel
        padding={`${20 * unit}px ${30 * unit}px`}
        style={{ maxWidth, textAlign: "center" }}
      >
        <div
          style={{
            fontFamily: fonts.title,
            fontSize: 30 * unit,
            lineHeight: 1.3,
            color: palette.text,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 50 * unit,
            lineHeight: 1,
            marginTop: 12 * unit,
            color: palette.muted,
          }}
        >
          {description}
        </div>
      </PixelPanel>
    </div>
  );
};
