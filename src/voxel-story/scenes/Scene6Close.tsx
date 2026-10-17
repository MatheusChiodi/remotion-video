import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { portfolio } from "../data/portfolio";
import { easeInOut, fonts, palette, progress } from "../theme";
import { SAFE, snap, splitAccent, useLayout } from "../ui/layout";
import { PixelPanel } from "../ui/PixelPanel";
import { TerminalLine } from "../ui/TerminalLine";
import { buildTerrain, buildTower, TOWER_TERRAIN } from "../voxel/builders";
import {
  mixPose,
  orbitPose,
  projectToScreen,
  type CameraPose,
  type Vec3,
} from "../voxel/camera";
import { Stage } from "../voxel/Stage";
import { VoxelText } from "../voxel/VoxelText";
import { Ground, VoxelWorld, type Block } from "../voxel/VoxelWorld";

const DAWN_VIOLET = "#7B5C9E";

export const Scene6Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, width, height, unit, maxWidth } = useLayout();
  const { brand, close } = portfolio;
  const { sunrise, greenWave, terminal, cameraPull, logo } = close;

  const terrain = useMemo(() => buildTerrain(TOWER_TERRAIN), []);
  const tower = useMemo(() => buildTower(), []);

  const greenLayers = Math.floor(
    (frame - greenWave.start) / greenWave.framesPerLayer,
  );
  const towerBlocks = useMemo<Block[]>(
    () =>
      tower.map((cell) => {
        const green = cell.y - 2 <= greenLayers;
        const type =
          cell.kind === "plinth"
            ? "stone"
            : cell.kind === "server"
              ? green
                ? "serverGreen"
                : "server"
              : green
                ? "serverOk"
                : "serverAlertOff";
        return { x: cell.x, y: cell.y, z: cell.z, type };
      }),
    [tower, greenLayers],
  );

  const dawn = progress(frame, sunrise[0], sunrise[1], easeInOut);
  const blend = (from: string, to: string) =>
    interpolateColors(dawn, [0, 1], [from, to]);

  // Paisagem: logo ao centro e torre à direita, câmera rente ao chão.
  // Vertical: logo menor à frente e a torre subindo atrás dele.
  const blockSize = vertical ? 0.5 : 1;
  const logoOrigin: Vec3 = vertical ? [0, 0.5, 14] : [-26, 0.5, 14];
  const sunWorld: Vec3 = vertical ? [52, 0.5, -400] : [186, 0.5, -400];

  const start = orbitPose({
    target: [0, vertical ? 5.5 : 5.8, 0],
    distance: vertical ? 33 : 31,
    azimuth: 20,
    elevation: 12,
  });
  const end: CameraPose = vertical
    ? orbitPose({
        target: [logoOrigin[0], 3.6, logoOrigin[2]],
        distance: 43,
        azimuth: 0,
        elevation: 11,
      })
    : {
        position: [logoOrigin[0], 1.3, logoOrigin[2] + 40],
        target: [logoOrigin[0], 2.9, logoOrigin[2]],
        fov: 40,
      };
  const pose = mixPose(
    start,
    end,
    progress(frame, cameraPull[0], cameraPull[1], easeInOut),
  );

  const sunAnchor = projectToScreen(pose, sunWorld, width, height);
  const sunSize = 150 * unit;
  const logoBottom = projectToScreen(end, logoOrigin, width, height);

  const subtitleIn = progress(frame, close.subtitleFrom, close.subtitleFrom + 12);
  const linksIn = progress(frame, close.linksFrom, close.linksFrom + 12);

  return (
    <AbsoluteFill>
      <Stage
        sky={{
          stops: [
            blend(palette.nightTop, palette.dawnTop),
            blend(palette.nightTop, DAWN_VIOLET),
            blend(palette.nightBottom, palette.dawnMid),
            blend(palette.nightBottom, palette.dawnBottom),
          ],
          positions: [0, 0.5, 0.86, 1],
          toHorizon: true,
          stars: 1 - dawn,
          sun: {
            x: sunAnchor.x,
            y: sunAnchor.y + interpolate(dawn, [0, 1], [sunSize, -sunSize * 0.3]),
            size: sunSize,
          },
        }}
        pose={pose}
        ambient={{
          color: blend("#8F9BE8", "#FFE9DC"),
          intensity: interpolate(dawn, [0, 1], [1.5, 2]),
        }}
        sun={{
          color: blend("#B9C4FF", "#FFD2A6"),
          intensity: interpolate(dawn, [0, 1], [1.6, 2.2]),
          position: [10, 12, 8],
        }}
        fog={{
          color: blend(palette.nightBottom, palette.dawnBottom),
          near: 70,
          far: 240,
        }}
      >
        <Ground />
        <VoxelWorld blocks={terrain} />
        <VoxelWorld blocks={towerBlocks} />
        <VoxelText
          text={brand.name}
          frame={frame}
          start={logo.start}
          framesPerColumn={logo.framesPerColumn}
          fallFrames={logo.fallFrames}
          origin={logoOrigin}
          blockSize={blockSize}
          accentLetters={brand.accentLetters}
          accentType={`face:${palette.accent}`}
          baseType={`face:${palette.text}`}
        />
      </Stage>

      <TerminalLine line={terminal} accentColor={palette.ok} exit />

      <div
        style={{
          position: "absolute",
          left: SAFE,
          right: SAFE,
          top: logoBottom.y + 54 * unit,
          display: "flex",
          justifyContent: "center",
          opacity: subtitleIn,
          transform: `translateY(${snap((1 - subtitleIn) * 28)}px)`,
        }}
      >
        <PixelPanel
          padding={`${24 * unit}px ${34 * unit}px`}
          style={{ maxWidth, textAlign: "center" }}
        >
          <div
            style={{
              fontFamily: fonts.title,
              fontSize: (vertical ? 28 : 30) * unit,
              lineHeight: 1.5,
              color: palette.text,
            }}
          >
            {splitAccent(brand.subtitle).map((segment, i) => (
              <span
                key={i}
                style={{
                  color: segment.accent ? palette.accent : undefined,
                  display: vertical && segment.accent ? "block" : undefined,
                }}
              >
                {segment.text}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: 18 * unit,
              paddingTop: 18 * unit,
              borderTop: `4px solid ${palette.panelInner}`,
              display: "flex",
              flexDirection: vertical ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: vertical ? 10 : 40 * unit,
              fontFamily: fonts.mono,
              fontSize: (vertical ? 52 : 38) * unit,
              lineHeight: 1,
              color: palette.text,
              whiteSpace: "nowrap",
              opacity: linksIn,
            }}
          >
            {brand.links.map((link) => (
              <div key={link}>{link}</div>
            ))}
          </div>
        </PixelPanel>
      </div>
    </AbsoluteFill>
  );
};
