import { Composition } from "remotion";
import { EditorMchiodiAd, TOTAL_FRAMES } from "./EditorMchiodiAd";
import { FPS, HEIGHT, WIDTH } from "./theme";

// 4:5 é o formato que ocupa mais tela no feed do LinkedIn
export const EditorMchiodiAdCompositions: React.FC = () => (
  <Composition
    id="EditorMchiodiLinkedIn"
    component={EditorMchiodiAd}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
