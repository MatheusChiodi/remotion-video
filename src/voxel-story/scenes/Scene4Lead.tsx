import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { portfolio } from "../data/portfolio";
import {
  clamp,
  easeInOut,
  fonts,
  palette,
  pop,
  progress,
  swing,
} from "../theme";
import { sceneDurations } from "../timeline";
import { AchievementToast } from "../ui/AchievementToast";
import { Caption } from "../ui/Caption";
import { useLayout } from "../ui/layout";
import { PixelPanel } from "../ui/PixelPanel";
import { Avatar } from "../voxel/Avatar";
import { buildIsland, linePath } from "../voxel/builders";
import { orbitPose, projectToScreen } from "../voxel/camera";
import { Stage } from "../voxel/Stage";
import { VoxelWorld, type Block } from "../voxel/VoxelWorld";

const DURATION = sceneDurations[3];
const ISLAND_RADIUS = 3;
const HUB_RADIUS = 2;
const ACCENT_BLOCK = `solid:${palette.accent}`;

type Point = [number, number];

const DECOR: Block[][] = [
  [
    { x: 1, y: 1, z: -1, type: "server" },
    { x: 1, y: 2, z: -1, type: "serverGreen" },
  ],
  [
    { x: -1, y: 1, z: -1, type: "planks" },
    { x: 0, y: 1, z: -1, type: "planks" },
    { x: -1, y: 2, z: -1, type: "solid:#F2D06B" },
  ],
  [
    { x: 1, y: 1, z: -1, type: "stone" },
    { x: 1, y: 2, z: -1, type: "solid:#61DAFB" },
  ],
];

const bridgeCells = (island: Point, hub: Point) =>
  linePath(island, hub).filter(
    ([x, z]) =>
      Math.hypot(x - island[0], z - island[1]) > ISLAND_RADIUS + 0.3 &&
      Math.hypot(x - hub[0], z - hub[1]) > HUB_RADIUS + 0.3,
  );

