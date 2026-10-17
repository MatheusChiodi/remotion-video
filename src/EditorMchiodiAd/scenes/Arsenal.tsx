import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts, shadow } from "../theme";
import { Paper, Phrase, Rise } from "../ui";

const STATS = [
  { n: 55, label: "componentes de vídeo" },
  { n: 50, label: "transições" },
  { n: 50, label: "efeitos de vídeo" },
  { n: 50, label: "entradas animadas" },
];

export const Arsenal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Paper>
      <Phrase
        delay={0}
        size={100}
        parts={[{ text: "Um arsenal" }, { text: "pronto.", accent: true }]}
      />
      <div
        style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {STATS.map((stat, i) => {
          const delay = 0.5 + i * 0.15;
          const count = Math.round(stat.n * enter(frame, fps, delay, 1.2));
          return (
            <Rise key={stat.label} delay={delay}>
              <div
                style={{
                  padding: "36px 36px 32px",
                  borderRadius: 24,
                  backgroundColor: i === 0 ? colors.ink : colors.white,
                  color: i === 0 ? colors.paper : colors.ink,
                  boxShadow: shadow.card,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 600,
                    fontSize: 150,
                    lineHeight: 1,
                    color: i === 0 ? colors.coral : colors.ink,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {count}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 30,
                    fontWeight: 600,
                    color: i === 0 ? colors.slate300 : colors.slate600,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </Rise>
          );
        })}
      </div>
      <Rise delay={1.8} style={{ marginTop: 48 }}>
        <div style={{ fontSize: 36, lineHeight: 1.4, color: colors.slate600 }}>
          Tudo no design system do canal: papel, tinta e um único coral. Regra
          da casa: arsenal primeiro, criar só quando falta.
        </div>
      </Rise>
    </Paper>
  );
};
