import { Composition } from "remotion";
import { CockpitAd } from "./CockpitAd";
import { FPS, TOTAL_FRAMES } from "./cockpit";

const FORMATS = [
  { id: "CockpitLinkedIn", width: 1080, height: 1350 },
  { id: "CockpitSquare", width: 1080, height: 1080 },
];

export const CockpitAdCompositions: React.FC = () => {
  return (
    <>
      {FORMATS.map((format) => (
        <Composition
          key={format.id}
          {...format}
          component={CockpitAd}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
        />
      ))}
    </>
  );
};
