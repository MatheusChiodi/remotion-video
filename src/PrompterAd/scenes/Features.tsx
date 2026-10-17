import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cue, Label } from "../components";
import { colors, enter, features, fonts, rise } from "../prompter";

const STAGGER = 22;

export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px" }}>
      <div style={rise(enter(frame, 0))}>
        <Label>Feito pra quem grava</Label>
      </div>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 26 }}>
        {features.map((f, i) => {
          const p = enter(frame, 8 + i * STAGGER, 16);
          return (
            <div
              key={f.title}
              style={{
                display: "flex",
                background: colors.coal2,
                border: `2px solid ${colors.line}`,
                opacity: p,
                transform: `translateX(${(1 - p) * -60}px)`,
              }}
            >
              <div style={{ width: 14, background: f.color }} />
              <div style={{ padding: "30px 36px" }}>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: 64,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: colors.chalk,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: fonts.read,
                    fontSize: 32,
                    lineHeight: 1.3,
                    color: colors.chalkDim,
                  }}
                >
                  {f.detail}
                </div>
                {i === 2 ? (
                  <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <Cue kind="cut" label="CORTE" size={22} />
                    <Cue kind="broll" label="B-ROLL" size={22} />
                    <Cue kind="pause" label="PAUSA" size={22} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
