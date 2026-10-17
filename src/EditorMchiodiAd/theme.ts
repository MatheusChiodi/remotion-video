import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { Easing, interpolate } from "remotion";

const inter = loadInter("normal", {
  weights: ["500", "600", "800"],
  subsets: ["latin", "latin-ext"],
});
const playfair = loadPlayfair("normal", {
  weights: ["600"],
  subsets: ["latin", "latin-ext"],
});
// itálico só no peso de título: é a palavra em coral das frases serifadas (mesma regra do editor-mchiodi)
loadPlayfair("italic", { weights: ["600"], subsets: ["latin", "latin-ext"] });
const mono = loadMono("normal", {
  weights: ["500", "700"],
  subsets: ["latin", "latin-ext"],
});

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1350;
export const TRANSITION = 12;

// Tokens do design system MChiodi (motion/src/theme.ts do editor-mchiodi)
export const colors = {
  paper: "#f8f8f2",
  ink: "#111827",
  slate900: "#0f172a",
  slate600: "#475569",
  slate300: "#cbd5e1",
  line: "rgba(17, 24, 39, 0.08)",
  coral: "#ff5555",
  coralDeep: "#ca3434",
  coralWash: "#ffe9e6",
  emerald: "#34d399",
  night: "#0c0c0c",
  white: "#ffffff",
  glowPeriwinkle: "#7c93ff",
  glowPeach: "#ffb86c",
};

export const fonts = {
  body: inter.fontFamily,
  display: playfair.fontFamily,
  mono: mono.fontFamily,
};

export const shadow = {
  card: "0 18px 35px -20px rgba(15,23,42,0.55)",
  raised: "0 30px 70px -30px rgba(15,23,42,0.75)",
};

export const SAFE_X = 96;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// 0 → 1 a partir de `delay` segundos, durando `duration` segundos
export const enter = (
  frame: number,
  fps: number,
  delay: number,
  duration = 0.5,
) =>
  interpolate(frame, [delay * fps, (delay + duration) * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
