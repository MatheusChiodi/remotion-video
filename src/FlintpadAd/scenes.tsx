import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { copy, palette, scenes, tabs } from "./flintpad";
import {
  Accent,
  Center,
  CLAMP,
  FlintMark,
  fonts,
  Key,
  pop,
  rise,
  Title,
  Tone,
  typed,
  Window,
} from "./components";

// Posições espalhadas das ferramentas no gancho (caos de apps abertos)
const SCATTER = [
  { x: 120, y: 170, r: -8 },
  { x: 700, y: 140, r: 6 },
  { x: 60, y: 1040, r: 5 },
  { x: 760, y: 1080, r: -7 },
  { x: 420, y: 90, r: -3 },
  { x: 380, y: 1150, r: 4 },
  { x: 600, y: 330, r: 9 },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lead = pop(frame, fps, 6);
  const punch = pop(frame, fps, 34);
  return (
    <AbsoluteFill>
      {tabs.map((tab, i) => {
        const p = pop(frame, fps, 2 + i * 5);
        const s = SCATTER[i];
        const bob = Math.sin((frame + i * 20) / 12) * 8;
        return (
          <div
            key={tab.name}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y + bob,
              padding: "18px 28px",
              borderRadius: 16,
              background: palette.panel,
              border: `1.5px solid ${palette[tab.tone as Tone]}66`,
              color: palette[tab.tone as Tone],
              fontSize: 34,
              fontWeight: 700,
              opacity: p * 0.9,
              transform: `scale(${p}) rotate(${s.r}deg)`,
              boxShadow: "0 20px 50px #0009",
            }}
          >
            {tab.name}
          </div>
        );
      })}
      <Center gap={34}>
        <div style={{ fontSize: 44, color: palette.text, ...rise(lead) }}>{copy.hook.lead}</div>
        <Title size={104} style={rise(punch, 60)}>
          quantos <Accent tone="caution">apps</Accent> você abre?
        </Title>
      </Center>
    </AbsoluteFill>
  );
};

export const Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = pop(frame, fps, 62);
  const dim = interpolate(frame, [58, 72], [1, 0.35], CLAMP);
  return (
    <Center gap={26}>
      {copy.pain.clouds.map((label, i) => {
        const p = pop(frame, fps, 4 + i * 11);
        const strike = interpolate(frame, [20 + i * 11, 34 + i * 11], [0, 100], CLAMP);
        return (
          <div
            key={label}
            style={{
              ...rise(p, 30),
              opacity: p * dim,
              width: 820,
              padding: "24px 34px",
              borderRadius: 18,
              background: palette.panel,
              border: `1.5px solid ${palette.border}`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 42,
              fontWeight: 500,
              color: palette.text,
              position: "relative",
            }}
          >
            <span style={{ fontFamily: fonts.mono, color: palette.danger, fontWeight: 700 }}>☁</span>
            {label}
            <div
              style={{
                position: "absolute",
                left: 30,
                top: "50%",
                height: 4,
                width: `${strike * 0.88}%`,
                background: palette.danger,
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}
      <Title size={74} style={{ ...rise(punch, 50), marginTop: 30 }}>
        Seus arquivos, na <Accent tone="danger">nuvem dos outros</Accent>.
      </Title>
    </Center>
  );
};

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const name = pop(frame, fps, 30);
  const tag = pop(frame, fps, 52);
  const glow = interpolate(frame, [26, 40, 90], [0, 1, 0.5], CLAMP);
  return (
    <Center gap={30}>
      <FlintMark size={330} progress={(i) => pop(frame, fps, 2 + i * 2.5)} glow={glow} />
      <Title
        size={170}
        style={{ letterSpacing: -6, opacity: name, transform: `scale(${0.8 + name * 0.2})` }}
      >
        {copy.reveal.name}
      </Title>
      <div
        style={{
          fontSize: 46,
          fontWeight: 500,
          color: palette.text,
          textAlign: "center",
          maxWidth: 880,
          lineHeight: 1.25,
          ...rise(tag),
        }}
      >
        {copy.reveal.tagline}
      </div>
    </Center>
  );
};

const TAB_START = 18;
const TAB_FRAMES = Math.floor((scenes.tabs - TAB_START - 20) / tabs.length);

export const Tabs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, 0);
  const active = Math.min(tabs.length - 1, Math.max(0, Math.floor((frame - TAB_START) / TAB_FRAMES)));
  const local = frame - TAB_START - active * TAB_FRAMES;
  const caption = pop(local, fps, 4);

  return (
    <Center gap={44}>
      <Title size={72} style={rise(enter, 40)}>
        Sete ferramentas. <Accent>Uma pasta.</Accent>
      </Title>
      <Window title="Flintpad — meu-vault" style={rise(enter, 80)}>
        <div style={{ display: "flex", background: palette.chrome, borderTop: `1px solid ${palette.border}` }}>
          {tabs.map((tab, i) => {
            const on = i === active;
            return (
              <div
                key={tab.name}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  textAlign: "center",
                  fontSize: 21,
                  fontWeight: on ? 700 : 500,
                  color: on ? palette.bright : palette.dim,
                  background: on ? palette.panel : "transparent",
                  borderBottom: `3px solid ${on ? palette[tab.tone as Tone] : "transparent"}`,
                }}
              >
                {tab.name}
              </div>
            );
          })}
        </div>
        <div style={{ position: "relative", width: 960, height: 540 }}>
          {tabs.map((tab, i) => {
            const t = frame - TAB_START - i * TAB_FRAMES;
            const opacity = interpolate(t, [-8, 0, TAB_FRAMES - 4, TAB_FRAMES + 4], [0, 1, 1, i === tabs.length - 1 ? 1 : 0], CLAMP);
            if (opacity === 0) return null;
            return (
              <Img
                key={tab.name}
                src={staticFile(tab.shot)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: 960,
                  height: 540,
                  opacity,
                  transform: `scale(${1.04 - interpolate(t, [0, TAB_FRAMES], [0, 0.04], CLAMP)})`,
                }}
              />
            );
          })}
        </div>
      </Window>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: palette[tabs[active].tone as Tone],
          ...rise(caption, 24),
        }}
      >
        {tabs[active].caption}
      </div>
    </Center>
  );
};

