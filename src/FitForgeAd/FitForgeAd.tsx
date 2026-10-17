import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Embers } from "./components/Embers";
import { audio, scenes, timing, TOTAL_FRAMES } from "./fitforge";
import { Cta } from "./scenes/Cta";
import { Features } from "./scenes/Features";
import { Hook } from "./scenes/Hook";
import { Pain } from "./scenes/Pain";
import { Reveal } from "./scenes/Reveal";
import { Trust } from "./scenes/Trust";
import { CLAMP } from "./theme";

const ORDER = [
  { name: "1 Gancho", frames: scenes.hook, Scene: Hook },
  { name: "2 Dor", frames: scenes.pain, Scene: Pain },
  { name: "3 Revelação", frames: scenes.reveal, Scene: Reveal },
  { name: "4 Funcionalidades", frames: scenes.features, Scene: Features },
  { name: "5 Confiança", frames: scenes.trust, Scene: Trust },
  { name: "6 CTA", frames: scenes.cta, Scene: Cta },
];

const CUTS = ORDER.slice(0, -1).reduce<number[]>(
  (cuts, scene) => [...cuts, (cuts[cuts.length - 1] ?? 0) + scene.frames],
  [],
);

const Soundtrack: React.FC = () => (
  <Audio
    src={staticFile(audio.file)}
    volume={(f) => {
      const fadeIn = interpolate(f, [0, audio.fadeInFrames], [0, 1], CLAMP);
      const fadeOut = interpolate(
        f,
        [TOTAL_FRAMES - audio.fadeOutFrames, TOTAL_FRAMES],
        [1, 0],
        CLAMP,
      );
      const hit = CUTS.reduce(
        (max, cut) =>
          Math.max(
            max,
            interpolate(f, [cut, cut + audio.hitFrames], [1, 0], CLAMP) *
              (f >= cut ? 1 : 0),
          ),
        0,
      );
      return (
        Math.min(1, audio.volume + hit * audio.hitBoost) * fadeIn * fadeOut
      );
    }}
  />
);

export const FitForgeAd: React.FC = () => {
  return (
    <AbsoluteFill>
      <Embers />
      {/* Cada cena dura o tempo dela mais o fade seguinte, então os cortes caem nos frames do roteiro */}
      <TransitionSeries>
        {ORDER.flatMap(({ name, frames, Scene }, i) => {
          const isLast = i === ORDER.length - 1;
          return [
            <TransitionSeries.Sequence
              key={name}
              name={name}
              durationInFrames={isLast ? frames : frames + timing.fadeFrames}
              premountFor={30}
            >
              <Scene />
            </TransitionSeries.Sequence>,
            isLast ? null : (
              <TransitionSeries.Transition
                key={`${name}-fade`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: timing.fadeFrames })}
              />
            ),
          ];
        })}
      </TransitionSeries>
      {audio.enabled ? <Soundtrack /> : null}
    </AbsoluteFill>
  );
};
