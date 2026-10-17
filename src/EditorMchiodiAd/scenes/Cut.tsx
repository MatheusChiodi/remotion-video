import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import { Paper, Phrase, Pill, Rise, Window } from "../ui";

// [início, fim] em fração da timeline
const TRACKS: { name: string; color: string; clips: [number, number][] }[] = [
  { name: "vídeo", color: colors.slate300, clips: [[0, 0.22], [0.24, 0.51], [0.53, 0.8], [0.82, 1]] },
  { name: "legenda", color: colors.slate600, clips: [[0.02, 0.12], [0.14, 0.3], [0.33, 0.47], [0.55, 0.7], [0.74, 0.93]] },
  { name: "overlay", color: colors.coral, clips: [[0.1, 0.26], [0.42, 0.55], [0.68, 0.84]] },
  { name: "zoom", color: colors.glowPeriwinkle, clips: [[0.3, 0.38], [0.6, 0.66], [0.88, 0.95]] },
];

const PILLS = ["100% local", "offline", "sem upload", "sem telemetria"];

export const Cut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const playhead = interpolate(frame, [0.8 * fps, durationInFrames], [0.05, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Paper>
      <Phrase delay={0} size={84} parts={[{ text: "Quer ajustar à mão?" }]} />
      <Phrase delay={0.45} size={84} parts={[{ text: "MChiodi Cut.", accent: true }]} />

      <Rise delay={0.7} style={{ marginTop: 44 }}>
        <Window title="MChiodi Cut · 127.0.0.1:4870" dark>
          <div style={{ padding: 24 }}>
            <div
              style={{
                position: "relative",
                height: 300,
                borderRadius: 14,
                background: `linear-gradient(135deg, #1f2937, ${colors.night})`,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 28,
              }}
            >
              <div
                style={{
                  padding: "10px 22px",
                  borderRadius: 12,
                  backgroundColor: colors.white,
                  fontSize: 30,
                  fontWeight: 800,
                  color: colors.ink,
                }}
              >
                edita meus vídeos <span style={{ color: colors.coral }}>sozinho</span>
              </div>
            </div>
            <div style={{ position: "relative", marginTop: 20 }}>
              {TRACKS.map((track) => (
                <div
                  key={track.name}
                  style={{ display: "flex", alignItems: "center", height: 44, gap: 16 }}
                >
                  <div
                    style={{
                      width: 110,
                      fontFamily: fonts.mono,
                      fontSize: 18,
                      color: colors.slate300,
                    }}
                  >
                    {track.name}
                  </div>
                  <div style={{ position: "relative", flex: 1, height: 30 }}>
                    {track.clips.map(([a, b]) => (
                      <div
                        key={a}
                        style={{
                          position: "absolute",
                          left: `${a * 100}%`,
                          width: `${(b - a) * 100}%`,
                          top: 0,
                          bottom: 0,
                          borderRadius: 6,
                          backgroundColor: track.color,
                          border: "2px solid rgba(255,255,255,0.18)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  bottom: -8,
                  left: `calc(126px + (100% - 126px) * ${playhead})`,
                  width: 4,
                  borderRadius: 2,
                  backgroundColor: colors.coral,
                }}
              />
            </div>
          </div>
        </Window>
      </Rise>

      <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {PILLS.map((pill, i) => (
          <Rise key={pill} delay={1.6 + i * 0.18} distance={20}>
            <Pill accent={i === PILLS.length - 1}>{pill}</Pill>
          </Rise>
        ))}
      </div>
    </Paper>
  );
};
