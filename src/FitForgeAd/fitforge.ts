// Único arquivo a editar para trocar textos, cores, tempos, prints e flags do anúncio.

export const FPS = 30;

export const palette = {
  bg: "#0a0706",
  bgGlow: "#3a1404",
  ember: "#ff6a1a",
  emberHot: "#ffb347",
  emberDeep: "#e0301e",
  // Ciano e azul amostrados do halter no ícone do app
  primary: "#0dd8dd",
  primaryDeep: "#035094",
  text: "#fff6ec",
  textDim: "rgba(255, 246, 236, 0.64)",
  phoneBody: "#1b1a1d",
  phoneEdge: "#3a383d",
};

export const assets = {
  icon: "fitforge/icon.png",
  // Só preencher com o arquivo oficial, ex.: "fitforge/google-play-badge.png"
  playBadge: null as string | null,
};

// Prints oficiais da listagem na Play Store, mapeados pela tela que mostram
export const screens = {
  home: "fitforge/shot-1.jpg",
  workout: "fitforge/shot-2.jpg",
  muscles: "fitforge/shot-3.jpg",
  timer: "fitforge/shot-4.jpg",
  water: "fitforge/shot-5.jpg",
  profile: "fitforge/shot-6.jpg",
  routine: "fitforge/shot-7.jpg",
  exportData: "fitforge/shot-8.jpg",
  // Sem print de histórico na listagem: null mostra um placeholder neutro
  history: null as string | null,
};

export type Line = {
  text: string;
  // Palavras de `text` que recebem a cor de brasa
  accent?: string;
};

export type Feature = Line & {
  detail?: string;
  screen: string | null;
  placeholder: string;
};

const hook: Line[] = [
  { text: "Treinou ontem?" },
  { text: "Lembra o que fez?", accent: "fez?" },
];

const pain: Line = { text: "Chega de treino perdido.", accent: "perdido." };

const features: Feature[] = [
  {
    text: "Registre cada treino",
    accent: "treino",
    detail: "Cardio, musculação, yoga",
    screen: screens.workout,
    placeholder: "Treino de hoje",
  },
  {
    text: "Monte sua rotina",
    accent: "rotina",
    detail: "Músculos por dia",
    screen: screens.muscles,
    placeholder: "Rotina",
  },
  {
    text: "Timer de descanso",
    accent: "Timer",
    screen: screens.timer,
    placeholder: "Cronômetro",
  },
  {
    text: "Beba mais água",
    accent: "água",
    screen: screens.water,
    placeholder: "Água",
  },
  {
    text: "Veja sua evolução",
    accent: "evolução",
    detail: "Histórico de treinos",
    screen: screens.history,
    placeholder: "Histórico",
  },
  {
    text: "Exporte para o personal",
    accent: "Exporte",
    screen: screens.exportData,
    placeholder: "Exportar",
  },
];

export const copy = {
  hook,
  pain,
  reveal: {
    name: "FitForge",
    tagline: "Seu guia de treino no bolso",
  },
  features,
  trust: {
    text: "Nenhum dado coletado.",
    accent: "Nenhum",
    detail: "Nenhum dado compartilhado.",
  },
  cta: {
    name: "FitForge",
    button: "Baixe no Google Play",
    // Usado no lugar do badge enquanto `assets.playBadge` for null
    badgeFallback: "Disponível no Google Play",
    footer: "por MChiodi",
  },
};

// Duração de cada cena em frames, medida de corte a corte
export const scenes = {
  hook: 60,
  pain: 60,
  reveal: 75,
  features: 270,
  trust: 45,
  cta: 90,
};

export const timing = {
  // Fade entre cenas; já compensado nas sequências, não muda o total
  fadeFrames: 6,
  featureSlot: scenes.features / features.length,
  hookSecondLine: 24,
};

export const TOTAL_FRAMES = Object.values(scenes).reduce((a, b) => a + b, 0);

export const audio = {
  // Ligar só depois de colocar o arquivo em public/fitforge/trilha.mp3
  enabled: false,
  file: "fitforge/trilha.mp3",
  volume: 0.7,
  fadeInFrames: 15,
  fadeOutFrames: 30,
  // Reforço de volume em cada corte de cena
  hitBoost: 0.3,
  hitFrames: 8,
};
