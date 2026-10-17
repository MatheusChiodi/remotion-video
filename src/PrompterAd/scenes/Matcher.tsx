import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Label } from "../components";
import { colors, enter, fonts, rise } from "../prompter";

const Chip: React.FC<{ children: React.ReactNode; color: string; filled?: boolean }> = ({
  children,
  color,
  filled,
}) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: 36,
      padding: "10px 16px",
      border: `3px solid ${color}`,
      background: filled ? color : "transparent",
      color: filled ? colors.coal : color,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const Op: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: fonts.mono, fontSize: 40, color: colors.chalkDim }}>
    {children}
  </span>
);

const ROWS = [
  {
    caption: "1 · Chave fonética",
    at: 16,
    body: (
      <>
        <Chip color={colors.cyan}>cubernetis</Chip>
        <Op>→</Op>
        <Chip color={colors.yellow} filled>
          kubirnitis
        </Chip>
        <Op>←</Op>
        <Chip color={colors.chalk}>Kubernetes</Chip>
      </>
    ),
  },
  {
    caption: "2 · Palavras coladas",
    at: 50,
    body: (
      <>
        <Chip color={colors.cyan}>use</Chip>
        <Op>+</Op>
        <Chip color={colors.cyan}>effect</Chip>
        <Op>→</Op>
        <Chip color={colors.chalk}>useEffect</Chip>
      </>
    ),
  },
  {
    caption: "3 · Tolerância a erro",
    at: 84,
    body: (
      <>
        <Chip color={colors.cyan}>bild</Chip>
        <Op>≈</Op>
        <Chip color={colors.chalk}>build</Chip>
        <span
          style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.chalkDim }}
        >
          1 letra de diferença
        </span>
      </>
    ),
  },
];

export const Matcher: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px" }}>
      <div style={rise(enter(frame, 0))}>
        <Label color={colors.yellow}>Como ele entende</Label>
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 0.95,
          textTransform: "uppercase",
          color: colors.chalk,
          ...rise(enter(frame, 4)),
        }}
      >
        Compara o som,
        <br />
        <span style={{ color: colors.chalkDim }}>não a grafia.</span>
      </div>

      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 40 }}>
        {ROWS.map((row) => (
          <div key={row.caption} style={rise(enter(frame, row.at), 30)}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 24,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: colors.chalkDim,
                marginBottom: 16,
              }}
            >
              {row.caption}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {row.body}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 56,
          fontFamily: fonts.mono,
          fontSize: 26,
          color: colors.chalkDim,
          ...rise(enter(frame, 118)),
        }}
      >
        <span style={{ color: colors.chalk }}>advance(state, script, spokenWords)</span>
        <br />
        função pura · com suíte de testes
      </div>
    </AbsoluteFill>
  );
};
