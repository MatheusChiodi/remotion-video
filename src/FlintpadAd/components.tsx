import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSans } from "@remotion/google-fonts/InstrumentSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "./flintpad";

// Mesmas famílias que o app carrega via fontsource
const display = loadDisplay("normal", { weights: ["600", "800"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const fonts = {
  display: display.fontFamily,
  body: sans.fontFamily,
  mono: mono.fontFamily,
};

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const DESIGN = { width: 1080, height: 1350 };

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 160 } });

export const rise = (progress: number, distance = 40) => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px)`,
});

export const typed = (text: string, frame: number, start: number, perFrame = 1.4) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * perFrame)));

export type Tone = keyof typeof palette;

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

// Fundo obsidian com facetas que derivam devagar, ecoando o ícone de pedra lascada
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.15;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(60deg, ${palette.border}40 1px, transparent 1px), linear-gradient(-60deg, ${palette.border}40 1px, transparent 1px)`,
          backgroundSize: "120px 70px",
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 15%, transparent 72%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 28%, ${palette.sheen}26, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, #000c 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 80, style }) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.06,
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
  tone = "sheen",
}) => <span style={{ color: palette[tone] }}>{children}</span>;

export const Center: React.FC<{
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, gap = 40, style }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap,
      padding: 70,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// Facetas do build/icon.svg do repositório, em ordem de montagem
const FACETS: { d: string; fill: string }[] = [
  { d: "M128 20 188 96 136 86Z", fill: "#86d9cd" },
  { d: "M128 20 136 86 68 96Z", fill: "#5b6984" },
  { d: "M68 96 136 86 120 146Z", fill: "#424f68" },
  { d: "M188 96 136 86 120 146Z", fill: "#4fbfb4" },
  { d: "M188 96 176 192 120 146Z", fill: "#323c50" },
  { d: "M68 96 80 192 120 146Z", fill: "#323c50" },
  { d: "M80 192 120 146 134 196Z", fill: "#424f68" },
  { d: "M176 192 120 146 134 196Z", fill: "#262e3d" },
  { d: "M80 192 128 236 134 196Z", fill: "#262e3d" },
  { d: "M176 192 128 236 134 196Z", fill: "#323c50" },
];

// Ícone que se monta faceta por faceta; `assemble` 0..1 por faceta vem de fora
export const FlintMark: React.FC<{
  size: number;
  progress: (index: number) => number;
  glow?: number;
}> = ({ size, progress, glow = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    style={{ overflow: "visible", filter: `drop-shadow(0 0 ${40 * glow}px ${palette.sheen}aa)` }}
  >
    {FACETS.map(({ d, fill }, i) => {
      const p = progress(i);
      const angle = (i / FACETS.length) * Math.PI * 2;
      const dx = Math.cos(angle) * 140 * (1 - p);
      const dy = Math.sin(angle) * 140 * (1 - p);
      return (
        <path
          key={d}
          d={d}
          fill={fill}
          stroke={fill}
          strokeWidth={0.8}
          strokeLinejoin="round"
          opacity={Math.min(1, p * 1.4)}
          transform={`translate(${dx} ${dy}) rotate(${(1 - p) * 90} 128 128)`}
        />
      );
    })}
  </svg>
);

export const Window: React.FC<{
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, style }) => (
  <div
    style={{
      width: 960,
      borderRadius: 22,
      overflow: "hidden",
      background: palette.panel,
      border: `1.5px solid ${palette.border}`,
      boxShadow: `0 40px 120px #000c, 0 0 80px ${palette.sheen}14`,
      ...style,
    }}
  >
    <div
      style={{
        height: 52,
        background: palette.chrome,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        gap: 10,
      }}
    >
      {[palette.danger, palette.caution, palette.sheen].map((c) => (
        <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />
      ))}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          marginRight: 70,
          fontFamily: fonts.mono,
          fontSize: 19,
          color: palette.dim,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);

export const Key: React.FC<{ children: React.ReactNode; lit?: number }> = ({
  children,
  lit = 0,
}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: 34,
      fontWeight: 700,
      padding: "14px 24px",
      minWidth: 70,
      textAlign: "center",
      borderRadius: 14,
      color: lit > 0.5 ? palette.bg : palette.bright,
      background: lit > 0.5 ? palette.sheenLight : palette.chrome,
      border: `1.5px solid ${palette.border}`,
      borderBottomWidth: 6 - lit * 4,
      transform: `translateY(${lit * 4}px)`,
    }}
  >
    {children}
  </div>
);
