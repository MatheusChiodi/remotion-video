import React from "react";
import { Composition } from "remotion";
import { portfolio } from "./data/portfolio";
import { PortfolioStory } from "./PortfolioStory";
import { TOTAL_FRAMES } from "./timeline";

export const VoxelStoryCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="PortfolioStory"
        component={PortfolioStory}
        durationInFrames={TOTAL_FRAMES}
        fps={portfolio.video.fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="PortfolioStoryVertical"
        component={PortfolioStory}
        durationInFrames={TOTAL_FRAMES}
        fps={portfolio.video.fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
