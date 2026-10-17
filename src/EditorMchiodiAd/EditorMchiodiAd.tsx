import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Soundtrack } from "../Soundtrack";
import { Arsenal } from "./scenes/Arsenal";
import { Cta } from "./scenes/Cta";
import { Cut } from "./scenes/Cut";
import { EdlLoop } from "./scenes/EdlLoop";
import { Hook } from "./scenes/Hook";
import { InOut } from "./scenes/InOut";
import { Levels } from "./scenes/Levels";
import { ReadsText } from "./scenes/ReadsText";
import { colors, FPS, TRANSITION } from "./theme";

const SCENES: { id: string; seconds: number; Component: React.FC }[] = [
  { id: "hook", seconds: 5, Component: Hook },
  { id: "in-out", seconds: 7, Component: InOut },
  { id: "reads-text", seconds: 6.5, Component: ReadsText },
  { id: "edl-loop", seconds: 6.5, Component: EdlLoop },
  { id: "arsenal", seconds: 5, Component: Arsenal },
  { id: "levels", seconds: 5.5, Component: Levels },
  { id: "cut", seconds: 5.5, Component: Cut },
  { id: "cta", seconds: 6.5, Component: Cta },
];

export const TOTAL_FRAMES =
  SCENES.reduce((sum, s) => sum + Math.round(s.seconds * FPS), 0) -
  (SCENES.length - 1) * TRANSITION;

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 8,
        width: `${(frame / (durationInFrames - 1)) * 100}%`,
        backgroundColor: colors.coral,
      }}
    />
  );
};

export const EditorMchiodiAd: React.FC = () => {
  const children: React.ReactNode[] = [];
  SCENES.forEach(({ id, seconds, Component }, i) => {
    if (i > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${id}`}
          // alterna corte suave e página empurrada para dar ritmo sem cansar
          presentation={i % 2 === 0 ? fade() : slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />,
      );
    }
    children.push(
      <TransitionSeries.Sequence key={id} durationInFrames={Math.round(seconds * FPS)}>
        <Component />
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.paper }}>
      <TransitionSeries>{children}</TransitionSeries>
      <ProgressBar />
      <Soundtrack name="editor" />
    </AbsoluteFill>
  );
};
