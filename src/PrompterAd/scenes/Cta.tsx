import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Label, Stripes } from "../components";
import { colors, enter, fonts, REPO_URL, rise, stack } from "../prompter";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 30, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}
    >
      <Stripes
        style={{
          width: 460,
          height: 26,
          transform: `scaleX(${enter(frame, 0, 18)})`,
        }}
      />
      <div
        style={{
          marginTop: 44,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 170,
          lineHeight: 0.88,
          textTransform: "uppercase",
          color: colors.chalk,
          ...rise(enter(frame, 4)),
        }}
      >
        Prompter
        <br />
        MChiodi
      </div>
      <div
        style={{
          marginTop: 26,
          fontFamily: fonts.read,
          fontWeight: 700,
          fontSize: 50,
          color: colors.chalk,
          ...rise(enter(frame, 14)),
        }}
      >
        Você lê. <span style={{ color: colors.tally }}>Ele rola.</span>
      </div>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "22px 30px",
          background: colors.chalk,
          color: colors.coal,
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: 32,
          opacity: pop,
          transform: `scale(${0.85 + pop * 0.15})`,
        }}
      >
        <span style={{ color: colors.tally }}>★</span>
        {REPO_URL}
      </div>
      <div style={{ marginTop: 20, ...rise(enter(frame, 40)) }}>
        <Label>Open source · Link nos comentários</Label>
      </div>

      <div
        style={{
          marginTop: 56,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 14,
        }}
      >
        {stack.map((s, i) => (
          <span
            key={s}
            style={{
              fontFamily: fonts.mono,
              fontSize: 24,
              padding: "8px 16px",
              border: `2px solid ${colors.line}`,
              color: colors.chalkDim,
              ...rise(enter(frame, 52 + i * 5), 16),
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
