import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { copy, palette } from "./cockpit";
import {
  Accent,
  CLAMP,
  Cursor,
  fonts,
  gauge,
  Line,
  pop,
  rail,
  rise,
  Segment,
  Terminal,
  Title,
  typed,
} from "./components";

const Center: React.FC<{
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, gap = 40, style }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap,
      padding: 70,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

const RULE: Segment[] = [["border", "─".repeat(56)]];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lead = pop(frame, fps, 4);
  const punch = pop(frame, fps, 30);
  const term = pop(frame, fps, 52);
  return (
    <Center gap={50}>
      <div style={{ fontSize: 48, color: palette.text, ...rise(lead) }}>
        {copy.hook.lead}
      </div>
      <Title size={92} style={rise(punch, 60)}>
        olhando só para o <Accent>prompt</Accent>?
      </Title>
      <Terminal title="claude — ~/projetos/checkout" style={rise(term, 80)}>
        <Line segments={RULE} />
        <div>
          <span style={{ color: palette.claude }}>&gt; </span>
          <Cursor />
        </div>
        <Line segments={RULE} />
      </Terminal>
    </Center>
  );
};

export const Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = pop(frame, fps, 82);
  return (
    <Center gap={28}>
      {copy.pain.questions.map((q, i) => {
        const p = pop(frame, fps, 4 + i * 14);
        const dimmed = interpolate(frame, [78, 92], [1, 0.35], CLAMP);
        return (
          <div
            key={q}
            style={{
              ...rise(p, 30),
              opacity: p * dimmed,
              width: 860,
              padding: "26px 34px",
              borderRadius: 18,
              background: palette.terminal,
              border: `1.5px solid ${palette.border}`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 42,
              fontWeight: 500,
              color: palette.text,
              transform: `${rise(p, 30).transform} rotate(${(i % 2 ? 1 : -1) * (1 - p) * 4}deg)`,
            }}
          >
            <span
              style={{
                fontFamily: fonts.mono,
                color: palette.warn,
                fontWeight: 700,
              }}
            >
              ?
            </span>
            {q}
          </div>
        );
      })}
      <Title size={70} style={{ ...rise(punch, 50), marginTop: 30 }}>
        Pilotar sem painel é <Accent tone="err">voar às cegas</Accent>.
      </Title>
    </Center>
  );
};

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = pop(frame, fps, 6);
  const sweep = interpolate(frame, [14, 60], [0, 100], CLAMP);
  const tag = pop(frame, fps, 40);
  const glow = interpolate(frame, [0, 40], [0, 1], CLAMP);
  return (
    <Center gap={36}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          transform: `scale(${0.7 + mark * 0.3})`,
          opacity: mark,
        }}
      >
        <div
          style={{
            width: 26,
            height: 150,
            borderRadius: 6,
            background: palette.claude,
            boxShadow: `0 0 ${60 * glow}px ${palette.claude}`,
          }}
        />
        <div
          style={{
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -6,
            color: palette.bright,
          }}
        >
          {copy.reveal.name}
        </div>
      </div>
      <Line
        segments={gauge(sweep, 22, sweep > 85 ? "ok" : "claude")}
        style={{ fontFamily: fonts.mono, fontSize: 34, opacity: mark }}
      />
      <div
        style={{
          fontSize: 50,
          fontWeight: 500,
          color: palette.text,
          textAlign: "center",
          maxWidth: 860,
          lineHeight: 1.25,
          ...rise(tag),
        }}
      >
        {copy.reveal.tagline}
      </div>
    </Center>
  );
};

type Band = { at: number; caption: string; lines: (p: number) => Segment[][] };

