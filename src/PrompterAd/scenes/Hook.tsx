import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Label } from "../components";
import { colors, enter, fonts, rise } from "../prompter";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - 40,
    fps,
    config: { damping: 11, stiffness: 170 },
  });

  const line: React.CSSProperties = {
    fontFamily: fonts.display,
    fontWeight: 900,
    fontSize: 118,
    lineHeight: 0.95,
    textTransform: "uppercase",
    color: colors.chalk,
  };

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px" }}>
      <div style={rise(enter(frame, 0))}>
        <Label>Você grava vídeo tech em PT-BR?</Label>
      </div>
      <div style={{ ...line, marginTop: 40, ...rise(enter(frame, 8)) }}>
        Seu teleprompter
      </div>
      <div style={{ ...line, ...rise(enter(frame, 18)) }}>por voz trava</div>
      <div style={{ ...line, color: colors.chalkDim, ...rise(enter(frame, 28)) }}>
        quando você diz
      </div>
      <div
        style={{
          ...line,
          fontSize: 240,
          marginTop: 20,
          color: colors.tally,
          opacity: pop,
          transform: `scale(${0.6 + pop * 0.4})`,
          transformOrigin: "left center",
        }}
      >
        “deploy”
      </div>
    </AbsoluteFill>
  );
};
