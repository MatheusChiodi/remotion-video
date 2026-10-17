import React from "react";
import { palette } from "../theme";

export const PixelPanel: React.FC<{
  children: React.ReactNode;
  border?: number;
  padding?: string;
  background?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  border = 5,
  padding = "20px 30px",
  background = palette.panel,
  style,
}) => {
  return (
    <div
      style={{
        background,
        border: `${border}px solid ${palette.panelBorder}`,
        boxShadow: [
          `inset 0 0 0 ${border}px ${background}`,
          `inset 0 0 0 ${border * 2}px ${palette.panelInner}`,
          `${border * 2}px ${border * 2}px 0 ${palette.shadow}`,
        ].join(", "),
        padding,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
