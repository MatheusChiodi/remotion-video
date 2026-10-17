// Único arquivo a editar para trocar textos, cores e tempos do vídeo do Cockpit.

export const FPS = 30;

// Cores amostradas de docs/cockpit.svg do repositório
export const palette = {
  bg: "#0b0f16",
  terminal: "#141a24",
  chrome: "#222a38",
  border: "#2a3242",
  text: "#d5dbe6",
  bright: "#eef2f8",
  dim: "#677185",
  ok: "#8fd18b",
  warn: "#e8bd6a",
  err: "#f07b7b",
  claude: "#e58c62",
  git: "#b39df2",
  project: "#74a8f5",
  daily: "#5fc9b8",
};

export const timing = {
  fadeFrames: 12,
};

export const scenes = {
  hook: 105,
  pain: 130,
  reveal: 110,
  panel: 330,
  guards: 190,
  stats: 125,
  cta: 210,
};

export const TOTAL_FRAMES =
  Object.values(scenes).reduce((sum, frames) => sum + frames, 0) -
  (Object.keys(scenes).length - 1) * timing.fadeFrames;

export const copy = {
  hook: { lead: "Você usa o Claude Code…", punch: "olhando só para o prompt?" },
  pain: {
    questions: [
      "Quanto contexto ainda sobrou?",
      "Quanto já gastei hoje?",
      "Em que branch eu estou?",
      "Esse rm -rf é seguro?",
    ],
    punch: "Pilotar sem painel é voar às cegas.",
  },
  reveal: {
    name: "Cockpit",
    tagline: "Um painel de instrumentos para o Claude Code.",
  },
  guards: {
    title: "42 guards",
    subtitle: "Um cinto de segurança para comandos perigosos.",
  },
  stats: [
    { value: 309, label: "mods" },
    { value: 52, label: "painéis" },
    { value: 42, label: "guards" },
    { value: 3, label: "idiomas" },
  ],
  cta: {
    title: "Instale com uma linha.",
    commands: [
      "/plugin marketplace add MatheusChiodi/cockpit",
      "/plugin install git-band@cockpit",
      "/cockpit",
    ],
    link: "github.com/MatheusChiodi/cockpit",
    footnote: "Open source · MIT · EN / PT / ES",
    author: "Matheus Chiodi",
  },
};
