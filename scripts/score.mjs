// Sintetiza trilha cinematográfica sincronizada com os cortes do vídeo
// Uso: node scripts/score.mjs <nome>   → lê "score" de voiceover/<nome>.json
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("Uso: npm run score -- <nome>");
  process.exit(1);
}

const { score } = JSON.parse(await readFile(`voiceover/${name}.json`, "utf8"));
const SR = 44100;
const TAU = Math.PI * 2;
const total = Math.ceil(score.duration * SR);
const L = new Float32Array(total);
const R = new Float32Array(total);

const hz = (midi) => 440 * 2 ** ((midi - 69 + score.transpose) / 12);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

// Pseudo-aleatório determinístico: a mesma config gera sempre a mesma trilha
let seed = 1337;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
};

// Intensidade 0..1: cresce até o reveal, explode nele e sustenta até o fim
const intensity = (t) => {
  const build = clamp01(t / score.reveal) * 0.45;
  const after = t >= score.reveal ? 0.35 + clamp01((t - score.reveal) / 6) * 0.2 : 0;
  return Math.min(1, 0.2 + build + after);
};

const add = (i, l, r) => {
  if (i < 0 || i >= total) return;
  L[i] += l;
  R[i] += r;
};

// Filtro passa-baixa de 1 polo com corte variável
const makeLowpass = () => {
  let y = 0;
  return (x, fc) => {
    y += (1 - Math.exp((-TAU * fc) / SR)) * (x - y);
    return y;
  };
};

// ── Pad de cordas: progressão menor i–VI–III–VII, 3 serras desafinadas por nota
const CHORDS = [
  [45, 57, 60, 64],
  [41, 57, 60, 65],
  [48, 55, 60, 64],
  [43, 55, 59, 62],
];
const CHORD_SEC = 4;
const ATTACK = 1.4;
const RELEASE = 2;
const pad = { l: new Float32Array(total), r: new Float32Array(total) };

for (let c = 0; c * CHORD_SEC < score.duration; c++) {
  const chord = CHORDS[c % CHORDS.length];
  const t0 = c * CHORD_SEC;
  const start = Math.floor(t0 * SR);
  const end = Math.min(total, Math.floor((t0 + CHORD_SEC + RELEASE) * SR));
  chord.forEach((midi, n) => {
    const f = hz(midi);
    const isBass = n === 0;
    [-9, 0, 9].forEach((cents, k) => {
      const freq = f * 2 ** (cents / 1200);
      let phase = rand();
      const pan = isBass ? 0.5 : [0.2, 0.5, 0.8][k];
      for (let i = start; i < end; i++) {
        const t = (i - start) / SR;
        const env =
          Math.min(1, t / ATTACK) *
          (t > CHORD_SEC ? Math.max(0, 1 - (t - CHORD_SEC) / RELEASE) : 1);
        phase += freq / SR;
        phase -= Math.floor(phase);
        const s = (2 * phase - 1) * env * (isBass ? 0.09 : 0.05);
        pad.l[i] += s * (1 - pan);
        pad.r[i] += s * pan;
      }
    });
  });

  // Sub grave senoidal na tônica do acorde
  const subF = hz(chord[0] - 12);
  for (let i = start; i < end; i++) {
    const t = (i - start) / SR;
    const env =
      Math.min(1, t / 0.8) *
      (t > CHORD_SEC ? Math.max(0, 1 - (t - CHORD_SEC) / RELEASE) : 1);
    const s = Math.sin(TAU * subF * t) * env * 0.16;
    add(i, s, s);
  }
}

// Pad passa por 2 filtros cascateados que abrem conforme a intensidade
{
  const [la, lb, ra, rb] = [makeLowpass(), makeLowpass(), makeLowpass(), makeLowpass()];
  for (let i = 0; i < total; i++) {
    const fc = 350 + 2200 * intensity(i / SR) ** 1.5;
    add(i, lb(la(pad.l[i], fc), fc), rb(ra(pad.r[i], fc), fc));
  }
}

