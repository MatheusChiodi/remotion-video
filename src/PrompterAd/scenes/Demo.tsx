import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cue, Label, TallyDot } from "../components";
import { colors, demoScript, enter, fonts, rise, timing } from "../prompter";

const words = demoScript.flatMap((t) => ("word" in t ? [t] : []));

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const elapsed = frame - timing.demoStart;
  const current = Math.min(
    words.length,
    Math.floor(elapsed / timing.framesPerWord),
  );
  const local = elapsed - current * timing.framesPerWord;
  const active = current >= 0 && current < words.length ? words[current] : null;
  const heardIn = enter(local, 0, 5);

  let wordIndex = -1;

  return (
    <AbsoluteFill style={{ padding: "130px 70px 90px", ...rise(enter(frame, 0, 10), 30) }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 26,
          borderBottom: `2px solid ${colors.line}`,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: fonts.mono,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.16em",
            color: colors.chalk,
          }}
        >
          <TallyDot /> NO AR
        </span>
        <Label>Seguindo sua voz</Label>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: fonts.mono,
          fontSize: 28,
          color: colors.chalkDim,
        }}
      >
        # Deploy de React no Kubernetes
        <span
          style={{
            border: `2px solid ${colors.line}`,
            padding: "2px 10px",
            fontSize: 22,
          }}
        >
          ~0:42
        </span>
      </div>

      <div
        style={{
          marginTop: 34,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          columnGap: 22,
          rowGap: 14,
          fontFamily: fonts.read,
          fontSize: 76,
          lineHeight: 1.18,
        }}
      >
        {demoScript.map((token, i) => {
          if ("cue" in token) {
            return <Cue key={i} kind={token.kind} label={token.cue} size={28} />;
          }
          wordIndex += 1;
          const isPast = wordIndex < current;
          const isCurrent = wordIndex === current;
          return (
            <span
              key={i}
              style={{
                color: isCurrent ? colors.coal : isPast ? colors.past : colors.chalk,
                background: isCurrent ? colors.chalk : "transparent",
                boxShadow: isCurrent ? `0 0 0 8px ${colors.chalk}` : "none",
                borderRadius: 6,
                fontFamily: token.word === "useEffect" ? fonts.mono : fonts.read,
              }}
            >
              {token.word}
            </span>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          border: `2px solid ${colors.line}`,
          background: colors.coal2,
          padding: "28px 34px",
          minHeight: 190,
        }}
      >
        <Label>Microfone ouviu</Label>
        {active ? (
          <div style={{ marginTop: 18, opacity: heardIn }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 24,
                fontFamily: fonts.mono,
                fontSize: 52,
              }}
            >
              <span style={{ color: active.heard ? colors.cyan : colors.chalk }}>
                {active.heard ?? active.word.toLowerCase().replace(/[^\p{L}]/gu, "")}
              </span>
              {active.heard ? (
                <>
                  <span style={{ color: colors.chalkDim }}>→</span>
                  <span style={{ color: colors.chalk }}>{active.word.replace(".", "")}</span>
                </>
              ) : null}
            </div>
            {active.how ? (
              <div
                style={{
                  marginTop: 12,
                  fontFamily: fonts.mono,
                  fontWeight: 600,
                  fontSize: 26,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.green,
                }}
              >
                ✓ match · {active.how}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
