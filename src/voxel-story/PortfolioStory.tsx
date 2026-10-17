import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { portfolio } from "./data/portfolio";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Origin } from "./scenes/Scene2Origin";
import { Scene3Turn } from "./scenes/Scene3Turn";
import { Scene4Lead } from "./scenes/Scene4Lead";
import { Scene5Side } from "./scenes/Scene5Side";
import { Scene6Close } from "./scenes/Scene6Close";
import { palette } from "./theme";
import { sceneDurations } from "./timeline";

const { landmarks, transitionFrames } = portfolio.video;

// Monta o canvas 3D da próxima cena um pouco antes, para o corte não engasgar.
const PREMOUNT_FRAMES = 30;

const SCENES = [
  Scene1Hook,
  Scene2Origin,
  Scene3Turn,
  Scene4Lead,
  Scene5Side,
  Scene6Close,
];

// A descida para a caverna (cena 2 -> 3) entra por baixo; o resto é fade.
const presentationFor = (index: number) =>
  index === 1 ? slide({ direction: "from-bottom" }) : fade();

const sfxCues = () => {
  const { origin, turn, lead, side, close } = portfolio;
  const at = (scene: number, frame: number) => landmarks[scene] + frame;
  return {
    blockPlaced: [
      at(1, origin.build.start),
      ...turn.stack.map((_, i) => at(2, turn.ores.firstBreak + i * turn.ores.stagger)),
      at(2, turn.errorFix),
      at(3, lead.firstBridge[0]),
      at(3, lead.otherBridges[0]),
      ...side.items.map((_, i) => at(4, side.fill.start + i * side.fill.stagger)),
      at(5, close.logo.start + close.logo.fallFrames),
    ],
    achievement: [at(1, origin.toast.from), at(3, lead.toast.from)],
  };
};

// staticFile de arquivo ausente derruba o render: o áudio só é montado com a flag ligada.
const Soundtrack: React.FC = () => {
  const { music, musicVolume, sfx } = portfolio.audio;
  const cues = sfxCues();
  return (
    <>
      <Audio src={staticFile(music)} volume={musicVolume} />
      {cues.blockPlaced.map((from) => (
        <Sequence key={`block-${from}`} from={from} layout="none">
          <Audio src={staticFile(sfx.blockPlaced)} volume={sfx.volume} />
        </Sequence>
      ))}
      {cues.achievement.map((from) => (
        <Sequence key={`achievement-${from}`} from={from} layout="none">
          <Audio src={staticFile(sfx.achievement)} volume={sfx.volume} />
        </Sequence>
      ))}
    </>
  );
};

export const PortfolioStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: palette.nightTop }}>
      <TransitionSeries>
        {SCENES.flatMap((Scene, i) => {
          const sequence = (
            <TransitionSeries.Sequence
              key={`scene-${i}`}
              durationInFrames={sceneDurations[i]}
              premountFor={PREMOUNT_FRAMES}
            >
              <Scene />
            </TransitionSeries.Sequence>
          );
          if (i === 0) {
            return [sequence];
          }
          return [
            <TransitionSeries.Transition
              key={`transition-${i}`}
              presentation={presentationFor(i - 1)}
              timing={linearTiming({ durationInFrames: transitionFrames })}
            />,
            sequence,
          ];
        })}
      </TransitionSeries>
      {portfolio.audio.enabled ? <Soundtrack /> : null}
    </AbsoluteFill>
  );
};
