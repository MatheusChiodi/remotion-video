import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { portfolio } from "../data/portfolio";
import { clamp, easeInOut, fonts, palette, pop, progress, pulse } from "../theme";
import { sceneDurations } from "../timeline";
import { Caption } from "../ui/Caption";
import { SAFE, snap, useLayout } from "../ui/layout";
import { PixelPanel } from "../ui/PixelPanel";
import { Avatar } from "../voxel/Avatar";
import { hash3 } from "../voxel/builders";
import { mixPose, projectToScreen, type CameraPose } from "../voxel/camera";
import { Burst } from "../voxel/Particles";
import { Stage } from "../voxel/Stage";
import { VoxelWorld, type Block } from "../voxel/VoxelWorld";

const DURATION = sceneDurations[2];
const SURFACE_Y = 10;
const CEILING_Y = 8;
const FRONT_Z = 3;
const BACK_Z = -1;
const ORE_Y = 4;
const AVATAR_Z = 1.3;
const ITEM_Y = 5.4;

const rockAt = (x: number, y: number) => {
  if (y === SURFACE_Y) {
    return "grass";
  }
  if (y >= SURFACE_Y - 2) {
    return "dirt";
  }
  const boundary = SURFACE_Y - 4 + Math.round(hash3("strata", x, y, 0));
  return y >= boundary ? "stone" : "deepstone";
};

// Corte em diorama: só as faces visíveis da rocha e da câmara são geradas.
const buildCave = (halfWidth: number): Block[] => {
  const blocks: Block[] = [];
  const inside = (x: number, y: number) =>
    Math.abs(x) <= halfWidth && y >= 1 && y < CEILING_Y;

  for (let x = -24; x <= 24; x++) {
    for (let y = -13; y <= SURFACE_Y; y++) {
      if (!inside(x, y)) {
        blocks.push({ x, y, z: FRONT_Z, type: rockAt(x, y) });
      }
    }
    for (let z = FRONT_Z - 1; z >= -14; z--) {
      blocks.push({ x, y: SURFACE_Y, z, type: "grass" });
    }
  }
  for (let x = -halfWidth; x <= halfWidth; x++) {
    for (let y = 1; y < CEILING_Y; y++) {
      blocks.push({ x, y, z: BACK_Z, type: "deepstone" });
    }
    for (let z = BACK_Z + 1; z < FRONT_Z; z++) {
      blocks.push({ x, y: 0, z, type: "deepstone" });
      blocks.push({ x, y: CEILING_Y, z, type: "deepstone" });
    }
  }
  for (let y = 1; y < CEILING_Y; y++) {
    for (let z = BACK_Z + 1; z < FRONT_Z; z++) {
      blocks.push({ x: -halfWidth - 1, y, z, type: "deepstone" });
      blocks.push({ x: halfWidth + 1, y, z, type: "deepstone" });
    }
  }
  return blocks;
};

