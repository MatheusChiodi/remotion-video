import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, enter, fonts, SAFE, shadows } from "./theme";

const sceneStyle: React.CSSProperties = {
  padding: `${SAFE.y}px ${SAFE.x}px`,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontFamily: fonts.body,
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 600,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
};

const headlineStyle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 600,
  color: colors.slate900,
  margin: 0,
};

const supportStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 48,
  lineHeight: 1.4,
  color: colors.slate600,
};

const pillStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  padding: "22px 44px",
  borderRadius: 9999,
  backgroundColor: "rgba(255,255,255,0.6)",
  border: "2px solid rgba(255,255,255,0.4)",
  boxShadow: shadows.pill,
  fontSize: 44,
  fontWeight: 500,
  color: colors.slate600,
};

const WORD_STAGGER = 0.05;

// Sobe e aparece conforme `progress` vai de 0 a 1
const rise = (progress: number, distance = 40): React.CSSProperties => ({
  opacity: progress,
  transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
});

// Palavra revelada por máscara, como o hero do site
const MaskedWord: React.FC<{ progress: number; children: string }> = ({
  progress,
  children,
}) => (
  <span
    style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}
  >
    <span
      style={{
        display: "block",
        transform: `translateY(${interpolate(progress, [0, 1], [110, 0])}%)`,
      }}
    >
      {children}
    </span>
  </span>
);

const Words: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            ...rise(enter(frame, fps, delay + i * WORD_STAGGER)),
            display: "inline-block",
            marginRight: "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </>
  );
};

const StatusDot: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.6 + 0.4 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: color,
        opacity: pulse,
      }}
    />
  );
};

type StatementProps = {
  text: string;
  eyebrow?: string;
  eyebrowColor?: string;
  support?: string;
  fontSize?: number;
};

// Uma frase da narrativa, palavra por palavra
export const Statement: React.FC<StatementProps> = ({
  text,
  eyebrow,
  eyebrowColor = colors.slate600,
  support,
  fontSize = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textDelay = eyebrow ? 0.15 : 0.05;
  const supportDelay =
    textDelay + text.split(" ").length * WORD_STAGGER + 0.15;

  return (
    <AbsoluteFill style={{ ...sceneStyle, gap: 48 }}>
      {eyebrow ? (
        <div
          style={{
            ...eyebrowStyle,
            ...rise(enter(frame, fps, 0)),
            color: eyebrowColor,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2 style={{ ...headlineStyle, fontSize, lineHeight: 1.15 }}>
        <Words text={text} delay={textDelay} />
      </h2>
      {support ? (
        <p style={{ ...supportStyle, ...rise(enter(frame, fps, supportDelay)) }}>
          {support}
        </p>
      ) : null}
    </AbsoluteFill>
  );
};

export const AlertScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = (frame % fps) / fps;

  return (
    <AbsoluteFill style={{ ...sceneStyle, gap: 72 }}>
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          transform: `scale(${enter(frame, fps, 0, 0.4)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `6px solid ${colors.coral}`,
            opacity: 1 - ring,
            transform: `scale(${1 + ring * 1.6})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 24,
            borderRadius: "50%",
            backgroundColor: colors.coral,
          }}
        />
      </div>
      <h2 style={{ ...headlineStyle, fontSize: 136, lineHeight: 1.15 }}>
        <Words text="O alerta dispara." delay={0.15} />
      </h2>
      <div style={{ ...pillStyle, ...rise(enter(frame, fps, 0.4)) }}>
        Produção · prioridade alta
      </div>
    </AbsoluteFill>
  );
};

export const NameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ ...sceneStyle, gap: 56 }}>
      <div style={{ ...pillStyle, ...rise(enter(frame, fps, 0)) }}>
        <StatusDot color={colors.emerald400} />
        Olá, eu sou
      </div>
      <h1 style={{ ...headlineStyle, fontSize: 196, lineHeight: 1.1 }}>
        <MaskedWord progress={enter(frame, fps, 0.15, 0.7)}>Matheus</MaskedWord>
        <MaskedWord progress={enter(frame, fps, 0.25, 0.7)}>Chiodi</MaskedWord>
      </h1>
    </AbsoluteFill>
  );
};

