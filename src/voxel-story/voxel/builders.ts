import type { Block } from "./VoxelWorld";
import { hashString, mulberry32 } from "./textures";

export const hash3 = (seed: string, x: number, y: number, z: number) =>
  mulberry32(hashString(`${seed}:${x}:${y}:${z}`))();

const smooth = (t: number) => t * t * (3 - 2 * t);

const valueNoise = (seed: string, x: number, z: number) => {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const tx = smooth(x - x0);
  const tz = smooth(z - z0);
  const corner = (cx: number, cz: number) => hash3(seed, cx, 0, cz);
  const top = corner(x0, z0) * (1 - tx) + corner(x0 + 1, z0) * tx;
  const bottom = corner(x0, z0 + 1) * (1 - tx) + corner(x0 + 1, z0 + 1) * tx;
  return top * (1 - tz) + bottom * tz;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export type TerrainConfig = {
  radius: number;
  seed: string;
  maxHeight: number;
  // 0 = chão plano, 1 = morro na altura cheia.
  relief: (x: number, z: number) => number;
};

// Só os morros viram blocos; o nível do chão é o plano de <Ground />.
const terrainCache = new Map<string, Block[]>();

export const buildTerrain = ({
  radius,
  seed,
  maxHeight,
  relief,
}: TerrainConfig): Block[] => {
  // Cada cena remonta ao entrar; o cache evita recalcular milhares de colunas e travar o preview.
  const cached = terrainCache.get(seed);
  if (cached) {
    return cached;
  }
  const blocks: Block[] = [];
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const rim = clamp01((radius - Math.hypot(x, z)) / 6);
      const height = Math.round(
        valueNoise(seed, x * 0.16, z * 0.16) * maxHeight * relief(x, z) * rim,
      );
      if (height < 1) {
        continue;
      }
      blocks.push({ x, y: height, z, type: "grass" });
      for (let y = height - 1; y >= Math.max(1, height - 3); y--) {
        blocks.push({ x, y, z, type: "dirt" });
      }
    }
  }
  terrainCache.set(seed, blocks);
  return blocks;
};

export const ringRelief = (flatRadius: number) => (x: number, z: number) =>
  clamp01((Math.hypot(x, z) - flatRadius) / 6);

// Morros só atrás da torre: a frente fica livre para a câmera e para o logo.
export const TOWER_TERRAIN: TerrainConfig = {
  radius: 48,
  seed: "tower",
  maxHeight: 6,
  relief: (x, z) => ringRelief(9)(x, z) * clamp01((4 - z) / 8),
};

export const TOWER_TOP = 15;

export type TowerCell = {
  x: number;
  y: number;
  z: number;
  kind: "plinth" | "server" | "alert";
};

export const buildTower = (): TowerCell[] => {
  const cells: TowerCell[] = [];
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      cells.push({ x, y: 1, z, kind: "plinth" });
    }
  }
  for (let y = 2; y <= 13; y++) {
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && z === 0) {
          continue;
        }
        const alert = hash3("tower-alert", x, y, z) < 0.3;
        cells.push({ x, y, z, kind: alert ? "alert" : "server" });
      }
    }
  }
  cells.push({ x: 0, y: 14, z: 0, kind: "server" });
  cells.push({ x: 0, y: TOWER_TOP, z: 0, kind: "alert" });
  return cells;
};

export const buildIsland = (
  cx: number,
  cz: number,
  radius: number,
  top: string,
): Block[] => {
  const layers = [
    { dy: 0, r: radius, type: top },
    { dy: -1, r: radius - 0.7, type: "dirt" },
    { dy: -2, r: radius - 1.5, type: "stone" },
    { dy: -3, r: radius - 2.4, type: "stone" },
  ];
  const blocks: Block[] = [];
  for (const layer of layers) {
    if (layer.r < 0) {
      continue;
    }
    const reach = Math.ceil(layer.r);
    for (let x = -reach; x <= reach; x++) {
      for (let z = -reach; z <= reach; z++) {
        if (Math.hypot(x, z) <= layer.r + 0.3) {
          blocks.push({ x: cx + x, y: layer.dy, z: cz + z, type: layer.type });
        }
      }
    }
  }
  return blocks;
};

// Caminho 4-conectado entre dois pontos da grade (cada passo anda em x ou em z).
export const linePath = (
  from: [number, number],
  to: [number, number],
): [number, number][] => {
  const path: [number, number][] = [];
  let [x, z] = from;
  const dx = Math.abs(to[0] - x);
  const dz = Math.abs(to[1] - z);
  const sx = to[0] > x ? 1 : -1;
  const sz = to[1] > z ? 1 : -1;
  let walkedX = 0;
  let walkedZ = 0;
  path.push([x, z]);
  while (walkedX < dx || walkedZ < dz) {
    if (walkedZ >= dz || (walkedX < dx && (walkedX + 0.5) * dz < (walkedZ + 0.5) * dx)) {
      x += sx;
      walkedX++;
    } else {
      z += sz;
      walkedZ++;
    }
    path.push([x, z]);
  }
  return path;
};

export const bitmapToBlocks = (
  rows: string[],
  colorOf: (char: string) => string | null,
  cell: number,
): Block[] => {
  const blocks: Block[] = [];
  const height = rows.length;
  rows.forEach((row, r) => {
    const width = row.length;
    [...row].forEach((char, c) => {
      const color = colorOf(char);
      if (color) {
        blocks.push({
          x: (c - (width - 1) / 2) * cell,
          y: (height - 1 - r - (height - 1) / 2) * cell,
          z: 0,
          type: `solid:${color}`,
          scale: cell,
        });
      }
    });
  });
  return blocks;
};
