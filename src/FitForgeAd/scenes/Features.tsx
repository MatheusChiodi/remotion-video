import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enter } from "../../theme";
import { FeatureSlide } from "../components/FeatureSlide";
import { getPhoneSize, PhoneMockup } from "../components/PhoneMockup";
import { PunchTitle } from "../components/PunchTitle";
import { copy, Feature, palette, timing } from "../fitforge";
import { CLAMP, fonts, punch, useLayout } from "../theme";

const SLIDE_FRAMES = 10;
const CAPTION_HEIGHT = 400;
const TITLE = { vertical: 124, square: 96, wide: 140 };
const DETAIL = { vertical: 46, square: 40, wide: 48 };

const Progress: React.FC<{ index: number; local: number }> = ({
  index,
  local,
}) => (
  <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 420 }}>
    {copy.features.map((_, i) => {
      const fill =
        i < index
          ? 1
          : i === index
            ? interpolate(local, [0, timing.featureSlot], [0, 1], CLAMP)
            : 0;
      return (
        <div
          key={i}
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(255, 246, 236, 0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${fill * 100}%`,
              height: "100%",
              backgroundColor: palette.ember,
            }}
          />
        </div>
      );
    })}
  </div>
);

const Caption: React.FC<{ feature: Feature; centered: boolean }> = ({
  feature,
  centered,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { format } = useLayout();
  const detail = enter(frame, fps, 8 / fps, 0.3);

  return (
    <>
      <PunchTitle
        line={feature}
        size={TITLE[format]}
        delay={1}
        stagger={2}
        align={centered ? "center" : "left"}
      />
      {feature.detail ? (
        <div
          style={{
            marginTop: 14,
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: DETAIL[format],
            lineHeight: 1.25,
            color: palette.primary,
            textAlign: centered ? "center" : "left",
            opacity: detail,
            transform: `translateY(${interpolate(detail, [0, 1], [18, 0])}px)`,
          }}
        >
          {feature.detail}
        </div>
      ) : null}
    </>
  );
};

export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { format, width, height, safe } = useLayout();
  const slot = timing.featureSlot;
  const last = copy.features.length - 1;
  const vertical = format === "vertical";

  const index = Math.min(last, Math.floor(frame / slot));
  const local = frame - index * slot;
  const slide =
    index === 0
      ? 1
      : interpolate(local, [0, SLIDE_FRAMES], [0, 1], {
          ...CLAMP,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
  const position = index - 1 + slide;

  const innerH = height - safe.y * 2;
  const phoneHeight = vertical ? innerH - CAPTION_HEIGHT - 30 : innerH;
  const phone = getPhoneSize(phoneHeight);
  const gap = format === "wide" ? 120 : 50;
  const captionWidth = vertical
    ? width - safe.x * 2
    : Math.min(820, width - safe.x * 2 - phone.width - gap);

  const phoneIn = punch(frame, fps, 0);
  const float = Math.sin((frame / fps) * 1.6) * 8;
  const tilt = Math.sin((frame / fps) * 1.1) * 0.6;

  return (
    <AbsoluteFill
      style={{
        padding: `${safe.y}px ${safe.x}px`,
        flexDirection: vertical ? "column" : "row",
        alignItems: "center",
        justifyContent: vertical ? "space-between" : "center",
        gap,
      }}
    >
      <div
        style={{
          width: captionWidth,
          height: vertical ? CAPTION_HEIGHT : undefined,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: vertical ? "center" : "flex-start",
          gap: 26,
        }}
      >
        <Progress index={index} local={local} />
        <div style={{ width: "100%" }}>
          {copy.features.map((feature, i) => (
            <Sequence
              key={i}
              from={i * slot}
              durationInFrames={i === last ? slot + timing.fadeFrames : slot}
              layout="none"
            >
              <Caption feature={feature} centered={vertical} />
            </Sequence>
          ))}
        </div>
      </div>
      <div
        style={{
          opacity: Math.min(1, phoneIn * 2),
          transform: `translateY(${interpolate(phoneIn, [0, 1], [160, 0]) + float}px) rotate(${tilt}deg)`,
        }}
      >
        <PhoneMockup height={phoneHeight}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${-position * phone.screenWidth}px)`,
            }}
          >
            {copy.features.map((feature, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: i * phone.screenWidth,
                  width: phone.screenWidth,
                  height: phone.screenHeight,
                }}
              >
                <FeatureSlide feature={feature} />
              </div>
            ))}
          </div>
        </PhoneMockup>
      </div>
    </AbsoluteFill>
  );
};
