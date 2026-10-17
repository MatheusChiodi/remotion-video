export type AccentText = {
  text: string;
  accent?: string;
};

export type TimedText = AccentText & {
  from: number;
  to: number;
};

export type IconName = "shield" | "flag" | "chip" | "magnifier" | "mixer" | "phone";

// Frames de cada cena são locais (0 = início da cena). Os marcos globais ficam em video.landmarks.
export const portfolio = {
  brand: {
    name: "MChiodi",
    accentLetters: 1,
    subtitle: {
      text: "Tech Lead Fullstack · sistemas críticos",
      accent: "sistemas críticos",
    } as AccentText,
    links: [
      "matheuschiodi.github.io/Portfolio",
      "github.com/MatheusChiodi",
      "linkedin.com/in/matheus-chiodi",
    ],
    colors: {
      accent: "#FF5555",
      ok: "#4ADE80",
      nightTop: "#0A0A1F",
      nightBottom: "#1B1B3A",
      dayTop: "#5B8FD9",
      dayBottom: "#CFE8FF",
      dawnTop: "#39407E",
      dawnMid: "#F2A0A8",
      dawnBottom: "#FFBE7A",
      panel: "#12122B",
      text: "#F4F4F8",
      muted: "#A9ABC8",
    },
  },

  video: {
    fps: 30,
    landmarks: [0, 90, 240, 420, 570, 750, 900],
    transitionFrames: 15,
  },

  audio: {
    enabled: false,
    music: "voxel-story/trilha.mp3",
    musicVolume: 0.45,
    sfx: {
      blockPlaced: "voxel-story/sfx/bloco.wav",
      achievement: "voxel-story/sfx/conquista.wav",
      volume: 0.7,
    },
  },

  hook: {
    terminal: {
      text: "> 03:12 · alerta em produção",
      accent: "alerta",
      from: 12,
      to: 105,
    } as TimedText,
    blinkFrames: 8,
  },

  origin: {
    spawn: [6, 34],
    walk: [38, 62],
    build: { start: 64, framesPerBlock: 2 },
    captions: [
      { text: "Tudo começou com código.", accent: "código", from: 14, to: 72 },
      {
        text: "FullStack · FI Sistemas · 2021",
        accent: "FI Sistemas",
        from: 76,
        to: 165,
      },
    ] as TimedText[],
    toast: {
      title: "Conquista desbloqueada",
      label: "LGPD implementada",
      icon: "shield" as IconName,
      from: 104,
      to: 165,
    },
  },

  turn: {
    descend: [0, 38],
    walkStart: 30,
    ores: { firstBreak: 50, stagger: 18 },
    errorFix: 142,
    stack: [
      { label: "Java", color: "#F2A33A" },
      { label: "Spring Boot", color: "#7BC96F" },
      { label: "Node.js", color: "#3FBFA0" },
      { label: "React", color: "#61DAFB" },
      { label: "Oracle", color: "#B388FF" },
    ],
    caption: {
      text: "Depois vieram os sistemas que não podem cair.",
      accent: "não podem cair",
      from: 20,
      to: 195,
    } as TimedText,
    footer: "Move Mais",
  },

  lead: {
    islands: ["Sustentação", "Produto", "Desenvolvimento"],
    firstBridge: [22, 60],
    otherBridges: [68, 106],
    flag: [108, 124],
    caption: {
      text: "Hoje, ele lidera quem mantém tudo de pé.",
      accent: "lidera",
      from: 12,
      to: 165,
    } as TimedText,
    toast: {
      title: "",
      label: "Tech Lead · 2026",
      icon: "flag" as IconName,
      from: 120,
      to: 165,
    },
  },

  side: {
    fill: { start: 8, stagger: 7 },
    highlight: { start: 40, framesPerItem: 36 },
    items: [
      {
        name: "AgentTeam-Memory",
        description: "memória para times de agentes",
        icon: "chip" as IconName,
      },
      {
        name: "CyberAudit",
        description: "auditoria de dependências",
        icon: "magnifier" as IconName,
      },
      {
        name: "MChiodi Audio Mixer",
        description: "FastAPI + React",
        icon: "mixer" as IconName,
      },
      {
        name: "Futuro Garantido",
        description: "app React Native",
        icon: "phone" as IconName,
      },
    ],
    caption: {
      text: "E quando ninguém pede, ele constrói.",
      accent: "constrói",
      from: 6,
      to: 195,
    } as TimedText,
  },

  close: {
    sunrise: [0, 100],
    greenWave: { start: 10, framesPerLayer: 2 },
    terminal: {
      text: "> 03:14 · resolvido",
      accent: "resolvido",
      from: 8,
      to: 52,
    } as TimedText,
    cameraPull: [44, 98],
    logo: { start: 50, framesPerColumn: 1, fallFrames: 18 },
    subtitleFrom: 84,
    linksFrom: 90,
  },
};

export type Portfolio = typeof portfolio;
