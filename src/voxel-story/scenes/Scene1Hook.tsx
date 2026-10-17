import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { portfolio } from "../data/portfolio";
import { clamp, palette } from "../theme";
import { sceneDurations } from "../timeline";
import { useLayout } from "../ui/layout";
import { TerminalLine } from "../ui/TerminalLine";
import { buildTerrain, buildTower, TOWER_TERRAIN } from "../voxel/builders";
import { orbitPose } from "../voxel/camera";
import { Rising } from "../voxel/Particles";
import { Stage } from "../voxel/Stage";
import { Ground, VoxelWorld, type Block } from "../voxel/VoxelWorld";

const DURATION = sceneDurations[0];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical } = useLayout();
  const { terminal, blinkFrames } = portfolio.hook;

  const terrain = useMemo(() => buildTerrain(TOWER_TERRAIN), []);
  const tower = useMemo(() => buildTower(), []);

  const alarmOn = Math.floor(frame / blinkFrames) % 2 === 0;
  const towerBlocks = useMemo<Block[]>(
    () =>
      tower.map((cell) => ({
        x: cell.x,
        y: cell.y,
        z: cell.z,
        type:
          cell.kind === "plinth"
            ? "stone"
            : cell.kind === "server"
              ? "server"
              : alarmOn
                ? "serverAlertOn"
                : "serverAlertOff",
      })),
    [tower, alarmOn],
  );

  const pose = orbitPose({
    target: [0, vertical ? 5.5 : 5.8, 0],
    distance: interpolate(frame, [0, DURATION], vertical ? [38, 33] : [35, 31], clamp),
    azimuth: interpolate(frame, [0, DURATION], [36, 20], clamp),
    elevation: 12,
  });

  return (
    <AbsoluteFill>
      <Stage
        sky={{
          stops: [palette.nightTop, palette.nightBottom],
          toHorizon: true,
          stars: 1,
        }}
        pose={pose}
        ambient={{ color: "#8F9BE8", intensity: 1.5 }}
        sun={{ color: "#B9C4FF", intensity: 1.6, position: [-8, 14, 10] }}
        fog={{ color: palette.nightBottom, near: 36, far: 95 }}
      >
        <pointLight
          color={palette.accent}
          intensity={alarmOn ? 26 : 8}
          position={[3.5, 8, 4.5]}
          distance={26}
          decay={1}
        />
        <Ground />
        <VoxelWorld blocks={terrain} />
        <VoxelWorld blocks={towerBlocks} />
        <Rising
          frame={frame}
          seed="hook"
          center={[0, 1, 0]}
          type={`glow:${palette.accent}`}
        />
      </Stage>
      <TerminalLine line={terminal} />
    </AbsoluteFill>
  );
};
