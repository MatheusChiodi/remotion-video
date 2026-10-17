import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts, shadow } from "../theme";
import { Label, Paper, Phrase, Rise } from "../ui";

const FILES = [
  { name: "final.mp4", desc: "vídeo editado em 1080p" },
  { name: "final-shorts.mp4", desc: "Short vertical 9:16" },
  { name: "capa-1.png", desc: "capas para teste A/B" },
  { name: "titulo.txt", desc: "títulos com justificativa" },
  { name: "descricao.txt", desc: "descrição + tags" },
  { name: "capitulos.txt", desc: "capítulos com timestamp" },
  { name: "relatorio.md", desc: "cada decisão explicada" },
];

const BARS = 56;
const FILES_START = 2.0;
const FILE_STAGGER = 0.24;

export const InOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrow = enter(frame, fps, 1.1, 0.5);
  // o playhead percorre a gravação enquanto os arquivos de saída aparecem
  const scan = enter(frame, fps, FILES_START, FILES.length * FILE_STAGGER + 0.4);

  return (
    <Paper padY={80}>
      <Rise delay={0}>
        <Label>Entra</Label>
      </Rise>
      <Rise delay={0.15} style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: 28,
            borderRadius: 24,
            backgroundColor: colors.white,
            boxShadow: shadow.card,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              backgroundColor: colors.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                marginLeft: 8,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderLeft: `30px solid ${colors.paper}`,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ fontFamily: fonts.mono, fontSize: 30, fontWeight: 700 }}>
                gravacao-bruta.mp4
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.slate600 }}>
                42:18
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 4,
                height: 56,
                marginTop: 14,
              }}
            >
              {new Array(BARS).fill(0).map((_, i) => {
                const h = 10 + random(`bar-${i}`) * 46;
                const grow = enter(frame, fps, 0.3 + i * 0.012, 0.4);
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: h * grow,
                      borderRadius: 3,
                      backgroundColor: i / BARS < scan ? colors.coral : colors.slate300,
                    }}
                  />
                );
              })}
              <div
                style={{
                  position: "absolute",
                  left: `${scan * 100}%`,
                  top: -6,
                  bottom: -6,
                  width: 4,
                  borderRadius: 2,
                  backgroundColor: colors.ink,
                  opacity: scan > 0 && scan < 1 ? 1 : 0,
                }}
              />
            </div>
          </div>
        </div>
      </Rise>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          height: 120,
          paddingLeft: 60,
          opacity: arrow,
        }}
      >
        <div
          style={{
            width: 4,
            height: 80 * arrow,
            backgroundColor: colors.ink,
            borderRadius: 2,
          }}
        />
        <div style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.slate600 }}>
          mce · Claude Code dirigindo
        </div>
      </div>

      <Rise delay={1.5}>
        <Label>Sai em output/&lt;slug&gt;/</Label>
      </Rise>
      <Rise delay={1.6} style={{ marginTop: 16 }}>
        <div
          style={{
            padding: "12px 28px",
            borderRadius: 24,
            backgroundColor: colors.white,
            boxShadow: shadow.card,
          }}
        >
          {FILES.map((file, i) => {
            const p = enter(frame, fps, FILES_START + i * FILE_STAGGER, 0.4);
            return (
              <div
                key={file.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  height: 66,
                  borderTop: i === 0 ? "none" : `2px solid ${colors.line}`,
                  opacity: 0.15 + p * 0.85,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.coral,
                    color: colors.white,
                    fontSize: 20,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${p})`,
                  }}
                >
                  ✓
                </div>
                <div style={{ fontFamily: fonts.mono, fontSize: 28, fontWeight: 700, flex: 1 }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 26, color: colors.slate600 }}>{file.desc}</div>
              </div>
            );
          })}
        </div>
      </Rise>

      <div style={{ marginTop: 44 }}>
        <Phrase
          delay={FILES_START + FILES.length * FILE_STAGGER + 0.2}
          size={72}
          parts={[{ text: "Pronto pra" }, { text: "publicar.", accent: true }]}
        />
      </div>
    </Paper>
  );
};