// ── Ostinato em colcheias (estilo trailer) a partir de pulseFrom
{
  const step = 60 / 112 / 2;
  const lp = makeLowpass();
  const pulse = new Float32Array(total);
  for (let n = 0, t0 = score.pulseFrom; t0 < score.duration - 2.5; n++, t0 = score.pulseFrom + n * step) {
    const chord = CHORDS[Math.floor(t0 / CHORD_SEC) % CHORDS.length];
    const f = hz(chord[0] + (n % 4 === 3 ? 19 : 12));
    const accent = n % 4 === 0 ? 1 : 0.65;
    const start = Math.floor(t0 * SR);
    for (let i = 0; i < 0.22 * SR; i++) {
      const t = i / SR;
      const env = Math.exp(-t / 0.07) * accent;
      const saw = 2 * ((f * t) % 1) - 1;
      if (start + i < total) pulse[start + i] += (saw * 0.6 + Math.sin(TAU * f * t)) * env * 0.11;
    }
  }
  for (let i = 0; i < total; i++) {
    const s = lp(pulse[i], 900 + 1600 * intensity(i / SR)) * intensity(i / SR);
    add(i, s * 0.8, s);
  }
}

// ── Impacto: boom grave com queda de pitch + estalo de ruído
const boom = (at, gain) => {
  const start = Math.floor(at * SR);
  const lp = makeLowpass();
  let phase = 0;
  for (let i = 0; i < 2.2 * SR; i++) {
    const t = i / SR;
    phase += (38 + 70 * Math.exp(-t / 0.12)) / SR;
    const body = Math.sin(TAU * phase) * Math.exp(-t / 0.75);
    const crack = lp(rand() * 2 - 1, 1800) * Math.exp(-t / 0.09);
    const s = (body * 0.55 + crack * 0.5) * gain;
    add(start + i, s, s);
  }
};

// ── Riser: ruído filtrado subindo 2.5 s antes do reveal
const riser = (at) => {
  const dur = 2.5;
  const start = Math.floor((at - dur) * SR);
  const [la, ra] = [makeLowpass(), makeLowpass()];
  for (let i = 0; i < dur * SR; i++) {
    const p = i / (dur * SR);
    const fc = 200 + 7000 * p ** 2;
    const g = p ** 2.2 * 0.22;
    add(start + i, la(rand() * 2 - 1, fc) * g, ra(rand() * 2 - 1, fc) * g);
  }
};

// ── Braam: metais graves que abrem no reveal
const braam = (at) => {
  const start = Math.floor(at * SR);
  const root = CHORDS[Math.floor(at / CHORD_SEC) % CHORDS.length][0];
  const [la, ra] = [makeLowpass(), makeLowpass()];
  const voices = [root - 12, root, root + 7].map((m) => [hz(m), rand()]);
  for (let i = 0; i < 3.5 * SR; i++) {
    const t = i / SR;
    let s = 0;
    for (const v of voices) {
      v[1] += v[0] / SR;
      v[1] -= Math.floor(v[1]);
      s += 2 * v[1] - 1;
    }
    const env = Math.min(1, t / 0.05) * Math.exp(-t / 1.4);
    const fc = 200 + 1400 * Math.exp(-t / 0.5);
    s *= env * 0.16;
    add(start + i, la(s, fc), ra(s, fc));
  }
};

score.cuts.filter((t) => t !== score.reveal).forEach((t) => boom(t, 0.55));
riser(score.reveal);
boom(score.reveal, 1);
braam(score.reveal);

// Fade de entrada/saída, saturação suave e normalização de pico
const fadeIn = 1.5 * SR;
const fadeOut = 3 * SR;
let peak = 0;
for (let i = 0; i < total; i++) {
  const g = Math.min(1, i / fadeIn, (total - i) / fadeOut);
  L[i] = Math.tanh(L[i] * 1.3) * g;
  R[i] = Math.tanh(R[i] * 1.3) * g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}

const wav = Buffer.alloc(44 + total * 4);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + total * 4, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(total * 4, 40);
for (let i = 0; i < total; i++) {
  wav.writeInt16LE(Math.round((L[i] / peak) * 0.9 * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round((R[i] / peak) * 0.9 * 32767), 46 + i * 4);
}

const outDir = path.join("public", "music");
await mkdir(outDir, { recursive: true });
const raw = path.join(outDir, `${name}.raw.wav`);
const out = path.join(outDir, `${name}.wav`);
await writeFile(raw, wav);

// Reverb de sala grande (ecos múltiplos) e loudness de trilha de fundo
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error", "-i", raw,
  "-af",
  "aecho=0.85:0.75:37|71|113|167|241:0.32|0.26|0.2|0.15|0.1,highpass=f=25,loudnorm=I=-17:TP=-1.5:LRA=11",
  "-ar", String(SR), "-c:a", "pcm_s16le", out,
]);
await rm(raw);
console.log(`Trilha: ${out}`);
