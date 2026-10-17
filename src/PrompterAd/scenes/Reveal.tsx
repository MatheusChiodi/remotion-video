import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Stripes } from "../components";
import { CLAMP, colors, enter, fonts, rise } from "../prompter";

const CLAP_AT = 22;

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  // Haste abre, assenta e bate, como a claquete da tela inicial do app
  const angle =
    frame < CLAP_AT - 4
      ? interpolate(frame, [0, CLAP_AT - 4], [-24, -14], {
          ...CLAMP,
          easing: Easing.bezier(0.2, 0.9, 0.2, 1.15),
        })
      : interpolate(frame, [CLAP_AT - 4, CLAP_AT], [-14, 0], {
          ...CLAMP,
          easing: Easing.bezier(0.6, 0, 0.9, 0.4),
        });
  const flash = interpolate(frame, [CLAP_AT, CLAP_AT + 3, CLAP_AT + 14], [0, 0.85, 0], CLAMP);
  const shake = frame >= CLAP_AT && frame < CLAP_AT + 6 ? Math.sin(frame * 3) * 6 : 0;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: "0 90px" }}
    >
      <div
        style={{
          width: 760,
          opacity: enter(frame, 0, 10),
          transform: `translateY(${(1 - enter(frame, 0, 10)) * 60 + shake}px)`,
        }}
      >
        <div style={{ transformOrigin: "0% 100%", transform: `rotate(${angle}deg)` }}>
          <Stripes style={{ height: 76, borderRadius: "6px 6px 0 0" }} />
        </div>
        <Stripes style={{ height: 76, marginTop: 6 }} />
        <div
          style={{
            background: colors.coal2,
            border: `3px solid ${colors.line}`,
            padding: "28px 36px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            fontFamily: fonts.mono,
            fontSize: 24,
            letterSpacing: "0.12em",
            color: colors.chalkDim,
            gap: 8,
          }}
        >
          <span>PROD.</span>
          <span>CENA</span>
          <span>TAKE</span>
          <span style={{ color: colors.chalk, fontSize: 34 }}>PROMPTER</span>
          <span style={{ color: colors.chalk, fontSize: 34 }}>01</span>
          <span style={{ color: colors.chalk, fontSize: 34 }}>1</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 70,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 0.9,
          textTransform: "uppercase",
          color: colors.chalk,
          ...rise(enter(frame, CLAP_AT + 4)),
        }}
      >
        Prompter
        <br />
        MChiodi
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: fonts.read,
          fontWeight: 700,
          fontSize: 52,
          color: colors.chalk,
          ...rise(enter(frame, CLAP_AT + 16)),
        }}
      >
        Você lê. <span style={{ color: colors.tally }}>Ele rola.</span>
      </div>
      <AbsoluteFill style={{ background: colors.chalk, opacity: flash }} />
    </AbsoluteFill>
  );
};