export const Scene3Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, fps, width, height, unit } = useLayout();
  const { descend, walkStart, ores, errorFix, stack, caption, footer } =
    portfolio.turn;

  const spacing = vertical ? 2 : 3;
  const halfWidth = vertical ? 10 : 13;
  const oreX = stack.map((_, i) => (i - (stack.length - 1) / 2) * spacing);
  const errorX = oreX[oreX.length - 1] + spacing;
  const startX = oreX[0] - spacing;
  const breakAt = stack.map((_, i) => ores.firstBreak + i * ores.stagger);

  const cave = useMemo(() => buildCave(halfWidth), [halfWidth]);
  const centerX = (startX + errorX) / 2;

  const avatarX = interpolate(
    frame,
    [walkStart, ...breakAt, errorFix],
    [startX, ...oreX.map((x) => x - 0.5), errorX - 1.25],
    clamp,
  );
  const walkAmount =
    progress(frame, walkStart, walkStart + 8) *
    (1 - progress(frame, errorFix - 8, errorFix));
  const armAction = Math.max(
    ...breakAt.map((at) => pulse(frame, at - 1, 6)),
    pulse(frame, errorFix - 1, 6),
  );

  const wall: Block[] = oreX.map((x, i) => ({
    x,
    y: ORE_Y,
    z: BACK_Z + 0.02,
    type: frame >= breakAt[i] ? "cavity" : `ore:${stack[i].color}`,
    scale: 1.02,
  }));

  const itemPosition = (i: number): [number, number, number] => {
    const age = frame - breakAt[i];
    const rise = progress(frame, breakAt[i], breakAt[i] + 14);
    return [
      oreX[i],
      interpolate(rise, [0, 1], [ORE_Y, ITEM_Y]) + Math.sin(age / 9) * 0.1,
      interpolate(rise, [0, 1], [BACK_Z + 0.6, AVATAR_Z]),
    ];
  };

  const items: Block[] = [];
  stack.forEach((entry, i) => {
    if (frame >= breakAt[i]) {
      const [x, y, z] = itemPosition(i);
      items.push({
        x,
        y,
        z,
        type: `glow:${entry.color}`,
        scale: 0.52 * pop(frame, breakAt[i], fps),
        rotY: (frame - breakAt[i]) * 0.07,
      });
    }
  });

  const fixed = frame >= errorFix;
  const errorBlock: Block = {
    x: errorX,
    y: 1,
    z: AVATAR_Z,
    type: fixed ? "ok" : "alert",
    scale: fixed
      ? 0.7 + 0.3 * pop(frame, errorFix, fps)
      : 1 + 0.05 * Math.sin(frame / 3),
  };

  const camY = interpolate(frame, descend, [14, 3.9], {
    ...clamp,
    easing: easeInOut,
  });
  // Em paisagem a câmera acompanha o avatar de leve, para o plano não ficar parado.
  const wideX = vertical ? centerX + 0.5 : centerX + (avatarX - centerX) * 0.1;
  const wide: CameraPose = {
    position: [wideX, camY + 0.8, vertical ? 37 : 20.5],
    target: [wideX, camY + (vertical ? -1.5 : -1.1), 0],
    fov: 40,
  };
  const follow: CameraPose = {
    position: [avatarX - 1, camY + 0.8, 21],
    target: [avatarX - 1, camY - 0.8, 0],
    fov: 40,
  };
  const pose = vertical
    ? mixPose(follow, wide, progress(frame, errorFix + 2, errorFix + 22, easeInOut))
    : wide;

  const labelSize = 50 * unit;

  return (
    <AbsoluteFill>
      <Stage
        sky={{ stops: [palette.dayTop, palette.dayBottom] }}
        pose={pose}
        ambient={{ color: "#9AA3E0", intensity: 1.25 }}
        sun={{ color: "#C9D2FF", intensity: 1.5, position: [4, 10, 14] }}
      >
        <pointLight
          color="#FFD9A0"
          intensity={18}
          position={[avatarX + 0.6, 3.6, 2.6]}
          distance={16}
          decay={1}
        />
        <VoxelWorld blocks={cave} />
        <VoxelWorld blocks={wall} />
        <VoxelWorld blocks={items} />
        <VoxelWorld blocks={[errorBlock]} />
        <Avatar
          position={[avatarX, 0.5, AVATAR_Z]}
          rotationY={Math.PI / 2 - 0.45}
          walkPhase={(avatarX - startX) * 3.2}
          walkAmount={walkAmount}
          armAction={armAction}
        />
        {stack.map((entry, i) => (
          <Burst
            key={entry.label}
            frame={frame}
            start={breakAt[i]}
            seed={`ore-${i}`}
            origin={[oreX[i], ORE_Y, BACK_Z + 0.8]}
            type={`glow:${entry.color}`}
          />
        ))}
        <Burst
          frame={frame}
          start={errorFix}
          seed="error"
          origin={[errorX, 1.2, AVATAR_Z]}
          type={`glow:${palette.accent}`}
          count={18}
        />
      </Stage>

      {stack.map((entry, i) => {
        const at = breakAt[i] + 8;
        if (frame < at) {
          return null;
        }
        const enter = progress(frame, at, at + 8);
        const [x, y, z] = itemPosition(i);
        const anchor = projectToScreen(pose, [x, y + 0.6, z], width, height);
        const row = i % 2 === 0 ? 0 : labelSize * 1.7;
        // Rótulo que encostaria na borda some em vez de ser cortado pela câmera que segue o avatar.
        const half = (entry.label.length * labelSize * 0.4) / 2 + 30 * unit;
        const room = Math.min(anchor.x - half, width - anchor.x - half) - SAFE;
        const inside = interpolate(room, [0, 50], [0, 1], clamp);
        return (
          <div
            key={entry.label}
            style={{
              position: "absolute",
              left: anchor.x,
              top: anchor.y - row,
              transform: `translate(-50%, -100%) translateY(${snap((1 - enter) * 20)}px)`,
              opacity: enter * inside,
            }}
          >
            <PixelPanel
              border={4}
              padding={`${8 * unit}px ${16 * unit}px`}
              style={{
                fontFamily: fonts.mono,
                fontSize: labelSize,
                lineHeight: 1,
                color: entry.color,
                whiteSpace: "nowrap",
              }}
            >
              {entry.label}
            </PixelPanel>
          </div>
        );
      })}

      <Caption line={caption} sceneEnd={DURATION} footer={footer} />
    </AbsoluteFill>
  );
};
