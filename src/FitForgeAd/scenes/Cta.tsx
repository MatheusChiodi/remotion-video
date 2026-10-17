import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enter } from "../../theme";
import { AppIcon } from "../components/AppIcon";
import { PunchTitle } from "../components/PunchTitle";
import { StoreBadge, StoreButton } from "../components/StoreCta";
import { copy, palette } from "../fitforge";
import { fonts, punch, useLayout } from "../theme";

const ICON = { vertical: 320, square: 220, wide: 210 };
const NAME = { vertical: 190, square: 140, wide: 140 };
const BUTTON = { vertical: 76, square: 64, wide: 66 };
const BADGE = { vertical: 40, square: 34, wide: 34 };
const FOOTER = { vertical: 36, square: 30, wide: 30 };

// Tudo assenta até ~1,5s; o restante da cena fica parado
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { format, safe } = useLayout();

  const icon = punch(frame, fps, 0);
  const button = punch(frame, fps, 14);
  const badge = enter(frame, fps, 24 / fps, 0.3);
  const footer = enter(frame, fps, 30 / fps, 0.3);

  return (
    <AbsoluteFill
      style={{
        padding: `${safe.y}px ${safe.x}px`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      <div
        style={{
          opacity: Math.min(1, icon * 2),
          transform: `scale(${interpolate(icon, [0, 1], [0.6, 1])})`,
        }}
      >
        <AppIcon size={ICON[format]} />
      </div>
      <PunchTitle
        line={{ text: copy.cta.name }}
        size={NAME[format]}
        delay={6}
        uppercase={false}
      />
      <div
        style={{
          marginTop: 10,
          opacity: Math.min(1, button * 2),
          transform: `scale(${interpolate(button, [0, 1], [0.7, 1])})`,
        }}
      >
        <StoreButton size={BUTTON[format]} />
      </div>
      <div style={{ opacity: badge }}>
        <StoreBadge size={BADGE[format]} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: safe.y,
          textAlign: "center",
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: FOOTER[format],
          letterSpacing: "0.08em",
          color: palette.textDim,
          opacity: footer * 0.8,
        }}
      >
        {copy.cta.footer}
      </div>
    </AbsoluteFill>
  );
};
