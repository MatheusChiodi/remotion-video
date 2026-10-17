import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./theme";

const GLOW_SIZE = 900;

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = Math.sin((frame / fps) * 0.6) * 60;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.paper }}>
      <div
        style={{
          position: "absolute",
          top: -260 + drift,
          left: -300,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${colors.glowMint}cc, ${colors.glowCyan}66, transparent)`,
          filter: "blur(140px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -260 - drift,
          right: -300,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          borderRadius: "50%",
          background: `linear-gradient(315deg, ${colors.glowPeriwinkle}b3, ${colors.glowPeach}66, transparent)`,
          filter: "blur(140px)",
        }}
      />
    </AbsoluteFill>
  );
};
