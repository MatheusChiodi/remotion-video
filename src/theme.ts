import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { Easing, interpolate } from "remotion";

const inter = loadInter("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
const playfair = loadPlayfair("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

export const fonts = {
  body: inter.fontFamily,
  display: playfair.fontFamily,
};

export const colors = {
  paper: "#f8f8f2",
  coral: "#ff5555",
  white: "#ffffff",
  slate300: "oklch(86.9% 0.022 252.894)",
  slate600: "oklch(44.6% 0.043 257.281)",
  slate700: "oklch(37.2% 0.044 257.287)",
  slate800: "oklch(27.9% 0.041 260.031)",
  slate900: "oklch(20.8% 0.042 265.755)",
  emerald50: "oklch(97.9% 0.021 166.113)",
  emerald200: "oklch(90.5% 0.093 164.15)",
  emerald400: "oklch(76.5% 0.177 163.223)",
  emerald700: "oklch(50.8% 0.118 165.612)",
  mintInk: "#3aa27a",
  mintWash: "#f3fff3",
  periwinkleInk: "#5264d8",
  periwinkleWash: "#f2f4ff",
  glowMint: "#9dffce",
  glowCyan: "#4be4ff",
  glowPeriwinkle: "#7c93ff",
  glowPeach: "#ffb86c",
};

export const shadows = {
  pill: "0 3px 9px 0 rgba(0,0,0,0.1), 0 3px 6px -3px rgba(0,0,0,0.1)",
  cta: "0 54px 120px -45px rgba(15,23,42,0.75)",
  card: "0 54px 105px -60px rgba(15,23,42,0.35)",
};

export const SAFE = { x: 80, y: 220 };

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
