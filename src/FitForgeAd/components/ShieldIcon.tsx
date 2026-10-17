import { interpolate } from "remotion";
import { palette } from "../fitforge";

const SHIELD =
  "M60 6 L110 24 V66 C110 100 88 124 60 134 C32 124 10 100 10 66 V24 Z";

// `draw` desenha o contorno, `lock` faz o cadeado aparecer (ambos 0 → 1)
export const ShieldIcon: React.FC<{
  size: number;
  draw: number;
  lock: number;
}> = ({ size, draw, lock }) => (
  <svg
    width={size}
    height={(size * 140) / 120}
    viewBox="0 0 120 140"
    style={{
      flexShrink: 0,
      overflow: "visible",
      filter: `drop-shadow(0 0 ${28 * draw}px rgba(13, 216, 221, 0.45))`,
    }}
  >
    <path
      d={SHIELD}
      fill={palette.primary}
      fillOpacity={draw * 0.12}
      stroke={palette.primary}
      strokeWidth={6}
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
    <g
      opacity={Math.min(1, lock * 2)}
      transform={`translate(60 76) scale(${interpolate(lock, [0, 1], [0.5, 1])}) translate(-60 -76)`}
    >
      <path
        d="M47 66 V55 a13 13 0 0 1 26 0 V66"
        fill="none"
        stroke={palette.text}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <rect x={38} y={64} width={44} height={36} rx={7} fill={palette.text} />
      <circle cx={60} cy={80} r={5} fill={palette.bg} />
      <rect x={58} y={80} width={4} height={10} rx={2} fill={palette.bg} />
    </g>
  </svg>
);
