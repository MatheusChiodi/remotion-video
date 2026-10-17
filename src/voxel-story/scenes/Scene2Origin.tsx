import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { portfolio } from "../data/portfolio";
import { clamp, easeInOut, palette, pop, progress, swing } from "../theme";
import { sceneDurations } from "../timeline";
import { AchievementToast } from "../ui/AchievementToast";
import { Caption } from "../ui/Caption";
import { useLayout } from "../ui/layout";
import { Avatar } from "../voxel/Avatar";
import { buildTerrain, ringRelief } from "../voxel/builders";
import { mixPose, orbitPose } from "../voxel/camera";
import { Burst } from "../voxel/Particles";
import { Stage } from "../voxel/Stage";
import { Ground, VoxelWorld, type Block } from "../voxel/VoxelWorld";

const DURATION = sceneDurations[1];
const SPAWN_X = -4.5;
const BUILD_X = -0.9;
const ACCENT_BLOCK = `solid:${palette.accent}`;

const buildBase = (): Block[] => {
  const blocks: Block[] = [];
  for (let y = 1; y <= 2; y++) {
    for (let x = 1; x <= 5; x++) {
      for (let z = -2; z <= 1; z++) {
        const edgeX = x === 1 || x === 5;
        const edgeZ = z === -2 || z === 1;
        const door = x === 3 && z === 1;
        if ((!edgeX && !edgeZ) || door) {
          continue;
        }
        blocks.push({ x, y, z, type: edgeX && edgeZ ? "stone" : "planks" });
      }
    }
  }
  blocks.push({ x: 3, y: 3, z: 1, type: "planks" });
  blocks.push({ x: 1, y: 3, z: 1, type: ACCENT_BLOCK });
  return blocks;
};

export const Scene2Origin: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, fps } = useLayout();
  const { spawn, walk, build, captions, toast } = portfolio.origin;

  const terrain = useMemo(
    () => buildTerrain({
        radius: 40,
        seed: "origin",
        maxHeight: 5,
        relief: ringRelief(17),
      }),
    [],
  );
  const base = useMemo(buildBase, []);

  const placed: Block[] = [];
  base.forEach((block, i) => {
    const at = build.start + i * build.framesPerBlock;
    if (frame >= at) {
      const grow = pop(frame, at, fps);
      placed.push({ ...block, y: block.y + (1 - grow) * 0.5, scale: grow });
    }
  });

  const buildEnd = build.start + base.length * build.framesPerBlock;
  const building = frame >= build.start && frame < buildEnd;
  const assemble = progress(frame, spawn[0], spawn[1]);
  const walked = progress(frame, walk[0], walk[1], easeInOut);
  const turn = progress(frame, spawn[1], walk[0] + 4, easeInOut);
  const avatarX = interpolate(walked, [0, 1], [SPAWN_X, BUILD_X]);
  const armAction = building
    ? 0.3 + 0.6 * swing(frame - build.start, 8)
    : 0;

  const close = orbitPose({
    target: [SPAWN_X, 1.3, 0],
    distance: vertical ? 13 : 10,
    azimuth: 22,
    elevation: 10,
  });
  const wide = orbitPose({
    target: vertical ? [2.5, 1.2, 0] : [1.7, 1.5, 0],
    distance: vertical ? 23 : 13.5,
    azimuth: 24,
    elevation: 14,
  });
  const pose = mixPose(close, wide, progress(frame, 30, 72, easeInOut));

  return (
    <AbsoluteFill>
      <Stage
        sky={{ stops: [palette.dayTop, palette.dayBottom], toHorizon: true }}
        pose={pose}
        ambient={{ color: "#FFFFFF", intensity: 2.1 }}
        sun={{ color: "#FFF4DD", intensity: 2.4, position: [8, 14, 9] }}
        fog={{ color: palette.dayBottom, near: 34, far: 90 }}
      >
        <Ground />
        <VoxelWorld blocks={terrain} />
        <VoxelWorld blocks={placed} />
        <Avatar
          position={[avatarX, 0.5, 0]}
          rotationY={interpolate(turn, [0, 1], [0.35, Math.PI / 2 - 0.25])}
          walkPhase={(avatarX - SPAWN_X) * 3.4}
          walkAmount={Math.min(1, Math.sin(walked * Math.PI) * 3)}
          armAction={armAction}
          assemble={assemble}
        />
        <Burst
          frame={frame}
          start={spawn[0]}
          seed="spawn-a"
          origin={[SPAWN_X, 1.4, 0]}
          type={`glow:${palette.text}`}
          count={22}
          life={30}
          gravity={0.004}
          speed={0.13}
        />
        <Burst
          frame={frame}
          start={spawn[1] - 6}
          seed="spawn-b"
          origin={[SPAWN_X, 1.2, 0]}
          type={`glow:${palette.accent}`}
          count={10}
          life={22}
        />
      </Stage>
      {captions.map((line) => (
        <Caption key={line.text} line={line} sceneEnd={DURATION} />
      ))}
      <AchievementToast {...toast} />
      <AbsoluteFill
        style={{
          background: palette.text,
          opacity: interpolate(frame, [0, 10], [0.55, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
