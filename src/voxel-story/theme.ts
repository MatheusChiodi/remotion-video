import { loadFont as loadPressStart } from "@remotion/google-fonts/PressStart2P";
import { loadFont as loadVt323 } from "@remotion/google-fonts/VT323";
import { Easing, interpolate, spring } from "remotion";
import { portfolio } from "./data/portfolio";

const pressStart = loadPressStart("normal", {
  weights: ["400"],
  subsets: ["latin", "latin-ext"],
});
const vt323 = loadVt323("normal", {
  weights: ["400"],
  subsets: ["latin", "latin-ext"],
});

export const fonts = {
  title: pressStart.fontFamily,
  mono: vt323.fontFamily,
};

export const palette = {
  ...portfolio.brand.colors,
  panelBorder: "#F4F4F8",
  panelInner: "#3A3D66",
  shadow: "rgba(4, 4, 14, 0.55)",
  duskBottom: "#2A2456",
  preDawnBottom: "#4A3260",
};

export const springs = {
  pop: { damping: 11, stiffness: 190, mass: 0.6 },
  settle: { damping: 200 },
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

export const progress = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = easeOut,
) => interpolate(frame, [from, to], [0, 1], { ...clamp, easing });

export const pop = (frame: number, start: number, fps: number) =>
  frame < start
    ? 0
    : spring({ frame: frame - start, fps, config: springs.pop });

// Vai e volta suave entre 0 e 1, um ciclo a cada `period` frames.
export const swing = (frame: number, period: number) =>
  0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);

// Sobe até 1 em `peak` e volta a 0: usado para golpes de braço e flashes.
export const pulse = (frame: number, peak: number, spread: number) =>
  Math.max(0, 1 - Math.abs(frame - peak) / spread);
