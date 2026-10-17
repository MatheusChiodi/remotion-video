import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type VoiceLine = {
  id: string;
  text: string;
  file: string;
  durationSec: number;
  at?: number;
};

export type VoiceoverProps = {
  name: string;
  lines: VoiceLine[];
  gapSec: number;
};

type Manifest = { gapSec: number; lines: VoiceLine[] };

const lineFrames = (line: VoiceLine, gapSec: number, fps: number) =>
  Math.ceil((line.durationSec + gapSec) * fps);

// Duração do vídeo = soma das falas geradas pelo VoiceStudio
export const calculateVoiceoverMetadata: CalculateMetadataFunction<
  VoiceoverProps
> = async ({ props }) => {
  const res = await fetch(staticFile(`voiceover/${props.name}/manifest.json`));
  if (!res.ok) {
    throw new Error(
      `Manifest não encontrado. Rode: npm run voice -- ${props.name}`,
    );
  }
  const manifest: Manifest = await res.json();
  const fps = 30;
  const durationInFrames = manifest.lines.reduce(
    (sum, line) => sum + lineFrames(line, manifest.gapSec, fps),
    0,
  );
  return {
    fps,
    durationInFrames: Math.max(durationInFrames, 1),
    props: { ...props, lines: manifest.lines, gapSec: manifest.gapSec },
  };
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: 96 }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 72,
          lineHeight: 1.15,
          color: colors.paper,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const VoiceoverVideo: React.FC<VoiceoverProps> = ({ lines, gapSec }) => {
  const { fps } = useVideoConfig();
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.slate900 }}>
      {lines.map((line) => {
        const duration = lineFrames(line, gapSec, fps);
        const start = from;
        from += duration;
        return (
          <Sequence key={line.id} from={start} durationInFrames={duration}>
            <Audio src={staticFile(line.file)} />
            <Caption text={line.text} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
