import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PunchTitle } from "../components/PunchTitle";
import { copy, timing } from "../fitforge";
import { useLayout } from "../theme";

const SIZE = { vertical: 210, square: 180, wide: 200 };

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { format, safe } = useLayout();
  const [first, second] = copy.hook;
  const showSecond = frame >= timing.hookSecondLine;

  return (
    <AbsoluteFill
      style={{
        padding: `${safe.y}px ${safe.x}px`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showSecond ? (
        <PunchTitle
          line={second}
          size={SIZE[format]}
          delay={timing.hookSecondLine}
          stagger={5}
        />
      ) : (
        <PunchTitle line={first} size={SIZE[format]} stagger={6} />
      )}
    </AbsoluteFill>
  );
};
