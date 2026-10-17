import { Audio } from "@remotion/media";
import { useEffect, useState } from "react";
import {
  Sequence,
  interpolate,
  staticFile,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import type { VoiceLine } from "./Voiceover/VoiceoverVideo";

type Props = {
  // voiceover/<name>.json → public/voiceover/<name>/manifest.json + public/music/<name>.wav
  name: string;
  musicVolume?: number;
  duckedVolume?: number;
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const DUCK_FRAMES = 8;

export const Soundtrack: React.FC<Props> = ({
  name,
  musicVolume = 0.55,
  duckedVolume = 0.2,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [lines, setLines] = useState<VoiceLine[] | null>(null);
  const [handle] = useState(() => delayRender(`manifest ${name}`));

  useEffect(() => {
    fetch(staticFile(`voiceover/${name}/manifest.json`))
      .then((res) => {
        if (!res.ok) throw new Error(`Rode: npm run voice -- ${name}`);
        return res.json();
      })
      .then((manifest: { lines: VoiceLine[] }) => {
        setLines(manifest.lines);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [name, handle, continueRender, cancelRender]);

  if (!lines) return null;

  const spans = lines.map((line) => {
    const from = Math.round((line.at ?? 0) * fps);
    return { line, from, to: from + Math.ceil(line.durationSec * fps) };
  });

  // Música abaixa enquanto a narração fala e volta nos respiros
  const musicAt = (f: number) => {
    const duck = spans.reduce(
      (max, { from, to }) =>
        Math.max(
          max,
          interpolate(f, [from - DUCK_FRAMES, from, to, to + DUCK_FRAMES * 2], [0, 1, 1, 0], CLAMP),
        ),
      0,
    );
    const fade = Math.min(
      interpolate(f, [0, fps], [0, 1], CLAMP),
      interpolate(f, [durationInFrames - fps * 2, durationInFrames], [1, 0], CLAMP),
    );
    return interpolate(duck, [0, 1], [musicVolume, duckedVolume]) * fade;
  };

  return (
    <>
      <Audio src={staticFile(`music/${name}.wav`)} volume={musicAt} />
      {spans.map(({ line, from }) => (
        <Sequence key={line.id} name={`Voz ${line.id}`} from={from} layout="none">
          <Audio src={staticFile(line.file)} />
        </Sequence>
      ))}
    </>
  );
};
