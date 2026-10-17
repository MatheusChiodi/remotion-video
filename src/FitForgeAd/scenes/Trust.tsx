import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enter } from "../../theme";
import { PunchTitle } from "../components/PunchTitle";
import { ShieldIcon } from "../components/ShieldIcon";
import { copy, palette } from "../fitforge";
import { CLAMP, fonts, punch, useLayout } from "../theme";

const SHIELD = { vertical: 300, square: 230, wide: 230 };
const TITLE = { vertical: 150, square: 128, wide: 140 };
const DETAIL = { vertical: 48, square: 44, wide: 46 };

export const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { format, safe } = useLayout();

  const draw = interpolate(frame, [0, 14], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const detail = enter(frame, fps, 18 / fps, 0.3);

  return (
    <AbsoluteFill
      style={{
        padding: `${safe.y}px ${safe.x}px`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <ShieldIcon
        size={SHIELD[format]}
        draw={draw}
        lock={punch(frame, fps, 6)}
      />
      <PunchTitle line={copy.trust} size={TITLE[format]} delay={8} />
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: DETAIL[format],
          color: palette.textDim,
          opacity: detail,
          transform: `translateY(${interpolate(detail, [0, 1], [18, 0])}px)`,
        }}
      >
        {copy.trust.detail}
      </div>
    </AbsoluteFill>
  );
};
