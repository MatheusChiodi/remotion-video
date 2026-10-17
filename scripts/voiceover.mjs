// Gera narração com TTS neural local (sherpa-onnx + vozes Piper pt-BR), sem servidor
// Uso: node scripts/voiceover.mjs <nome>   → lê voiceover/<nome>.json
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sherpa from "sherpa-onnx-node";

const name = process.argv[2];
if (!name) {
  console.error("Uso: npm run voice -- <nome>  (lê voiceover/<nome>.json)");
  process.exit(1);
}

const script = JSON.parse(await readFile(`voiceover/${name}.json`, "utf8"));
const outDir = path.join("public", "voiceover", name);
await mkdir(outDir, { recursive: true });

const engines = new Map();
const loadVoice = (voice) => {
  if (engines.has(voice)) return engines.get(voice);
  const dir = path.join(".tts-models", `vits-piper-pt_BR-${voice}-medium`);
  if (!existsSync(dir)) {
    throw new Error(`Voz ${voice} não instalada. Rode: npm run tts:setup -- ${voice}`);
  }
  const tts = new sherpa.OfflineTts({
    model: {
      vits: {
        model: path.join(dir, `pt_BR-${voice}-medium.onnx`),
        tokens: path.join(dir, "tokens.txt"),
        dataDir: path.join(dir, "espeak-ng-data"),
        noiseScale: 0.6,
        noiseScaleW: 0.8,
      },
      numThreads: 4,
      provider: "cpu",
      debug: false,
    },
    maxNumSentences: 1,
  });
  engines.set(voice, tts);
  return tts;
};

// Duração lida do header WAV: tamanho do chunk "data" / byteRate
const wavDurationSec = (buf) => {
  const byteRate = buf.readUInt32LE(28);
  let offset = 12;
  while (offset + 8 <= buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "data") {
      const dataSize = Math.min(size, buf.length - offset - 8);
      return dataSize / byteRate;
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error("WAV sem chunk data");
};

// Corta silêncio das pontas, dá corpo de locutor (grave + compressão) e nivela o volume
const master = (rawPath, outPath) =>
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", rawPath,
    "-af",
    [
      "silenceremove=start_periods=1:start_threshold=-45dB",
      "areverse",
      "silenceremove=start_periods=1:start_threshold=-45dB",
      "areverse",
      "highpass=f=70",
      "bass=g=3:f=140",
      "treble=g=1.5:f=5000",
      "acompressor=threshold=-20dB:ratio=3:attack=5:release=80",
      "loudnorm=I=-16:TP=-1.5:LRA=7",
    ].join(","),
    "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", outPath,
  ]);

const lines = [];
for (const [index, line] of script.lines.entries()) {
  const id = line.id ?? String(index + 1).padStart(2, "0");
  process.stdout.write(`[${index + 1}/${script.lines.length}] ${id}... `);

  const tts = loadVoice(line.voice ?? script.voice ?? "faber");
  const audio = tts.generate({
    text: line.text,
    sid: 0,
    speed: line.speed ?? script.speed ?? 1,
  });

  const file = `${id}.wav`;
  const rawPath = path.join(outDir, `${id}.raw.wav`);
  const outPath = path.join(outDir, file);
  sherpa.writeWave(rawPath, { samples: audio.samples, sampleRate: audio.sampleRate });
  master(rawPath, outPath);
  await rm(rawPath);

  const durationSec = wavDurationSec(await readFile(outPath));
  lines.push({
    id,
    text: line.text,
    file: `voiceover/${name}/${file}`,
    durationSec,
    ...(line.at !== undefined ? { at: line.at } : {}),
  });
  console.log(`${durationSec.toFixed(2)}s`);
}

// Falas com `at` fixo não podem invadir a próxima
lines.forEach((line, i) => {
  const next = lines[i + 1];
  if (line.at === undefined || next?.at === undefined) return;
  const overflow = line.at + line.durationSec - next.at;
  if (overflow > 0) {
    console.warn(`⚠ ${line.id} invade ${next.id} em ${overflow.toFixed(2)}s`);
  }
});

await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify({ name, gapSec: script.gapSec ?? 0.35, lines }, null, 2),
);
console.log(`Manifest: ${path.join(outDir, "manifest.json")}`);
