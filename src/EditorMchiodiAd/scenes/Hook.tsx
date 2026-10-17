import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts } from "../theme";
import { Paper, Phrase, Rise } from "../ui";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const underline = enter(frame, fps, 2.3, 0.6);
  const recOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <Paper>
      <Rise delay={0}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontFamily: fonts.mono,
            fontSize: 26,
            color: colors.slate600,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.coral,
              opacity: recOn ? 1 : 0.25,
            }}
          />
          REC · gravacao-bruta.mp4
        </div>
      </Rise>
      <div style={{ marginTop: 56 }}>
        <Phrase delay={0.25} size={98} parts={[{ text: "Eu gravo o vídeo." }]} />
        <Phrase delay={1.2} size={98} parts={[{ text: "O Claude Code" }]} />
        <Phrase
          delay={1.7}
          size={98}
          parts={[{ text: "edita o resto.", accent: true }]}
        />
        <div
          style={{
            width: 480 * underline,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.coral,
            opacity: 0.85,
            marginTop: 4,
          }}
        />
      </div>
      <Rise delay={2.8} style={{ marginTop: 64 }}>
        <div style={{ fontSize: 38, lineHeight: 1.4, color: colors.slate600 }}>
          Cortes, legendas, motion graphics, Short vertical, capas, título e
          capítulos. De ponta a ponta.
        </div>
      </Rise>
    </Paper>
  );
};
