import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { spring, useVideoConfig } from "remotion";
import { fonts as baseFonts } from "../theme";

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });

export const fonts = {
  title: anton.fontFamily,
  body: baseFonts.body,
};

export type Format = "vertical" | "square" | "wide";

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const format: Format =
    width > height ? "wide" : width === height ? "square" : "vertical";
  const safe =
    format === "vertical"
      ? { x: 100, y: 150 }
      : format === "square"
        ? { x: 80, y: 80 }
        : { x: 110, y: 90 };
  return { format, width, height, safe };
};

// Entrada firme com leve overshoot, usada em títulos e blocos
export const punch = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness: 240, mass: 0.6 },
  });

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
