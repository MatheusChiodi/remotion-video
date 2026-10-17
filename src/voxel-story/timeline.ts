import { portfolio } from "./data/portfolio";

const { landmarks, transitionFrames } = portfolio.video;
const sceneCount = landmarks.length - 1;

// Cada cena (menos a última) ganha os frames da transição para que a próxima
// comece exatamente no marco do roteiro.
export const sceneDurations = new Array(sceneCount)
  .fill(0)
  .map(
    (_, i) =>
      landmarks[i + 1] -
      landmarks[i] +
      (i < sceneCount - 1 ? transitionFrames : 0),
  );

export const TOTAL_FRAMES =
  sceneDurations.reduce((sum, duration) => sum + duration, 0) -
  (sceneCount - 1) * transitionFrames;
