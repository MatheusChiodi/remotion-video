import { Composition } from "remotion";
import { FlintpadAd } from "./FlintpadAd";
import { FPS, TOTAL_FRAMES } from "./flintpad";

const FORMATS = [
  { id: "FlintpadLinkedIn", width: 1080, height: 1350 },
  { id: "FlintpadSquare", width: 1080, height: 1080 },
];

export const FlintpadAdCompositions: React.FC = () => {
  return (
    <>
      {FORMATS.map((format) => (
        <Composition
          key={format.id}
          {...format}
          component={FlintpadAd}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
        />
      ))}
    </>
  );
};