const BANDS: Band[] = [
  {
    at: 30,
    caption: "Git sempre à vista",
    lines: () => [
      [
        ...rail("git", "git"),
        ["bright", "feat/checkout"],
        ["text", "  ±3 "],
        ["ok", "+42"],
        ["err", " −7"],
        ["warn", "  ↑1"],
        ["dim", "  há 2h"],
      ],
    ],
  },
  {
    at: 75,
    caption: "Contexto, limite de 5h e custo",
    lines: (p) => [
      [
        ...rail("claude", "contexto"),
        ...gauge(38 * p, 10, "ok"),
        ["ok", ` ${Math.round(38 * p)}%`],
        ["dim", "  5H "],
        ...gauge(62 * p, 6, "warn"),
        ["warn", ` ${Math.round(62 * p)}%`],
        ["dim", `  US$ ${(2.31 * p).toFixed(2)}`],
      ],
    ],
  },
  {
    at: 120,
    caption: "Tarefas do projeto, clicáveis",
    lines: (p) => [
      [...rail("daily", "tarefas"), ...gauge(33 * p, 8, "ok"), ["bright", " 1/3"]],
      [["text", " ".repeat(12)], ["warn", "◇ "], ["text", "escrever o teste do login"]],
      [["text", " ".repeat(12)], ["ok", "◆ "], ["dim", "atualizar dependências"]],
    ],
  },
  {
    at: 165,
    caption: "Blocos de foco com progresso",
    lines: (p) => [
      [
        ...rail("daily", "foco"),
        ...gauge(48 * p, 16, "daily"),
        ["bright", ` ${Math.round(12 * p)} min`],
        ["dim", " de 25"],
      ],
    ],
  },
  {
    at: 210,
    caption: "Contagem regressiva do prazo",
    lines: () => [
      [
        ...rail("daily", "prazo"),
        ["warn", "em 18h 20min"],
        ["text", "  entrega do checkout"],
      ],
    ],
  },
  {
    at: 255,
    caption: "E o que os guards barraram",
    lines: () => [
      [
        ...rail("claude", "guards"),
        ["warn", "2 bloqueios"],
        ["dim", "  rm-guard: rm -rf ~/"],
      ],
    ],
  },
];

export const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const term = pop(frame, fps, 0);
  const status = pop(frame, fps, 285);
  const current = [...BANDS].reverse().find((b) => frame >= b.at);
  const captionIn = current ? pop(frame, fps, current.at) : 0;
  const count = BANDS.filter((b) => frame >= b.at).length;
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", padding: 70, gap: 40 }}
    >
      <div style={{ textAlign: "center", height: 190 }}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 28,
            color: palette.claude,
            letterSpacing: 4,
          }}
        >
          {`PAINEL ${count}/${BANDS.length}`}
        </div>
        <Title
          size={66}
          style={{ marginTop: 16, ...rise(captionIn, 24) }}
          key={current?.caption}
        >
          {current?.caption ?? " "}
        </Title>
      </div>
      <Terminal
        title="claude — ~/projetos/checkout"
        fontSize={28}
        style={{
          ...rise(term, 80),
          transform: `${rise(term, 80).transform} scale(${0.94 + term * 0.06})`,
        }}
      >
        {BANDS.map((band) => {
          if (frame < band.at) return null;
          const p = pop(frame, fps, band.at);
          const fill = interpolate(frame, [band.at + 4, band.at + 34], [0, 1], CLAMP);
          const flash = interpolate(frame, [band.at, band.at + 20], [1, 0], CLAMP);
          return (
            <div
              key={band.caption}
              style={{
                opacity: p,
                transform: `translateX(${(1 - p) * -40}px)`,
                background: `${palette.claude}${Math.round(flash * 40)
                  .toString(16)
                  .padStart(2, "0")}`,
                borderRadius: 8,
              }}
            >
              {band.lines(fill).map((segments, i) => (
                <Line key={i} segments={segments} />
              ))}
            </div>
          );
        })}
        <Line segments={RULE} />
        <div>
          <span style={{ color: palette.claude }}>&gt; </span>
          <Cursor />
        </div>
        <Line segments={RULE} />
        <Line
          style={{ opacity: status }}
          segments={[
            ["dim", "  tests "],
            ["ok", "✓"],
            ["dim", " 14:32 · 3.1s   turno US$ 0.12 · sessão US$ 2.31"],
          ]}
        />
      </Terminal>
    </AbsoluteFill>
  );
};

const Blocked: React.FC<{
  start: number;
  command: string;
  message: string[];
}> = ({ start, command, message }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = typed(command, frame, start, 1.2);
  const blockAt = start + Math.ceil(command.length / 1.2) + 8;
  const block = pop(frame, fps, blockAt);
  const shake =
    frame >= blockAt
      ? Math.sin((frame - blockAt) * 2.2) *
        interpolate(frame, [blockAt, blockAt + 14], [10, 0], CLAMP)
      : 0;
  if (frame < start) return null;
  return (
    <div style={{ marginBottom: 26, transform: `translateX(${shake}px)` }}>
      <Line
        segments={[
          ["claude", "● "],
          ["bright", "Bash"],
          ["text", `(${shown}`],
          ["text", shown.length === command.length ? ")" : ""],
        ]}
      />
      {message.map((text, i) => (
        <Line
          key={text}
          style={{ opacity: block }}
          segments={[["err", `${i === 0 ? "  ⎿ " : "    "}${text}`]]}
        />
      ))}
    </div>
  );
};

