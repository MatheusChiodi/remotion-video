// Baixa vozes neurais pt-BR (Piper/VITS em ONNX) para o motor TTS local
// Uso: node scripts/tts-setup.mjs [voz]   vozes: faber (padrão), cadu, jeff
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const MODELS_DIR = ".tts-models";
const voice = process.argv[2] ?? "faber";
const model = `vits-piper-pt_BR-${voice}-medium`;
const url = `https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/${model}.tar.bz2`;

if (existsSync(path.join(MODELS_DIR, model))) {
  console.log(`Voz ${voice} já instalada.`);
  process.exit(0);
}

await mkdir(MODELS_DIR, { recursive: true });
console.log(`Baixando ${url}`);
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar ${model}`);

const archive = path.join(MODELS_DIR, `${model}.tar.bz2`);
await writeFile(archive, Buffer.from(await res.arrayBuffer()));
execFileSync("tar", ["-xjf", archive, "-C", MODELS_DIR]);
await rm(archive);
console.log(`Voz ${voice} instalada em ${path.join(MODELS_DIR, model)}`);
