import React from "react";
import { interpolate } from "remotion";
import { clamp, easeOut } from "../theme";
import type { Vec3 } from "./camera";
import { VoxelWorld, type Block } from "./VoxelWorld";

const GLYPH_ROWS = 7;

// Alfabeto próprio em bitmap, só com as letras usadas pela marca.
const GLYPHS: Record<string, string[]> = {
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
  C: [".###", "#...", "#...", "#...", "#...", "#...", ".###"],
  h: ["#...", "#...", "#...", "###.", "#..#", "#..#", "#..#"],
  i: ["#", ".", "#", "#", "#", "#", "#"],
  o: ["....", "....", ".##.", "#..#", "#..#", "#..#", ".##."],
  d: ["...#", "...#", "...#", ".###", "#..#", "#..#", ".###"],
};

type Cell = { column: number; row: number; letter: number };

const layout = (text: string) => {
  const cells: Cell[] = [];
  let cursor = 0;
  [...text].forEach((char, letter) => {
    const glyph = GLYPHS[char];
    if (!glyph) {
      cursor += 3;
      return;
    }
    glyph.forEach((line, row) => {
      [...line].forEach((mark, c) => {
        if (mark === "#") {
          cells.push({ column: cursor + c, row, letter });
        }
      });
    });
    cursor += glyph[0].length + 1;
  });
  return { cells, columns: cursor - 1 };
};

export const voxelTextColumns = (text: string) => layout(text).columns;

export const VoxelText: React.FC<{
  text: string;
  frame: number;
  start: number;
  framesPerColumn: number;
  fallFrames: number;
  origin: Vec3;
  blockSize: number;
  accentLetters: number;
  accentType: string;
  baseType: string;
}> = ({
  text,
  frame,
  start,
  framesPerColumn,
  fallFrames,
  origin,
  blockSize,
  accentLetters,
  accentType,
  baseType,
}) => {
  const { cells, columns } = layout(text);
  const blocks: Block[] = [];

  for (const cell of cells) {
    const fromBottom = GLYPH_ROWS - 1 - cell.row;
    const delay = start + cell.column * framesPerColumn + fromBottom;
    if (frame < delay) {
      continue;
    }
    const fall = interpolate(frame, [delay, delay + fallFrames], [1, 0], {
      ...clamp,
      easing: easeOut,
    });
    blocks.push({
      x: origin[0] + (cell.column - (columns - 1) / 2) * blockSize,
      y: origin[1] + (fromBottom + 0.5) * blockSize + fall * 9 * blockSize,
      z: origin[2],
      type: cell.letter < accentLetters ? accentType : baseType,
      scale: blockSize,
    });
  }

  return <VoxelWorld blocks={blocks} />;
};
