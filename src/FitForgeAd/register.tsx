import { Composition } from "remotion";
import { FitForgeAd } from "./FitForgeAd";
import { FPS, TOTAL_FRAMES } from "./fitforge";

const FORMATS = [
  { id: "FitForgeAd", width: 1080, height: 1920 },
  { id: "FitForgeAdSquare", width: 1080, height: 1080 },
  { id: "FitForgeAdWide", width: 1920, height: 1080 },
];

export const FitForgeAdCompositions: React.FC = () => {
  return (
    <>
      {FORMATS.map((format) => (
        <Composition
          key={format.id}
          {...format}
          component={FitForgeAd}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
        />
      ))}
    </>
  );
};
