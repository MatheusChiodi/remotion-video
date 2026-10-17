// Único arquivo a editar para trocar textos, cores e tempos do vídeo.
import { loadFont as loadRead } from "@remotion/google-fonts/AtkinsonHyperlegible";
// Big Shoulders Display não é exportada pelo pacote; a família variável é o mesmo desenho
import { loadFont as loadDisplay } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { Easing, interpolate } from "remotion";

export const FPS = 30;

const display = loadDisplay("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});
const read = loadRead("normal", { weights: ["400", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const fonts = {
  display: display.fontFamily,
  read: read.fontFamily,
  mono: mono.fontFamily,
};

// Paleta do próprio app (web/src/index.css)
export const colors = {
  coal: "#15171a",
  coal2: "#1c1f23",
  line: "#2b2f35",
  chalk: "#ece8df",
  chalkDim: "#9b988f",
  past: "#4a4d52",
  tally: "#e5322d",
  yellow: "#e4d23a",
  cyan: "#2ec4d6",
  magenta: "#c64bd6",
  green: "#3fbf5a",
};

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// 0 → 1 a partir do frame `start`
export const enter = (frame: number, start: number, duration = 14) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...CLAMP,
    easing: easeOut,
  });

export const rise = (progress: number, distance = 40) => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px)`,
});

export const REPO_URL = "github.com/MatheusChiodi/prompter-mchiodi";

export type CueKind = "cut" | "broll" | "pause" | "note";

export const cueColors: Record<CueKind, { bg: string; fg: string }> = {
  cut: { bg: colors.tally, fg: "#fff" },
  broll: { bg: colors.cyan, fg: colors.coal },
  pause: { bg: colors.magenta, fg: "#fff" },
  note: { bg: colors.yellow, fg: colors.coal },
};

export type Token =
  | { word: string; heard?: string; how?: string }
  | { cue: string; kind: CueKind };

const w = (word: string, heard?: string, how?: string): Token => ({
  word,
  heard,
  how,
});

export const demoScript: Token[] = [
  w("Fala,"),
  w("pessoal!"),
  w("Hoje"),
  w("eu"),
  w("vou"),
  w("fazer"),
  w("o"),
  w("deploy", "deploi", "chave fonética"),
  w("de"),
  w("uma"),
  w("aplicação"),
  w("React", "riact", "chave fonética"),
  w("num"),
  w("cluster"),
  w("Kubernetes.", "cubernetis", "chave fonética"),
  { cue: "CORTE", kind: "cut" },
  w("O"),
  w("useEffect", "use effect", "palavras coladas"),
  w("virou"),
  w("bagunça"),
  w("e"),
  w("o"),
  w("build", "bild", "1 letra de diferença"),
  w("demora."),
  { cue: "B-ROLL: terminal", kind: "broll" },
];

export const features = [
  {
    title: "Segue palavra por palavra",
    detail: "A palavra da vez fica destacada na linha de leitura.",
    color: colors.tally,
  },
  {
    title: "Espera quando você para",
    detail: "Silêncio segura o cursor. Improviso não arrasta o texto.",
    color: colors.cyan,
  },
  {
    title: "Roteiro em Markdown",
    detail: "Seções com tempo estimado e marcações que nunca são lidas.",
    color: colors.magenta,
  },
  {
    title: "Claude Code opcional",
    detail: "Sem API key: usa sua assinatura. Funciona 100% sem ele.",
    color: colors.yellow,
  },
];

export const stack = ["React 19", "TypeScript", "Vite 7", "Node 20", "MIT"];

// Duração de cada cena em frames, medida de corte a corte
export const scenes = {
  hook: 105,
  problem: 120,
  reveal: 90,
  demo: 270,
  matcher: 165,
  features: 165,
  cta: 150,
};

export const timing = {
  fadeFrames: 6,
  demoStart: 24,
  framesPerWord: 9,
};

export const TOTAL_FRAMES = Object.values(scenes).reduce((a, b) => a + b, 0);
