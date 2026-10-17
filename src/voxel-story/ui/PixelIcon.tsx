import React from "react";
import type { IconName } from "../data/portfolio";
import { ICONS, iconColor } from "./icons";

export const PixelIcon: React.FC<{ name: IconName; size: number }> = ({
  name,
  size,
}) => {
  const rows = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        [...row].map((char, x) => {
          const fill = iconColor(char);
          return fill ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null;
        }),
      )}
    </svg>
  );
};
