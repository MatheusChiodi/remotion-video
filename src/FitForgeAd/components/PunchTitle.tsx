import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Line, palette } from "../fitforge";
import { CLAMP, fonts, punch } from "../theme";

type PunchTitleProps = {
  line: Line;
  size: number;
  delay?: number;
  // Frames entre uma palavra e a próxima
  stagger?: number;
  align?: "center" | "left";
  uppercase?: boolean;
};

export const PunchTitle: React.FC<PunchTitleProps> = ({
  line,
  size,
  delay = 0,
  stagger = 3,
  align = "center",
  uppercase = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accentWords = line.accent ? line.accent.split(" ") : [];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: "0.24em",
        fontFamily: fonts.title,
        fontSize: size,
        lineHeight: 1.14,
        letterSpacing: "0.01em",
        textTransform: uppercase ? "uppercase" : "none",
        color: palette.text,
      }}
    >
      {line.text.split(" ").map((word, i) => {
        const start = delay + i * stagger;
        const scale = interpolate(punch(frame, fps, start), [0, 1], [1.4, 1]);
        const opacity = interpolate(frame, [start, start + 3], [0, 1], CLAMP);
        const isAccent = accentWords.includes(word);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `scale(${scale})`,
              color: isAccent ? palette.ember : undefined,
              textShadow: isAccent
                ? `0 0 ${size * 0.35}px rgba(255, 106, 26, 0.45)`
                : "0 4px 24px rgba(0, 0, 0, 0.6)",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
