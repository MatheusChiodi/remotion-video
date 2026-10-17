import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Label } from "../components";
import { CLAMP, colors, enter, fonts, rise } from "../prompter";

const ROWS = [
  { said: "deploy", heard: "deploi", at: 14 },
  { said: "React", heard: "riact", at: 34 },
  { said: "Kubernetes", heard: "cubernetis", at: 54 },
];

const FRAMES_PER_CHAR = 2;

const Row: React.FC<{ said: string; heard: string; at: number }> = ({
  said,
  heard,
  at,
}) => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.floor((frame - at) / FRAMES_PER_CHAR));
  const doneAt = at + heard.length * FRAMES_PER_CHAR + 4;
  const fail = enter(frame, doneAt, 8);
  const strike = interpolate(frame, [doneAt, doneAt + 8], [0, 100], CLAMP);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "34px 0",
        borderBottom: `2px solid ${colors.line}`,
        opacity: frame >= at ? 1 : 0,
      }}
    >
      <div>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: fonts.mono,
            fontSize: 88,
            color: colors.chalk,
          }}
        >
          {heard.slice(0, typed)}
          {typed < heard.length ? <span>▍</span> : null}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "54%",
              height: 6,
              width: `${strike}%`,
              background: colors.tally,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 26,
            color: colors.chalkDim,
            marginTop: 6,
            letterSpacing: "0.06em",
          }}
        >
          você disse: <span style={{ color: colors.chalk }}>{said}</span>
        </div>
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: colors.tally,
          border: `3px solid ${colors.tally}`,
          padding: "10px 18px",
          opacity: fail,
          transform: `scale(${1.4 - fail * 0.4})`,
        }}
      >
        SEM MATCH
      </div>
    </div>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px" }}>
      <div style={rise(enter(frame, 0))}>
        <Label>O reconhecimento de voz escreve</Label>
      </div>
      <div style={{ marginTop: 24 }}>
        {ROWS.map((row) => (
          <Row key={row.heard} {...row} />
        ))}
      </div>
      <div
        style={{
          marginTop: 56,
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1,
          textTransform: "uppercase",
          color: colors.chalk,
          ...rise(enter(frame, 86)),
        }}
      >
        …e o texto <span style={{ color: colors.tally }}>para de rolar.</span>
      </div>
    </AbsoluteFill>
  );
};
