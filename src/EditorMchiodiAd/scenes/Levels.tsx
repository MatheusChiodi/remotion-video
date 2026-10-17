import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts } from "../theme";
import { Paper, Phrase, Rise } from "../ui";

// marcas por "minuto" na faixa: só ilustra a densidade relativa de cada nível
const LEVELS = [
  { name: "limpa", desc: "cortes, legendas, áudio e cor", ticks: 2 },
  { name: "normal", desc: "o padrão do canal", ticks: 6 },
  { name: "pro", desc: "apoio visual constante", ticks: 12 },
  { name: "max", desc: "algo novo a cada 2–4 s", ticks: 26 },
];

export const Levels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Paper>
      <Phrase
        delay={0}
        size={92}
        parts={[{ text: "Você escolhe a" }, { text: "intensidade.", accent: true }]}
      />
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 40 }}>
        {LEVELS.map((level, li) => {
          const delay = 0.6 + li * 0.35;
          const isMax = level.name === "max";
          return (
            <Rise key={level.name} delay={delay}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 36,
                    fontWeight: 700,
                    color: isMax ? colors.coral : colors.ink,
                    width: 150,
                  }}
                >
                  {level.name}
                </div>
                <div style={{ fontSize: 28, color: colors.slate600 }}>{level.desc}</div>
              </div>
              <div
                style={{
                  position: "relative",
                  marginTop: 14,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isMax ? colors.coralWash : "rgba(17,24,39,0.05)",
                }}
              >
                {new Array(level.ticks).fill(0).map((_, i) => {
                  const p = enter(frame, fps, delay + 0.2 + i * 0.025, 0.3);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${((i + 0.5) / level.ticks) * 100}%`,
                        top: 8,
                        width: 10,
                        height: 28,
                        marginLeft: -5,
                        borderRadius: 5,
                        backgroundColor: isMax ? colors.coral : colors.ink,
                        transform: `scaleY(${p})`,
                      }}
                    />
                  );
                })}
              </div>
            </Rise>
          );
        })}
      </div>
      <Rise delay={2.4} style={{ marginTop: 52 }}>
        <div style={{ fontSize: 36, lineHeight: 1.4, color: colors.slate600 }}>
          O nível muda a quantidade, não o gosto. E a autoavaliação cobra o
          mínimo e o máximo.
        </div>
      </Rise>
    </Paper>
  );
};
