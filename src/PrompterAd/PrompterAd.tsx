import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { Soundtrack } from "../Soundtrack";
import { StudioFrame } from "./components";
import { colors, scenes, timing } from "./prompter";
import { Cta } from "./scenes/Cta";
import { Demo } from "./scenes/Demo";
import { Features } from "./scenes/Features";
import { Hook } from "./scenes/Hook";
import { Matcher } from "./scenes/Matcher";
import { Problem } from "./scenes/Problem";
import { Reveal } from "./scenes/Reveal";

const ORDER = [
  { name: "1 Gancho", frames: scenes.hook, Scene: Hook },
  { name: "2 Problema", frames: scenes.problem, Scene: Problem },
  { name: "3 Revelação", frames: scenes.reveal, Scene: Reveal },
  { name: "4 Demo", frames: scenes.demo, Scene: Demo },
  { name: "5 Matcher", frames: scenes.matcher, Scene: Matcher },
  { name: "6 Recursos", frames: scenes.features, Scene: Features },
  { name: "7 CTA", frames: scenes.cta, Scene: Cta },
];

export const PrompterAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.coal }}>
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
      <StudioFrame />
      <Soundtrack name="prompter" />
    </AbsoluteFill>
  );
};