export const Scene4Lead: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, fps, width, height, unit } = useLayout();
  const { islands, firstBridge, otherBridges, flag, caption, toast } =
    portfolio.lead;

  const hub: Point = useMemo(() => (vertical ? [0, 1] : [0, 2]), [vertical]);
  const centers: Point[] = useMemo(
    () =>
      vertical
        ? [
            [0, 12],
            [-5, -8],
            [5, -8],
          ]
        : [
            [-12, 3],
            [0, -9],
            [12, 3],
          ],
    [vertical],
  );

  const world = useMemo(() => {
    const blocks: Block[] = buildIsland(hub[0], hub[1], HUB_RADIUS, "stone");
    centers.forEach(([cx, cz], i) => {
      blocks.push(...buildIsland(cx, cz, ISLAND_RADIUS, "grass"));
      blocks.push(
        ...DECOR[i].map((block) => ({
          ...block,
          x: block.x + cx,
          z: block.z + cz,
        })),
      );
    });
    return blocks;
  }, [centers, hub]);

  const bridges = useMemo(
    () => centers.map((center) => bridgeCells(center, hub)),
    [centers, hub],
  );

  const bridgeBlocks: Block[] = [];
  bridges.forEach((cells, i) => {
    const [from, to] = i === 0 ? firstBridge : otherBridges;
    // A primeira ponte parte da ilha; as outras partem do centro, onde ele já está.
    const ordered = i === 0 ? cells : [...cells].reverse();
    const step = (to - from) / ordered.length;
    ordered.forEach(([x, z], n) => {
      const at = from + n * step;
      if (frame >= at) {
        const grow = pop(frame, at, fps);
        bridgeBlocks.push({
          x,
          y: (1 - grow) * 0.8,
          z,
          type: "planks",
          scale: grow,
        });
      }
    });
  });

  const flagCells: Block[] = [
    { x: 0, y: 1, z: 0, type: "stone" },
    { x: 0, y: 2, z: 0, type: "stone" },
    { x: 0, y: 3, z: 0, type: "stone" },
    { x: 0, y: 4, z: 0, type: "stone" },
    { x: 1, y: 4, z: 0, type: ACCENT_BLOCK },
    { x: 2, y: 4, z: 0, type: ACCENT_BLOCK },
    { x: 1, y: 3, z: 0, type: ACCENT_BLOCK },
    { x: 2, y: 3, z: 0, type: ACCENT_BLOCK },
  ];
  const flagStep = (flag[1] - flag[0]) / flagCells.length;
  const flagBlocks: Block[] = [];
  flagCells.forEach((block, n) => {
    const at = flag[0] + n * flagStep;
    if (frame >= at) {
      flagBlocks.push({
        ...block,
        x: block.x + hub[0],
        z: block.z + hub[1],
        scale: pop(frame, at, fps),
      });
    }
  });

  // Linha reta da ilha até o centro: seguir os degraus da ponte faria o avatar ziguezaguear.
  const from = centers[0];
  const to: Point = [hub[0] - 1, hub[1] + 1];
  const travel = progress(
    frame,
    firstBridge[0] - 6,
    firstBridge[1] + 8,
    easeInOut,
  );
  const avatarX = from[0] + (to[0] - from[0]) * travel;
  const avatarZ = from[1] + (to[1] - from[1]) * travel;
  const walkAmount = Math.min(1, Math.sin(travel * Math.PI) * 3);
  const arrived = progress(frame, firstBridge[1] + 4, firstBridge[1] + 14);
  const walkHeading = Math.atan2(to[0] - from[0], to[1] - from[1]);
  const heading = walkHeading + (0.5 - walkHeading) * arrived;
  const distance = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const buildingOthers =
    progress(frame, otherBridges[0], otherBridges[0] + 6) *
    (1 - progress(frame, flag[1] - 6, flag[1]));
  const armAction =
    walkAmount * 0.3 +
    buildingOthers * (0.3 + 0.6 * swing(frame - otherBridges[0], 10));

  const pose = orbitPose({
    target: vertical ? [0, 0, 2.5] : [0, 0, -1],
    distance: interpolate(frame, [0, DURATION], vertical ? [50, 46] : [33, 30], clamp),
    azimuth: interpolate(frame, [0, DURATION], [-7, 7], clamp),
    elevation: vertical ? 52 : 44,
  });

  return (
    <AbsoluteFill>
      <Stage
        sky={{ stops: [palette.nightTop, palette.duskBottom], stars: 0.9 }}
        pose={pose}
        ambient={{ color: "#AAB2F2", intensity: 1.9 }}
        sun={{ color: "#DCE0FF", intensity: 2.1, position: [-6, 16, 8] }}
      >
        <VoxelWorld blocks={world} />
        <VoxelWorld blocks={bridgeBlocks} />
        <VoxelWorld blocks={flagBlocks} />
        <Avatar
          position={[avatarX, 0.5, avatarZ]}
          rotationY={heading}
          walkPhase={travel * distance * 2.4}
          walkAmount={walkAmount}
          armAction={armAction}
          scale={1.35}
        />
      </Stage>

      {centers.map(([cx, cz], i) => {
        const at = 4 + i * 5;
        const enter = progress(frame, at, at + 10);
        const anchor = projectToScreen(pose, [cx, 3.6, cz], width, height);
        return (
          <div
            key={islands[i]}
            style={{
              position: "absolute",
              left: anchor.x,
              top: anchor.y,
              transform: "translate(-50%, -100%)",
              opacity: enter,
            }}
          >
            <PixelPanel
              border={4}
              padding={`${8 * unit}px ${16 * unit}px`}
              style={{
                fontFamily: fonts.mono,
                fontSize: 50 * unit,
                lineHeight: 1,
                color: palette.text,
                whiteSpace: "nowrap",
              }}
            >
              {islands[i]}
            </PixelPanel>
          </div>
        );
      })}

      <Caption line={caption} sceneEnd={DURATION} />
      {/* Em paisagem o centro do topo é da ilha "Produto"; o aviso vai para o canto. */}
      <AchievementToast {...toast} align={vertical ? "center" : "left"} />
    </AbsoluteFill>
  );
};
