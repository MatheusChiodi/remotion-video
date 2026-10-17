import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, enter, fonts } from "../theme";
import { Paper, Phrase, Rise, Window } from "../ui";

type Kind = "keep" | "pause" | "retake";

const LINES: { t: string; text: string; kind: Kind; tag?: string }[] = [
  { t: "00:12.4", text: "e aí, hoje eu vou mostrar", kind: "retake", tag: "retake" },
  { t: "00:15.1", text: "[pausa 2,3 s]", kind: "pause", tag: "silêncio" },
  { t: "00:17.4", text: "hoje eu vou mostrar como", kind: "keep" },
  { t: "00:19.0", text: "é... ééé...", kind: "pause", tag: "hesitação" },
  { t: "00:20.2", text: "o Claude edita meus vídeos", kind: "keep" },
  { t: "00:22.6", text: "sozinho, do corte à capa.", kind: "keep" },
];

const LINE_START = 1.3;
const LINE_STAGGER = 0.32;
const CUT_AT = LINE_START + LINES.length * LINE_STAGGER + 0.3;

export const ReadsText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Paper>
      <Phrase delay={0} size={100} parts={[{ text: "Ele não assiste." }]} />
      <Phrase delay={0.5} size={100} parts={[{ text: "Ele" }, { text: "lê.", accent: true }]} />

      <Rise delay={0.9} style={{ marginTop: 56 }}>
        <Window title="projects/aula/analysis/takes.md">
          <div style={{ padding: "20px 28px 28px" }}>
            {LINES.map((line, i) => {
              const start = LINE_START + i * LINE_STAGGER;
              const typed = enter(frame, fps, start, 0.35);
              const chars = Math.round(line.text.length * typed);
              const isCut = line.kind !== "keep";
              const strike = isCut ? enter(frame, fps, CUT_AT + i * 0.08, 0.35) : 0;
              return (
                <div
                  key={line.t}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    height: 62,
                    fontFamily: fonts.mono,
                    fontSize: 28,
                    opacity: frame >= start * fps ? 1 - strike * 0.45 : 0,
                  }}
                >
                  <span style={{ color: colors.slate600 }}>{line.t}</span>
                  <span
                    style={{
                      position: "relative",
                      color: line.kind === "keep" ? colors.ink : colors.slate600,
                    }}
                  >
                    {line.text.slice(0, chars)}
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "52%",
                        height: 4,
                        width: `${strike * 100}%`,
                        backgroundColor: colors.coral,
                      }}
                    />
                  </span>
                  {line.tag ? (
                    <span
                      style={{
                        marginLeft: "auto",
                        padding: "4px 14px",
                        borderRadius: 9999,
                        fontSize: 20,
                        fontWeight: 700,
                        color: colors.white,
                        backgroundColor: colors.coral,
                        transform: `scale(${strike})`,
                      }}
                    >
                      {line.tag}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Window>
      </Rise>

      <Rise delay={CUT_AT + 0.5} style={{ marginTop: 48 }}>
        <div style={{ fontSize: 36, lineHeight: 1.4, color: colors.slate600 }}>
          Transcrição local palavra a palavra. Ele só pede imagem nos pontos de
          decisão.
        </div>
      </Rise>
    </Paper>
  );
};
