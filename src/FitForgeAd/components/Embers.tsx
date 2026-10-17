import { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "../fitforge";
import { CLAMP } from "../theme";

const COUNT = 48;
const EMBER_COLORS = [palette.ember, palette.emberHot, palette.emberDeep];

export const EmberDot: React.FC<{
  x: number;
  y: number;
  size: number;
  opacity: number;
  color?: string;
}> = ({ x, y, size, opacity, color = palette.emberHot }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      boxShadow: `0 0 ${size * 2.5}px ${size * 0.6}px ${palette.ember}`,
      opacity,
    }}
  />
);

export const Embers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const particles = useMemo(
    () =>
      new Array(COUNT).fill(0).map((_, i) => ({
        x: random(`ember-x-${i}`) * width,
        offset: random(`ember-o-${i}`),
        speed: 1.2 + random(`ember-s-${i}`) * 2.8,
        size: 3 + random(`ember-z-${i}`) * 6,
        phase: random(`ember-p-${i}`) * Math.PI * 2,
        sway: 14 + random(`ember-w-${i}`) * 34,
        strength: 0.35 + random(`ember-a-${i}`) * 0.65,
        color: EMBER_COLORS[i % EMBER_COLORS.length],
      })),
    [width],
  );

  const travel = height + 200;
  const pulse = 0.3 + Math.sin((frame / fps) * 1.4) * 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 50% 108%, ${palette.ember} 0%, ${palette.bgGlow} 45%, transparent 100%)`,
          opacity: pulse,
        }}
      />
      {particles.map((p, i) => {
        const y =
          height + 100 - ((frame * p.speed + p.offset * travel) % travel);
        const x = p.x + Math.sin((frame / fps) * 1.2 + p.phase) * p.sway;
        const flicker = 0.7 + 0.3 * Math.sin(frame * 0.35 + p.phase);
        const cooling = interpolate(y, [0, height], [0.05, 1], CLAMP);
        return (
          <EmberDot
            key={i}
            x={x}
            y={y}
            size={p.size}
            color={p.color}
            opacity={p.strength * flicker * cooling * 0.8}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
