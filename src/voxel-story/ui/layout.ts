import { useVideoConfig } from "remotion";
import type { AccentText } from "../data/portfolio";

export const SAFE = 80;

export const useLayout = () => {
  const { width, height, fps } = useVideoConfig();
  const vertical = height > width;
  return {
    width,
    height,
    fps,
    vertical,
    // Paisagem tem mais largura por linha, então a UI cresce um pouco.
    unit: vertical ? 1 : 1.15,
    maxWidth: width - SAFE * 2,
  };
};

// Meio pixel: mantém a borda nítida sem o deslocamento andar em degraus.
export const snap = (value: number) => Math.round(value * 2) / 2;

export type Segment = { text: string; accent: boolean };

export const splitAccent = ({ text, accent }: AccentText): Segment[] => {
  const index = accent ? text.indexOf(accent) : -1;
  if (!accent || index < 0) {
    return [{ text, accent: false }];
  }
  return [
    { text: text.slice(0, index), accent: false },
    { text: accent, accent: true },
    { text: text.slice(index + accent.length), accent: false },
  ].filter((segment) => segment.text.length > 0);
};
