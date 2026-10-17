import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enter } from "../../theme";
import { AppIcon } from "../components/AppIcon";
import { EmberDot } from "../components/Embers";
import { PunchTitle } from "../components/PunchTitle";
import { copy, palette } from "../fitforge";
import { CLAMP, fonts, punch, useLayout } from "../theme";

const SPARK_COUNT = 46;
const CONVERGE_FRAMES = 16;
const FORGE_FRAME = 18;
const COOL_FRAMES = 38;
const NAME_DELAY = 30;

const ICON = { vertical: 380, square: 290, wide: 290 };
const NAME = { vertical: 210, square: 160, wide: 170 };
const TAGLINE = { vertical: 52, square: 44, wide: 48 };

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { format, width, height, safe } = useLayout();
  const iconSize = ICON[format];

  const pop = punch(frame, fps, FORGE_FRAME);
  const heat = interpolate(
    frame,
    [FORGE_FRAME + 2, FORGE_FRAME + COOL_FRAMES],
    [1, 0],
    { ...CLAMP, easing: Easing.out(Easing.quad) },
  );
  const flash = interpolate(
    frame,
    [FORGE_FRAME - 2, FORGE_FRAME + 2, FORGE_FRAME + 16],
    [0, 0.95, 0],
    CLAMP,
  );
  const tagline = enter(frame, fps, (NAME_DELAY + 10) / fps, 0.35);

  return (
    <AbsoluteFill
      style={{
        padding: `${safe.y}px ${safe.x}px`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <div style={{ position: "relative", width: iconSize, height: iconSize }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
          }}
        >
          {new Array(SPARK_COUNT).fill(0).map((_, i) => {
            const delay = random(`converge-d-${i}`) * 5;
            const t = interpolate(
              frame,
              [delay, delay + CONVERGE_FRAMES],
              [0, 1],
              { ...CLAMP, easing: Easing.in(Easing.cubic) },
            );
            if (t >= 1) {
              return null;
            }
            const startX = (random(`converge-x-${i}`) - 0.5) * width;
            const startY = (random(`converge-y-${i}`) - 0.5) * height;
            return (
              <EmberDot
                key={i}
                x={startX * (1 - t)}
                y={startY * (1 - t)}
                size={12 - t * 5}
                opacity={0.4 + t * 0.6}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: -iconSize * 1.3,
              top: -iconSize * 1.3,
              width: iconSize * 2.6,
              height: iconSize * 2.6,
              borderRadius: "50%",
              background: `radial-gradient(circle, #fff6d6 0%, ${palette.emberHot} 22%, ${palette.ember} 42%, transparent 70%)`,
              opacity: flash,
              transform: `scale(${interpolate(frame, [FORGE_FRAME - 2, FORGE_FRAME + 16], [0.2, 1.3], CLAMP)})`,
            }}
          />
        </div>
        <div
          style={{
            opacity: interpolate(
              frame,
              [FORGE_FRAME, FORGE_FRAME + 3],
              [0, 1],
              CLAMP,
            ),
            transform: `scale(${interpolate(pop, [0, 1], [0.4, 1])})`,
          }}
        >
          <AppIcon size={iconSize} heat={heat} />
        </div>
      </div>
      <PunchTitle
        line={{ text: copy.reveal.name }}
        size={NAME[format]}
        delay={NAME_DELAY}
        uppercase={false}
      />
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: TAGLINE[format],
          color: palette.primary,
          textAlign: "center",
          opacity: tagline,
          transform: `translateY(${interpolate(tagline, [0, 1], [24, 0])}px)`,
        }}
      >
        {copy.reveal.tagline}
      </div>
    </AbsoluteFill>
  );
};
