import { Composition } from "remotion";
import { PrompterAd } from "./PrompterAd";
import { FPS, TOTAL_FRAMES } from "./prompter";

// 4:5 é o formato que mais ocupa o feed do LinkedIn
const FORMATS = [
  { id: "PrompterAd", width: 1080, height: 1350 },
  { id: "PrompterAdVertical", width: 1080, height: 1920 },
];

export const PrompterAdCompositions: React.FC = () => {
  return (
    <>
      {FORMATS.map((format) => (
        <Composition
          key={format.id}
          {...format}
          component={PrompterAd}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
        />
      ))}
    </>
  );
};
