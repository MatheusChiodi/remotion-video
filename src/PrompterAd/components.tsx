import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, cueColors, CueKind, fonts } from "./prompter";

const pad = (n: number) => String(n).padStart(2, "0");

const SMPTE = [
  colors.chalk,
  colors.yellow,
  colors.cyan,
  colors.green,
  colors.magenta,
  colors.tally,
  "#2d4bd6",
];

// Moldura de estúdio: REC + timecode no topo, barras SMPTE na base
export const StudioFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blink = Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25;
  const secs = Math.floor(frame / fps);
  const timecode = `00:00:${pad(secs)}:${pad(frame % fps)}`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: fonts.mono,
          fontSize: 26,
          letterSpacing: "0.12em",
          color: colors.chalkDim,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: colors.tally,
              opacity: blink,
            }}
          />
          REC
        </span>
        <span>{timecode}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 10,
          display: "flex",
        }}
      >
        {SMPTE.map((c) => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Cue: React.FC<{ kind: CueKind; label: string; size?: number }> = ({
  kind,
  label,
  size = 26,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.2em 0.55em 0.15em",
      borderRadius: 3,
      fontFamily: fonts.mono,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      background: cueColors[kind].bg,
      color: cueColors[kind].fg,
      whiteSpace: "nowrap",
    }}
  >
    [{label}]
  </span>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = colors.chalkDim,
}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

export const Stripes: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      background: `repeating-linear-gradient(-45deg, ${colors.chalk} 0 30px, ${colors.coal} 30px 60px)`,
      ...style,
    }}
  />
);

export const TallyDot: React.FC<{ size?: number }> = ({ size = 22 }) => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame % 48, [0, 48], [0, size * 0.8]);
  const ringOpacity = interpolate(frame % 48, [0, 48], [0.6, 0]);
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: colors.tally,
        boxShadow: `0 0 0 ${ring}px rgba(229, 50, 45, ${ringOpacity})`,
        display: "inline-block",
      }}
    />
  );
};