const JOURNEY_YEARS = ["2021", "2025", "2026"];

type YearSceneProps = {
  // Índice em JOURNEY_YEARS
  step: number;
  company: string;
  role: string;
  badge?: string;
};

export const YearScene: React.FC<YearSceneProps> = ({
  step,
  company,
  role,
  badge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lastStep = JOURNEY_YEARS.length - 1;
  const fill = interpolate(
    enter(frame, fps, 0.1, 0.8),
    [0, 1],
    [Math.max(step - 1, 0) / lastStep, step / lastStep],
  );

  return (
    <AbsoluteFill
      style={{ ...sceneStyle, alignItems: "flex-start", textAlign: "left" }}
    >
      <div
        style={{
          ...eyebrowStyle,
          ...rise(enter(frame, fps, 0)),
          color: colors.slate600,
        }}
      >
        {company}
      </div>
      <div style={{ ...headlineStyle, fontSize: 340, lineHeight: 1.1 }}>
        <MaskedWord progress={enter(frame, fps, 0.1, 0.6)}>
          {JOURNEY_YEARS[step]}
        </MaskedWord>
      </div>
      <div
        style={{
          ...rise(enter(frame, fps, 0.3)),
          fontSize: 64,
          lineHeight: 1.25,
          fontWeight: 600,
          color: colors.slate800,
        }}
      >
        {role}
      </div>
      {badge ? (
        <div
          style={{
            ...rise(enter(frame, fps, 0.5)),
            marginTop: 40,
            padding: "18px 40px",
            borderRadius: 9999,
            backgroundColor: colors.emerald50,
            border: `2px solid ${colors.emerald200}`,
            fontSize: 40,
            fontWeight: 600,
            color: colors.emerald700,
          }}
        >
          {badge}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: SAFE.x,
          right: SAFE.x,
          bottom: SAFE.y + 80,
          height: 6,
          borderRadius: 9999,
          backgroundColor: colors.slate300,
        }}
      >
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            borderRadius: 9999,
            backgroundColor: colors.slate900,
          }}
        />
        {JOURNEY_YEARS.map((year, i) => {
          const reached = fill >= i / lastStep - 0.001;
          return (
            <div
              key={year}
              style={{
                position: "absolute",
                top: -15,
                left: `${(i / lastStep) * 100}%`,
                width: 36,
                height: 36,
                marginLeft: -18,
                borderRadius: "50%",
                backgroundColor: reached ? colors.slate900 : colors.paper,
                border: `6px solid ${reached ? colors.slate900 : colors.slate300}`,
                boxSizing: "border-box",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TECHNOLOGIES = [
  "Java",
  "Spring Boot",
  "Node.js",
  "React.js",
  "Oracle",
  "React Native",
  "TypeScript",
  "PL/SQL",
];

export const StackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ ...sceneStyle, gap: 56 }}>
      <div
        style={{
          ...eyebrowStyle,
          ...rise(enter(frame, fps, 0)),
          color: colors.slate600,
        }}
      >
        Tecnologias
      </div>
      <h2
        style={{
          ...headlineStyle,
          ...rise(enter(frame, fps, 0.05)),
          fontSize: 112,
          lineHeight: 1.15,
        }}
      >
        No dia a dia
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {TECHNOLOGIES.map((tech, i) => (
          <span
            key={tech}
            style={{
              ...rise(enter(frame, fps, 0.15 + i * 0.05, 0.4), 60),
              padding: "24px 48px",
              borderRadius: 9999,
              backgroundColor: "rgba(255,255,255,0.7)",
              border: `2px solid ${colors.slate300}`,
              boxShadow: shadows.pill,
              fontSize: 48,
              fontWeight: 500,
              color: colors.slate700,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

type ProjectSceneProps = {
  category: string;
  title: string;
  highlight: string;
  stack: string[];
};

export const ProjectScene: React.FC<ProjectSceneProps> = ({
  category,
  title,
  highlight,
  stack,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = enter(frame, fps, 0, 0.6);

  return (
    <AbsoluteFill style={sceneStyle}>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 72,
          borderRadius: 72,
          backgroundColor: "rgba(255,255,255,0.75)",
          border: "2px solid rgba(255,255,255,0.6)",
          boxShadow: shadows.card,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 40,
          opacity: card,
          transform: `translateY(${interpolate(card, [0, 1], [80, 0])}px) scale(${interpolate(card, [0, 1], [0.96, 1])})`,
        }}
      >
        <div
          style={{
            ...eyebrowStyle,
            ...rise(enter(frame, fps, 0.15)),
            color: colors.slate600,
          }}
        >
          {category}
        </div>
        <h2
          style={{
            ...headlineStyle,
            ...rise(enter(frame, fps, 0.2)),
            fontSize: 76,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h2>
        <p style={{ ...supportStyle, ...rise(enter(frame, fps, 0.3)) }}>
          {highlight}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {stack.map((tech, i) => (
            <span
              key={tech}
              style={{
                ...rise(enter(frame, fps, 0.4 + i * 0.05, 0.4)),
                padding: "14px 32px",
                borderRadius: 9999,
                border: `2px solid ${colors.slate300}`,
                fontSize: 36,
                fontWeight: 500,
                color: colors.slate600,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const statCardStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "56px 72px",
  borderRadius: 72,
  textAlign: "left",
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const projects = Math.round(
    interpolate(enter(frame, fps, 0.1, 0.8), [0, 1], [0, 30]),
  );
  const years = Math.round(
    interpolate(enter(frame, fps, 0.25, 0.8), [0, 1], [0, 5]),
  );

  return (
    <AbsoluteFill style={{ ...sceneStyle, gap: 40 }}>
      <div
        style={{
          ...statCardStyle,
          ...rise(enter(frame, fps, 0), 60),
          backgroundColor: colors.mintWash,
          border: `2px solid ${colors.glowMint}99`,
        }}
      >
        <div
          style={{ ...headlineStyle, fontSize: 200, color: colors.mintInk }}
        >
          {projects}+
        </div>
        <p style={supportStyle}>produtos e experiências entregues</p>
      </div>
      <div
        style={{
          ...statCardStyle,
          ...rise(enter(frame, fps, 0.15), 60),
          backgroundColor: colors.periwinkleWash,
          border: `2px solid ${colors.glowPeriwinkle}99`,
        }}
      >
        <div
          style={{
            ...headlineStyle,
            fontSize: 200,
            color: colors.periwinkleInk,
          }}
        >
          {years} anos
        </div>
        <p style={supportStyle}>
          construindo e sustentando software em produção
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = enter(frame, fps, 0, 0.6);

  return (
    <AbsoluteFill style={{ ...sceneStyle, gap: 48 }}>
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 300,
          opacity: logo,
          transform: `scale(${interpolate(logo, [0, 1], [0.8, 1])})`,
        }}
      />
      <h2
        style={{
          ...headlineStyle,
          ...rise(enter(frame, fps, 0.15)),
          fontSize: 132,
          lineHeight: 1.15,
        }}
      >
        mchiodi.com
      </h2>
      <p style={{ ...supportStyle, ...rise(enter(frame, fps, 0.25)) }}>
        Projetos, experiência e ferramentas open source.
      </p>
      <div
        style={{
          ...rise(enter(frame, fps, 0.4)),
          marginTop: 24,
          padding: "34px 84px",
          borderRadius: 9999,
          backgroundColor: colors.slate900,
          boxShadow: shadows.cta,
          fontSize: 50,
          fontWeight: 600,
          color: colors.white,
        }}
      >
        Ver projetos
      </div>
    </AbsoluteFill>
  );
};
