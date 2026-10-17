import * as THREE from "three";
import { portfolio } from "../data/portfolio";

const SIZE = 16;
const { accent, ok } = portfolio.brand.colors;
// Terreno em musgo azulado sobre ardósia, para o mundo ter cara própria.
const MOSS = "#4FA69B";
const SOIL = "#4B4770";

export const hashString = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Ctx = CanvasRenderingContext2D;
type Rand = () => number;
type Painter = (ctx: Ctx, rand: Rand) => void;

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16);
  const channel = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + 255 * amount)));
  return `rgb(${channel((n >> 16) & 255)}, ${channel((n >> 8) & 255)}, ${channel(n & 255)})`;
};

const px = (ctx: Ctx, x: number, y: number, color: string, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const noiseFill = (ctx: Ctx, rand: Rand, base: string, variance: number) => {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      px(ctx, x, y, shade(base, (rand() - 0.5) * variance));
    }
  }
};

const frame = (ctx: Ctx, color: string) => {
  px(ctx, 0, 0, color, SIZE, 1);
  px(ctx, 0, SIZE - 1, color, SIZE, 1);
  px(ctx, 0, 0, color, 1, SIZE);
  px(ctx, SIZE - 1, 0, color, 1, SIZE);
};

const cracks = (ctx: Ctx, rand: Rand, color: string, count: number) => {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * 11);
    const y = 1 + Math.floor(rand() * 14);
    px(ctx, x, y, color, 2 + Math.floor(rand() * 4), 1);
  }
};

const gems = (ctx: Ctx, rand: Rand, color: string) => {
  const spots = [
    [1, 1],
    [9, 2],
    [5, 6],
    [11, 8],
    [1, 10],
    [7, 12],
  ];
  for (const [sx, sy] of spots) {
    const x = sx + Math.floor(rand() * 2);
    const y = sy + Math.floor(rand() * 2);
    px(ctx, x, y, color, 3, 3);
    px(ctx, x + 3, y + 1, shade(color, -0.14), 1, 2);
    px(ctx, x, y, shade(color, 0.28), 2, 1);
  }
};

const serverPanel =
  (led: string, band: string | null): Painter =>
  (ctx, rand) => {
    noiseFill(ctx, rand, "#2E3156", 0.04);
    frame(ctx, "#474B7E");
    px(ctx, 2, 3, "#1A1B36", 8, 1);
    px(ctx, 2, 5, "#1A1B36", 8, 1);
    px(ctx, 12, 3, led, 2, 1);
    px(ctx, 12, 5, led, 2, 1);
    px(ctx, 2, 8, band ?? "#1A1B36", 12, 5);
    if (band) {
      px(ctx, 2, 8, shade(band, 0.16), 12, 1);
    }
  };

const head = (hair: number): Painter => (ctx, rand) => {
  noiseFill(ctx, rand, "#E0B08A", 0.04);
  px(ctx, 0, 0, "#2A1D17", SIZE, hair);
};

