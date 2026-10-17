import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { Soundtrack } from "../Soundtrack";
import { scenes, timing } from "./flintpad";
import { Backdrop, Stage } from "./components";
import { Cta, Hook, Keys, Local, Pain, Reveal, Tabs } from "./scenes";

const ORDER = [
  { name: "1 Gancho", frames: scenes.hook, Scene: Hook },
  { name: "2 Dor", frames: scenes.pain, Scene: Pain },
  { name: "3 Revelação", frames: scenes.reveal, Scene: Reveal },
  { name: "4 Abas", frames: scenes.tabs, Scene: Tabs },
  { name: "5 Local-first", frames: scenes.local, Scene: Local },
  { name: "6 Teclado", frames: scenes.keys, Scene: Keys },
  { name: "7 CTA", frames: scenes.cta, Scene: Cta },
];

export const FlintpadAd: React.FC = () => {
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
      <Soundtrack name="flintpad" />
    </AbsoluteFill>
  );
};
