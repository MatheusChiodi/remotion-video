import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { portfolio } from "../data/portfolio";
import { clamp, palette, pop, pulse } from "../theme";
import { sceneDurations } from "../timeline";
import { Caption } from "../ui/Caption";
import { Hotbar } from "../ui/Hotbar";
import { ICONS, iconColor } from "../ui/icons";
import { useLayout } from "../ui/layout";
import { Avatar } from "../voxel/Avatar";
import { bitmapToBlocks, buildTerrain, ringRelief } from "../voxel/builders";
import { orbitPose } from "../voxel/camera";
import { Stage } from "../voxel/Stage";
import { Ground, VoxelWorld, type Block } from "../voxel/VoxelWorld";

const DURATION = sceneDurations[4];
const CELL = 0.21;

const BENCH: Block[] = [
  { x: 1, y: 1, z: 0, type: "planks" },
  { x: 2, y: 1, z: 0, type: "planks" },
  { x: 3, y: 1, z: 0, type: "stone" },
];

export const Scene5Side: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, fps } = useLayout();
  const { fill, highlight, items, caption } = portfolio.side;

  const terrain = useMemo(
    () => buildTerrain({
        radius: 40,
        seed: "side",
        maxHeight: 5,
        relief: ringRelief(18),
      }),
    [],
  );
  const sculptures = useMemo(
    () => items.map((item) => bitmapToBlocks(ICONS[item.icon], iconColor, CELL)),
    [items],
  );

  const selected =
    frame < highlight.start
      ? -1
      : Math.min(
          items.length - 1,
          Math.floor((frame - highlight.start) / highlight.framesPerItem),
        );
  const selectedSince = highlight.start + selected * highlight.framesPerItem;
  const grow = selected >= 0 ? pop(frame, selectedSince, fps) : 0;

  const pose = orbitPose({
    target: vertical ? [1.2, 2.4, 0] : [1.2, 2.5, 0],
    distance: interpolate(frame, [0, DURATION], vertical ? [20, 18] : [16.5, 15], clamp),
    azimuth: interpolate(frame, [0, DURATION], [18, 8], clamp),
    elevation: 9,
  });

  return (
    <AbsoluteFill>
      <Stage
        sky={{
          stops: [palette.nightTop, palette.preDawnBottom],
          toHorizon: true,
          stars: 0.8,
        }}
        pose={pose}
        ambient={{ color: "#B0B4F0", intensity: 1.8 }}
        sun={{ color: "#E4DCFF", intensity: 1.9, position: [-6, 12, 10] }}
        fog={{ color: palette.preDawnBottom, near: 30, far: 85 }}
      >
        <pointLight
          color="#FFE2B0"
          intensity={8}
          position={[2, 4, 3]}
          distance={14}
          decay={1}
        />
        <Ground />
        <VoxelWorld blocks={terrain} />
        <VoxelWorld blocks={BENCH} />
        <Avatar
          position={[-0.6, 0.5, 0.2]}
          rotationY={Math.PI / 2 - 0.55}
          armAction={
            selected >= 0 ? 0.45 + 0.4 * pulse(frame, selectedSince + 3, 5) : 0
          }
        />
        {selected >= 0 ? (
          <group
            position={[2, 3.4 + Math.sin(frame / 14) * 0.08, 0]}
            rotation={[0, Math.sin(frame / 22) * 0.4, 0]}
            scale={grow}
          >
            <VoxelWorld blocks={sculptures[selected]} />
          </group>
        ) : null}
      </Stage>
      <Caption line={caption} sceneEnd={DURATION} position="top" />
      <Hotbar
        items={items}
        fill={fill}
        selected={selected}
        selectedSince={selectedSince}
      />
    </AbsoluteFill>
  );
};
