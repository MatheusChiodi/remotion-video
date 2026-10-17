import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EmberDot } from "../components/Embers";
import { PunchTitle } from "../components/PunchTitle";
import { copy, palette } from "../fitforge";
import { CLAMP, Format, punch, useLayout } from "../theme";

const NOTE_COUNT = 7;
const COLUMNS = 4;
const SPARKS_PER_NOTE = 10;
const NOTE_COLORS = ["#ece4cf", "#f1e3a4", "#d8d2c4", "#e9dcc2"];
const SHUFFLE = [8, 24];
const BURN_START = 26;
const BURN_FRAMES = 12;
const TITLE_DELAY = 20;

type Area = { x: number; y: number; w: number; h: number };

const getAreas = (
  format: Format,
  width: number,
  height: number,
  safe: { x: number; y: number },
): { notes: Area; text: Area; noteScale: number; titleSize: number } => {
  const innerW = width - safe.x * 2;
  const innerH = height - safe.y * 2;
  if (format === "wide") {
    return {
      notes: { x: safe.x, y: safe.y + 40, w: innerW * 0.46, h: innerH - 80 },
      text: {
        x: safe.x + innerW * 0.52,
        y: safe.y,
        w: innerW * 0.48,
        h: innerH,
      },
      noteScale: 0.95,
      titleSize: 160,
    };
  }
  if (format === "square") {
    return {
      notes: { x: safe.x, y: safe.y, w: innerW, h: innerH * 0.52 },
      text: {
        x: safe.x,
        y: safe.y + innerH * 0.56,
        w: innerW,
        h: innerH * 0.44,
      },
      noteScale: 0.72,
      titleSize: 140,
    };
  }
  return {
    notes: { x: safe.x, y: safe.y + 60, w: innerW, h: innerH * 0.5 },
    text: { x: safe.x, y: safe.y + innerH * 0.55, w: innerW, h: innerH * 0.4 },
    noteScale: 1.05,
    titleSize: 170,
  };
};

const slotPosition = (slot: number, area: Area, seed: string) => {
  const rows = Math.ceil(NOTE_COUNT / COLUMNS);
  const col = slot % COLUMNS;
  const row = Math.floor(slot / COLUMNS);
  const inRow = row === rows - 1 ? NOTE_COUNT - row * COLUMNS : COLUMNS;
  return {
    x:
      area.x +
      ((col + 0.5) / inRow) * area.w +
      (random(`${seed}-x`) - 0.5) * 70,
    y:
      area.y + ((row + 0.5) / rows) * area.h + (random(`${seed}-y`) - 0.5) * 90,
  };
};

export const Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { format, width, height, safe } = useLayout();
  const {
    notes: area,
    text,
    noteScale,
    titleSize,
  } = getAreas(format, width, height, safe);

  const notes = new Array(NOTE_COUNT).fill(0).map((_, i) => ({
    from: slotPosition(i, area, `note-from-${i}`),
    to: slotPosition((i + 3) % NOTE_COUNT, area, `note-to-${i}`),
    rotFrom: (random(`note-r0-${i}`) - 0.5) * 34,
    rotTo: (random(`note-r1-${i}`) - 0.5) * 34,
    w: (200 + random(`note-w-${i}`) * 60) * noteScale,
    h: (240 + random(`note-h-${i}`) * 70) * noteScale,
    color: NOTE_COLORS[i % NOTE_COLORS.length],
    lines: new Array(5)
      .fill(0)
      .map((__, l) => 40 + random(`note-l-${i}-${l}`) * 55),
  }));

  const shuffle = interpolate(frame, SHUFFLE, [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {notes.map((note, i) => {
        const burnStart = BURN_START + i * 2;
        const burn = interpolate(
          frame,
          [burnStart, burnStart + BURN_FRAMES],
          [0, 1],
          CLAMP,
        );
        const pop = punch(frame, fps, i * 1.5);
        const x = interpolate(shuffle, [0, 1], [note.from.x, note.to.x]);
        const y = interpolate(shuffle, [0, 1], [note.from.y, note.to.y]);
        const rotation = interpolate(
          shuffle,
          [0, 1],
          [note.rotFrom, note.rotTo],
        );

        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: x - note.w / 2,
                top: y - note.h / 2,
                width: note.w,
                height: note.h,
                padding: note.w * 0.12,
                borderRadius: 10,
                backgroundColor: note.color,
                boxShadow: `0 18px 40px -12px rgba(0,0,0,0.7), inset 0 0 ${burn * 90}px ${burn * 50}px ${palette.ember}`,
                opacity: Math.min(1, pop * 2) * (1 - burn),
                transform: `rotate(${rotation}deg) scale(${pop * (1 - burn * 0.2)})`,
                display: "flex",
                flexDirection: "column",
                gap: note.h * 0.07,
              }}
            >
              {note.lines.map((lineWidth, l) => (
                <div
                  key={l}
                  style={{
                    width: `${lineWidth}%`,
                    height: note.h * 0.045,
                    borderRadius: 99,
                    backgroundColor: "rgba(40, 34, 28, 0.42)",
                  }}
                />
              ))}
            </div>
            {new Array(SPARKS_PER_NOTE).fill(0).map((_, s) => {
              const seed = `spark-${i}-${s}`;
              const age = frame - burnStart - random(`${seed}-b`) * 8;
              const life = 18 + random(`${seed}-l`) * 14;
              if (age < 0 || age > life) {
                return null;
              }
              const drift = random(`${seed}-d`) - 0.5;
              return (
                <EmberDot
                  key={s}
                  x={x + (random(`${seed}-x`) - 0.5) * note.w + drift * age * 7}
                  y={
                    y +
                    (random(`${seed}-y`) - 0.5) * note.h -
                    age * (5 + random(`${seed}-v`) * 9)
                  }
                  size={5 + random(`${seed}-s`) * 7}
                  opacity={1 - age / life}
                />
              );
            })}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: text.x,
          top: text.y,
          width: text.w,
          height: text.h,
          display: "flex",
          alignItems: "center",
          justifyContent: format === "wide" ? "flex-start" : "center",
        }}
      >
        <PunchTitle
          line={copy.pain}
          size={titleSize}
          delay={TITLE_DELAY}
          stagger={4}
          align={format === "wide" ? "left" : "center"}
        />
      </div>
    </AbsoluteFill>
  );
};
