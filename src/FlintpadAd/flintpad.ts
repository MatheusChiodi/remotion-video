// Único arquivo a editar para trocar textos, cores e tempos do vídeo do Flintpad.

export const FPS = 30;

// Paleta do próprio app (src/styles.css do repositório)
export const palette = {
  bg: "#05070b",
  panel: "#10141c",
  chrome: "#171c27",
  border: "#2d3648",
  text: "#aeb8c7",
  bright: "#e7ecf3",
  dim: "#7f8a9b",
  sheen: "#4fbfb4",
  sheenLight: "#86d9cd",
  paper: "#f6f7f5",
  ink: "#1a1f26",
  caution: "#e6c07b",
  danger: "#f0908d",
  blue: "#7aa2f7",
  violet: "#c792ea",
};

export const timing = {
  fadeFrames: 12,
};

export const scenes = {
  hook: 105,
  pain: 120,
  reveal: 120,
  tabs: 360,
  local: 165,
  keys: 120,
  cta: 210,
};

export const TOTAL_FRAMES =
  Object.values(scenes).reduce((sum, frames) => sum + frames, 0) -
  (Object.keys(scenes).length - 1) * timing.fadeFrames;

export const tabs = [
  { name: "Notas", shot: "flintpad/editor.svg", caption: "Editor de blocos sobre Markdown", tone: "sheen" },
  { name: "Grafo", shot: "flintpad/graph.svg", caption: "Mapa de como suas notas se ligam", tone: "violet" },
  { name: "Tarefas", shot: "flintpad/tasks.svg", caption: "Todo - [ ] do vault num lugar só", tone: "caution" },
  { name: "Quadros", shot: "flintpad/whiteboard.svg", caption: "Whiteboards salvos como JSON", tone: "blue" },
  { name: "API", shot: "flintpad/requests.svg", caption: "Cliente de API em arquivos .bru", tone: "danger" },
  { name: "Código", shot: "flintpad/code.svg", caption: "Workbench estilo VS Code + terminal", tone: "sheenLight" },
  { name: "Navegador", shot: "flintpad/browser.svg", caption: "Chromium de verdade, numa aba", tone: "bright" },
] as const;

export const copy = {
  hook: {
    lead: "Notas, tarefas, API, código, navegador…",
    punch: "quantos apps você abre?",
  },
  pain: {
    clouds: ["conta obrigatória", "assinatura mensal", "telemetria", "dados no servidor deles"],
    punch: "Seus arquivos, na nuvem dos outros.",
  },
  reveal: {
    name: "Flintpad",
    tagline: "Seu workspace inteiro. Seus arquivos. Sua máquina.",
  },
  local: {
    title: "Tudo é arquivo comum.",
    files: [
      { path: "vault/", tone: "dim" },
      { path: "├─ ideias/roadmap.md", tone: "sheen" },
      { path: "├─ diario/2026-10-17.md", tone: "sheen" },
      { path: "├─ api/login.bru", tone: "danger" },
      { path: "└─ quadros/fluxo.whiteboard.json", tone: "blue" },
    ],
    badges: ["Sem conta", "Sem nuvem", "Sem telemetria"],
    footnote: "Abre seu vault do Obsidian direto.",
  },
  keys: {
    title: "Teclado primeiro.",
    shortcuts: [
      { keys: ["Ctrl", "N"], label: "nova nota" },
      { keys: ["Ctrl", "G"], label: "grafo" },
      { keys: ["Ctrl", "Shift", "K"], label: "código" },
      { keys: ["Ctrl", "Shift", "Y"], label: "navegador" },
    ],
    footnote: "Em português e inglês",
  },
  cta: {
    title: "Baixe grátis.",
    link: "github.com/MatheusChiodi/Flintpad",
    footnote: "Open source · MIT · Windows",
    author: "Matheus Chiodi",
  },
};