export const Local: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = pop(frame, fps, 0);
  const win = pop(frame, fps, 8);
  const foot = pop(frame, fps, 120);
  return (
    <Center gap={40}>
      <Title size={84} style={rise(title, 40)}>
        Tudo é <Accent>arquivo comum</Accent>.
      </Title>
      <Window title="explorer — C:\Users\voce\vault" style={{ ...rise(win, 60), width: 900 }}>
        <div style={{ padding: "26px 34px 30px", fontFamily: fonts.mono, fontSize: 32, lineHeight: 1.6 }}>
          {copy.local.files.map((file, i) => (
            <div key={file.path} style={{ color: palette[file.tone as Tone], whiteSpace: "pre", minHeight: "1.6em" }}>
              {typed(file.path, frame, 16 + i * 12, 2.4)}
            </div>
          ))}
        </div>
      </Window>
      <div style={{ display: "flex", gap: 20 }}>
        {copy.local.badges.map((badge, i) => {
          const p = pop(frame, fps, 80 + i * 10);
          return (
            <div
              key={badge}
              style={{
                padding: "16px 28px",
                borderRadius: 99,
                fontSize: 34,
                fontWeight: 700,
                color: palette.sheenLight,
                background: `${palette.sheen}1f`,
                border: `1.5px solid ${palette.sheen}88`,
                opacity: p,
                transform: `scale(${0.6 + p * 0.4})`,
              }}
            >
              ✓ {badge}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 36, color: palette.text, ...rise(foot, 20) }}>{copy.local.footnote}</div>
    </Center>
  );
};

export const Keys: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = pop(frame, fps, 0);
  const foot = pop(frame, fps, 80);
  return (
    <Center gap={34}>
      <Title size={92} style={{ ...rise(title, 40), marginBottom: 20 }}>
        <Accent>Teclado</Accent> primeiro.
      </Title>
      {copy.keys.shortcuts.map((s, i) => {
        const p = pop(frame, fps, 10 + i * 12);
        const press = interpolate(frame, [18 + i * 12, 22 + i * 12, 34 + i * 12], [0, 1, 0], CLAMP);
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14, width: 820, ...rise(p, 30) }}>
            {s.keys.map((k, j) => (
              <div key={k + j} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {j > 0 ? <span style={{ fontSize: 30, color: palette.dim }}>+</span> : null}
                <Key lit={press}>{k}</Key>
              </div>
            ))}
            <div style={{ marginLeft: "auto", fontSize: 38, fontWeight: 500, color: palette.text }}>{s.label}</div>
          </div>
        );
      })}
      <div style={{ fontSize: 36, color: palette.dim, marginTop: 20, ...rise(foot, 20) }}>
        {copy.keys.footnote}
      </div>
    </Center>
  );
};

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = pop(frame, fps, 14);
  const link = pop(frame, fps, 34);
  const foot = pop(frame, fps, 54);
  const breathe = 1 + Math.sin(frame / 18) * 0.015;
  return (
    <Center gap={36}>
      <div style={{ transform: `scale(${breathe})` }}>
        <FlintMark size={240} progress={(i) => pop(frame, fps, i * 1.5)} glow={0.6} />
      </div>
      <Title size={120} style={rise(title, 50)}>
        Baixe <Accent>grátis</Accent>.
      </Title>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 38,
          fontWeight: 700,
          color: palette.bright,
          padding: "22px 36px",
          borderRadius: 18,
          background: palette.panel,
          border: `1.5px solid ${palette.sheen}`,
          boxShadow: `0 0 50px ${palette.sheen}33`,
          ...rise(link, 30),
        }}
      >
        {copy.cta.link}
      </div>
      <div style={{ textAlign: "center", ...rise(foot, 20) }}>
        <div style={{ fontSize: 34, color: palette.text }}>{copy.cta.footnote}</div>
        <div style={{ fontSize: 30, color: palette.dim, marginTop: 14 }}>{copy.cta.author}</div>
      </div>
    </Center>
  );
};
