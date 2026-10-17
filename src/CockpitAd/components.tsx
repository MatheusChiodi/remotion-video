import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./cockpit";

const inter = loadInter("normal", {
  weights: ["400", "500", "700", "800"],
  subsets: ["latin"],
});
const mono = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const fonts = { body: inter.fontFamily, mono: mono.fontFamily };

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Canvas de design fixo, escalado para caber em qualquer formato da composição
export const DESIGN = { width: 1080, height: 1350 };

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 160 } });

export const rise = (progress: number, distance = 40) => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px)`,
});

export const typed = (text: string, frame: number, start: number, perFrame = 1.4) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * perFrame)));

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const scale = Math.min(width / DESIGN.width, height / DESIGN.height);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: DESIGN.width,
          height: DESIGN.height,
          transform: `scale(${scale})`,
          flexShrink: 0,
          position: "relative",
          fontFamily: fonts.body,
          color: palette.bright,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.4) % 60;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${palette.border}55 1px, transparent 1px), linear-gradient(90deg, ${palette.border}55 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `0 ${drift}px`,
          maskImage:
            "radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${palette.claude}22, transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export type Tone = keyof typeof palette;
export type Segment = [Tone, string];

// Uma linha do terminal: sequência de trechos coloridos em fonte mono
export const Line: React.FC<{
  segments: Segment[];
  style?: React.CSSProperties;
}> = ({ segments, style }) => (
  <div style={{ whiteSpace: "pre", minHeight: "1.55em", ...style }}>
    {segments.map(([tone, text], i) => (
      <span
        key={i}
        style={{
          color: palette[tone],
          fontWeight: tone === "bright" ? 700 : 400,
        }}
      >
        {text}
      </span>
    ))}
  </div>
);

// Gauge do kit: traço cheio até o knob, traço fino depois
export const gauge = (percent: number, width: number, tone: Tone): Segment[] => {
  const at = Math.round((Math.min(100, Math.max(0, percent)) / 100) * (width - 1));
  return [
    [tone, `${"━".repeat(at)}●`],
    ["border", "─".repeat(width - 1 - at)],
  ];
};

export const rail = (hue: Tone, label: string): Segment[] => [
  [hue, "▍ "],
  ["dim", label.toUpperCase().padEnd(10)],
];

export const Terminal: React.FC<{
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  fontSize?: number;
}> = ({ title, children, style, fontSize = 26 }) => (
  <div
    style={{
      width: 940,
      borderRadius: 22,
      overflow: "hidden",
      background: palette.terminal,
      border: `1.5px solid ${palette.border}`,
      boxShadow: `0 40px 120px #000a, 0 0 0 1px #0008, 0 0 80px ${palette.claude}14`,
      ...style,
    }}
  >
    <div
      style={{
        height: 54,
        background: palette.chrome,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        gap: 10,
      }}
    >
      {[palette.err, palette.warn, palette.ok].map((c) => (
        <div
          key={c}
          style={{ width: 15, height: 15, borderRadius: 99, background: c }}
        />
      ))}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          marginRight: 70,
          fontFamily: fonts.mono,
          fontSize: 20,
          color: palette.dim,
        }}
      >
        {title}
      </div>
    </div>
    <div
      style={{
        padding: "26px 30px 30px",
        fontFamily: fonts.mono,
        fontSize,
        lineHeight: 1.55,
        color: palette.text,
      }}
    >
      {children}
    </div>
  </div>
);

export const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 15) % 2 === 0;
  return <span style={{ color: palette.bright, opacity: on ? 1 : 0 }}>█</span>;
};

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 80, style }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: -2,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Accent: React.FC<{ children: React.ReactNode; tone?: Tone }> = ({
  children,
  tone = "claude",
}) => <span style={{ color: palette[tone] }}>{children}</span>;

