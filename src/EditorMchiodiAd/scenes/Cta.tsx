import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, shadow } from "../theme";
import { Paper, Phrase, Pill, Rise } from "../ui";

const STACK = ["Claude Code", "Remotion", "ffmpeg", "WhisperX", "TypeScript"];

const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });

  return (
    <Paper>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Img
          src={staticFile("logo.png")}
          style={{ width: 180, transform: `scale(${pop})` }}
        />
        <Rise delay={0.3} style={{ marginTop: 28 }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            editor-<span style={{ color: colors.coral }}>mchiodi</span>
          </div>
        </Rise>
        <div style={{ marginTop: 20 }}>
          <Phrase
            delay={0.6}
            size={60}
            stagger={0.05}
            parts={[
              { text: "Seu vídeo bruto vira" },
              { text: "vídeo publicado.", accent: true },
            ]}
          />
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {STACK.map((tech, i) => (
            <Rise key={tech} delay={1.2 + i * 0.1} distance={20}>
              <Pill style={{ fontSize: 26, padding: "10px 22px" }}>{tech}</Pill>
            </Rise>
          ))}
        </div>

        <Rise delay={1.9} style={{ marginTop: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "26px 36px",
              borderRadius: 24,
              backgroundColor: colors.ink,
              color: colors.paper,
              boxShadow: shadow.raised,
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24">
              <path d={GITHUB_PATH} fill={colors.paper} />
            </svg>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 28,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              github.com/MatheusChiodi/editor-mchiodi
            </div>
          </div>
        </Rise>
        <Rise delay={2.3} style={{ marginTop: 28 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: colors.slate600 }}>
            Open source · licença MIT · link nos comentários
          </div>
        </Rise>
      </div>
    </Paper>
  );
};