export const Guards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = pop(frame, fps, 0);
  const sub = pop(frame, fps, 10);
  const term = pop(frame, fps, 6);
  const flash = Math.max(
    interpolate(frame, [42, 60], [0.35, 0], CLAMP) * (frame >= 42 ? 1 : 0),
    interpolate(frame, [124, 142], [0.35, 0], CLAMP) * (frame >= 124 ? 1 : 0),
  );
  return (
    <Center gap={50}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 60%, ${palette.err}, transparent 65%)`,
          opacity: flash,
        }}
      />
      <div style={{ textAlign: "center" }}>
        <Title size={110} style={rise(head)}>
          <Accent tone="err">{copy.guards.title}</Accent>
        </Title>
        <div
          style={{
            fontSize: 44,
            color: palette.text,
            marginTop: 18,
            maxWidth: 820,
            lineHeight: 1.25,
            ...rise(sub),
          }}
        >
          {copy.guards.subtitle}
        </div>
      </div>
      <Terminal title="claude — guards ativos" style={rise(term, 80)}>
        <Blocked
          start={14}
          command="rm -rf ~/"
          message={[
            'rm-guard bloqueou: apagar "~/" recursivamente.',
            "Se for intencional, rode você mesmo.",
          ]}
        />
        <Blocked
          start={80}
          command="git push --force origin main"
          message={[
            "git-guard bloqueou: --force reescreve o remoto.",
            "Use --force-with-lease.",
          ]}
        />
      </Terminal>
    </Center>
  );
};

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tones = ["claude", "project", "err", "daily"] as const;
  return (
    <Center gap={40}>
      <Title size={64} style={rise(pop(frame, fps, 0))}>
        Cada mod é um plugin.
        <br />
        <span style={{ color: palette.text, fontWeight: 500 }}>
          Instale só o que usar.
        </span>
      </Title>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          width: 900,
          marginTop: 20,
        }}
      >
        {copy.stats.map((stat, i) => {
          const p = pop(frame, fps, 14 + i * 8);
          const n = Math.round(
            stat.value * interpolate(frame, [14 + i * 8, 60 + i * 8], [0, 1], CLAMP),
          );
          return (
            <div
              key={stat.label}
              style={{
                ...rise(p, 40),
                background: palette.terminal,
                border: `1.5px solid ${palette.border}`,
                borderRadius: 22,
                padding: "34px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                borderLeft: `10px solid ${palette[tones[i]]}`,
              }}
            >
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 800,
                  letterSpacing: -4,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 32,
                  color: palette.dim,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = pop(frame, fps, 0);
  const term = pop(frame, fps, 8);
  const starts = [20, 82, 120];
  const link = pop(frame, fps, 140);
  const author = pop(frame, fps, 158);
  return (
    <Center gap={46}>
      <Title size={84} style={rise(head)}>
        {copy.cta.title}
      </Title>
      <Terminal title="claude" style={rise(term, 80)} fontSize={25}>
        {copy.cta.commands.map((command, i) => (
          <Sequence key={command} from={starts[i]} layout="none">
            <Line
              segments={[
                ["claude", "> "],
                ["bright", typed(command, frame, starts[i], 1.3)],
              ]}
            />
          </Sequence>
        ))}
        <div>
          <span style={{ color: palette.claude }}>&gt; </span>
          <Cursor />
        </div>
      </Terminal>
      <div
        style={{
          ...rise(link, 40),
          transform: `${rise(link, 40).transform} scale(${0.9 + link * 0.1})`,
          padding: "26px 44px",
          borderRadius: 999,
          background: palette.claude,
          color: palette.bg,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 38,
          boxShadow: `0 0 ${80 * link}px ${palette.claude}88`,
        }}
      >
        {copy.cta.link}
      </div>
      <div style={{ textAlign: "center", ...rise(author, 30) }}>
        <div style={{ fontSize: 34, color: palette.text }}>{copy.cta.footnote}</div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            marginTop: 14,
            color: palette.bright,
          }}
        >
          {copy.cta.author}
        </div>
      </div>
    </Center>
  );
};
