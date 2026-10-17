import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { Soundtrack } from "../Soundtrack";
import { scenes, timing } from "./cockpit";
import { Backdrop, Stage } from "./components";
import { Cta, Guards, Hook, Pain, Panel, Reveal, Stats } from "./scenes";

const ORDER = [
  { name: "1 Gancho", frames: scenes.hook, Scene: Hook },
  { name: "2 Dor", frames: scenes.pain, Scene: Pain },
  { name: "3 Revelação", frames: scenes.reveal, Scene: Reveal },
  { name: "4 Painel", frames: scenes.panel, Scene: Panel },
  { name: "5 Guards", frames: scenes.guards, Scene: Guards },
  { name: "6 Números", frames: scenes.stats, Scene: Stats },
  { name: "7 CTA", frames: scenes.cta, Scene: Cta },
];

export const CockpitAd: React.FC = () => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <Stage>
        <TransitionSeries>
          {ORDER.flatMap(({ name, frames, Scene }, i) => [
            <TransitionSeries.Sequence
              key={name}
              name={name}
              durationInFrames={frames}
              premountFor={30}
            >
              <Scene />
            </TransitionSeries.Sequence>,
            i === ORDER.length - 1 ? null : (
              <TransitionSeries.Transition
                key={`${name}-fade`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: timing.fadeFrames })}
              />
            ),
          ])}
        </TransitionSeries>
      </Stage>
      <Soundtrack name="cockpit" />
    </AbsoluteFill>
  );
};