const painters: Record<string, Painter> = {
  grassTop: (ctx, rand) => {
    noiseFill(ctx, rand, MOSS, 0.1);
    for (let i = 0; i < 9; i++) {
      px(ctx, Math.floor(rand() * 16), Math.floor(rand() * 16), "#7FD6C4");
    }
  },
  dirt: (ctx, rand) => {
    noiseFill(ctx, rand, SOIL, 0.08);
    cracks(ctx, rand, "#39365A", 4);
  },
  grassSide: (ctx, rand) => {
    noiseFill(ctx, rand, SOIL, 0.08);
    cracks(ctx, rand, "#39365A", 3);
    px(ctx, 0, 0, MOSS, SIZE, 2);
    px(ctx, 0, 2, shade(MOSS, -0.14), SIZE, 1);
  },
  stone: (ctx, rand) => {
    noiseFill(ctx, rand, "#7C7F8E", 0.1);
    cracks(ctx, rand, "#62657A", 5);
  },
  deepstone: (ctx, rand) => {
    noiseFill(ctx, rand, "#3F4159", 0.1);
    cracks(ctx, rand, "#2C2D42", 6);
  },
  cavity: (ctx, rand) => noiseFill(ctx, rand, "#181828", 0.06),
  planks: (ctx, rand) => {
    noiseFill(ctx, rand, "#A9774A", 0.08);
    for (const y of [3, 7, 11, 15]) {
      px(ctx, 0, y, "#7C5433", SIZE, 1);
    }
    px(ctx, 5, 0, "#7C5433", 1, 3);
    px(ctx, 11, 4, "#7C5433", 1, 3);
    px(ctx, 3, 8, "#7C5433", 1, 3);
    px(ctx, 9, 12, "#7C5433", 1, 3);
  },
  server: serverPanel("#5C6B9C", null),
  serverAlertOff: serverPanel("#7A2A34", "#6A2630"),
  serverAlertOn: serverPanel(accent, accent),
  serverGreen: serverPanel(ok, null),
  serverOk: serverPanel(ok, ok),
  alert: (ctx, rand) => {
    noiseFill(ctx, rand, accent, 0.08);
    frame(ctx, shade(accent, -0.25));
    px(ctx, 7, 3, "#FFFFFF", 2, 6);
    px(ctx, 7, 11, "#FFFFFF", 2, 2);
  },
  ok: (ctx, rand) => {
    noiseFill(ctx, rand, "#34B862", 0.08);
    frame(ctx, shade("#34B862", -0.2));
    const check = [
      [3, 8],
      [4, 9],
      [5, 10],
      [6, 11],
      [7, 10],
      [8, 9],
      [9, 8],
      [10, 7],
      [11, 6],
      [12, 5],
    ];
    for (const [x, y] of check) {
      px(ctx, x, y, "#FFFFFF", 1, 2);
    }
  },
  hoodie: (ctx, rand) => noiseFill(ctx, rand, "#1E1E2E", 0.05),
  hoodieFront: (ctx, rand) => {
    noiseFill(ctx, rand, "#1E1E2E", 0.05);
    px(ctx, 6, 0, "#D9DBE8", 1, 5);
    px(ctx, 9, 0, "#D9DBE8", 1, 5);
    px(ctx, 3, 10, "#2C2D44", 10, 1);
    px(ctx, 3, 10, "#2C2D44", 1, 5);
    px(ctx, 12, 10, "#2C2D44", 1, 5);
  },
  pants: (ctx, rand) => {
    noiseFill(ctx, rand, "#2B3554", 0.06);
    px(ctx, 0, 12, "#15161F", SIZE, 4);
  },
  skin: (ctx, rand) => noiseFill(ctx, rand, "#E0B08A", 0.04),
  hair: (ctx, rand) => noiseFill(ctx, rand, "#2A1D17", 0.06),
  headSide: head(6),
  headBack: head(12),
  face: (ctx, rand) => {
    noiseFill(ctx, rand, "#E0B08A", 0.04);
    px(ctx, 0, 0, "#2A1D17", SIZE, 4);
    px(ctx, 0, 4, "#2A1D17", 3, 2);
    px(ctx, 11, 4, "#2A1D17", 5, 1);
    px(ctx, 3, 8, "#FFFFFF", 3, 2);
    px(ctx, 10, 8, "#FFFFFF", 3, 2);
    px(ctx, 4, 8, "#1B1B3A", 2, 2);
    px(ctx, 10, 8, "#1B1B3A", 2, 2);
    px(ctx, 6, 12, "#9C5F4A", 4, 1);
  },
};

const dynamicPainter = (key: string): Painter => {
  const [kind, color] = key.split(":");
  if (kind === "ore") {
    return (ctx, rand) => {
      noiseFill(ctx, rand, "#3F4159", 0.1);
      gems(ctx, rand, color);
    };
  }
  return (ctx, rand) => {
    noiseFill(ctx, rand, color, 0.07);
    frame(ctx, shade(color, -0.12));
  };
};

const textureCache = new Map<string, THREE.CanvasTexture>();

export const getTexture = (key: string) => {
  const cached = textureCache.get(key);
  if (cached) {
    return cached;
  }
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d") as Ctx;
  (painters[key] ?? dynamicPainter(key))(ctx, mulberry32(hashString(key)));
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  // Mipmap trilinear + anisotropia: sem isso a textura "formiga" quando a câmera anda.
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
};

const materialCache = new Map<string, THREE.Material>();

export const getMaterial = (textureKey: string, unlit = false) => {
  const id = `${textureKey}|${unlit}`;
  const cached = materialCache.get(id);
  if (cached) {
    return cached;
  }
  const map = getTexture(textureKey);
  const material = unlit
    ? new THREE.MeshBasicMaterial({ map })
    : new THREE.MeshLambertMaterial({ map });
  materialCache.set(id, material);
  return material;
};

const UNLIT = new Set(["serverAlertOn", "serverOk", "alert", "ok"]);

// Ordem das faces do BoxGeometry: +x, -x, +y, -y, +z, -z.
export const getBlockMaterial = (
  type: string,
): THREE.Material | THREE.Material[] => {
  if (type === "grass") {
    const side = getMaterial("grassSide");
    return [
      side,
      side,
      getMaterial("grassTop"),
      getMaterial("dirt"),
      side,
      side,
    ];
  }
  if (type.startsWith("face:")) {
    const front = getMaterial(`solid:${type.slice(5)}`, true);
    const side = getMaterial(`solid:${portfolio.brand.colors.nightBottom}`);
    return [side, side, side, side, front, front];
  }
  if (type.startsWith("glow:")) {
    return getMaterial(type, true);
  }
  return getMaterial(type, UNLIT.has(type));
};
