import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts, shadow } from "../theme";
import { Paper, Phrase, Rise } from "../ui";

const STEPS = ["analyze", "EDL", "render", "eval", "final"];

const VERSIONS = [
  { file: "edl.v1.json", note: "primeiro corte + legendas + gráficos" },
  { file: "edl.v2.json", note: "eval: pílula entrava antes da fala" },
  { file: "edl.v3.json", note: "eval: trecho parado de 11 s → cena nova" },
];

const LOOP_START = 1.2;
const ROUND = 1.1;

export const EdlLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // analyze → (EDL → render → eval) × 3 → final
  const loopT = (t - LOOP_START) / ROUND;
  const round = Math.min(VERSIONS.length, Math.max(0, Math.floor(loopT) + 1));
  const active =
    t < LOOP_START
      ? 0
      : loopT >= VERSIONS.length
        ? 4
        : 1 + Math.floor((loopT % 1) * 3);

  return (
    <Paper>
      <Phrase
        delay={0}
        size={92}
        parts={[{ text: "A EDL é a" }, { text: "única verdade.", accent: true }]}
      />

      <Rise delay={0.6} style={{ marginTop: 52 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {STEPS.map((step, i) => {
            const on = i === active;
            return (
              <div
                key={step}
                style={{
                  padding: "12px 24px",
                  borderRadius: 9999,
                  fontFamily: fonts.mono,
                  fontSize: 26,
                  fontWeight: 700,
                  backgroundColor: on ? colors.coral : colors.white,
                  color: on ? colors.white : colors.slate600,
                  border: on ? "none" : `2px solid ${colors.line}`,
                  boxShadow: on ? shadow.card : "none",
                  transform: `scale(${on ? 1.06 : 1})`,
                }}
              >
                {step}
              </div>
            );
          })}
          <div
            style={{
              marginLeft: "auto",
              alignSelf: "center",
              fontFamily: fonts.mono,
              fontSize: 26,
              color: colors.coral,
              fontWeight: 700,
              opacity: round > 0 ? 1 : 0,
            }}
          >
            ↺ rodada {round}/3
          </div>
        </div>
      </Rise>

      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
        {VERSIONS.map((v, i) => {
          const p = enter(frame, fps, LOOP_START + i * ROUND, 0.45);
          const latest = i === round - 1;
          return (
            <div
              key={v.file}
              style={{
                opacity: p * (latest ? 1 : 0.55),
                transform: `translateX(${(1 - p) * 80}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "24px 28px",
                borderRadius: 20,
                backgroundColor: colors.white,
                borderLeft: `8px solid ${latest ? colors.coral : colors.slate300}`,
                boxShadow: shadow.card,
              }}
            >
              <div style={{ fontFamily: fonts.mono, fontSize: 28, fontWeight: 700 }}>
                {v.file}
              </div>
              <div style={{ fontSize: 26, color: colors.slate600 }}>{v.note}</div>
            </div>
          );
        })}
      </div>

      <Rise delay={LOOP_START + VERSIONS.length * ROUND} style={{ marginTop: 48 }}>
        <div style={{ fontSize: 36, lineHeight: 1.4, color: colors.slate600 }}>
          Nada é editado “por fora”. Cada mudança vira uma nova versão, com o
          motivo. Ele se avalia e corrige até 3 vezes.
        </div>
      </Rise>
    </Paper>
  );
};
