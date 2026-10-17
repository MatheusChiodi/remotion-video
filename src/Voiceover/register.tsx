import { Composition } from "remotion";
import {
  VoiceoverProps,
  VoiceoverVideo,
  calculateVoiceoverMetadata,
} from "./VoiceoverVideo";

const defaultProps: VoiceoverProps = { name: "demo", lines: [], gapSec: 0.35 };

export const VoiceoverCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="VoiceoverDemo"
        component={VoiceoverVideo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1}
        defaultProps={defaultProps}
        calculateMetadata={calculateVoiceoverMetadata}
      />
    </>
  );
};
