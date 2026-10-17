import React from "react";
import { random } from "remotion";
import { portfolio } from "../data/portfolio";
import type { Vec3 } from "./camera";
import { getMaterial } from "./textures";

const ACCENT = `solid:${portfolio.brand.colors.accent}`;

type PartProps = {
  size: Vec3;
  position: Vec3;
  texture: string | string[];
  assemble: number;
  seed: string;
};

// Durante o spawn cada parte chega de um ponto espalhado e cresce até o lugar.
const Part: React.FC<PartProps> = ({
  size,
  position,
  texture,
  assemble,
  seed,
}) => {
  const scatter = 1 - assemble;
  const offset: Vec3 = [
    (random(`${seed}-x`) - 0.5) * 5 * scatter,
    (random(`${seed}-y`) * 3 + 1) * scatter,
    (random(`${seed}-z`) - 0.5) * 5 * scatter,
  ];
  const material = Array.isArray(texture)
    ? texture.map((key) => getMaterial(key))
    : getMaterial(texture);

  return (
    <mesh
      position={[
        position[0] + offset[0],
        position[1] + offset[1],
        position[2] + offset[2],
      ]}
      rotation={[scatter * 3, scatter * 4, 0]}
      scale={Math.max(0.001, assemble)}
      material={material}
    >
      <boxGeometry args={size} />
    </mesh>
  );
};

export type AvatarProps = {
  position: Vec3;
  rotationY?: number;
  walkPhase?: number;
  walkAmount?: number;
  armAction?: number;
  assemble?: number;
  scale?: number;
};

export const AVATAR_HEIGHT = 1.9;

export const Avatar: React.FC<AvatarProps> = ({
  position,
  rotationY = 0,
  walkPhase = 0,
  walkAmount = 0,
  armAction = 0,
  assemble = 1,
  scale = 1,
}) => {
  const swing = Math.sin(walkPhase) * walkAmount;
  const bob = Math.abs(Math.sin(walkPhase)) * 0.05 * walkAmount;
  const rightArm = swing * 0.7 * (1 - armAction) - armAction * 2.3;

  return (
    <group
      position={[position[0], position[1] + bob * scale, position[2]]}
      rotation={[0, rotationY, 0]}
      scale={scale}
    >
      <group position={[-0.15, 0.55, 0]} rotation={[swing * 0.8, 0, 0]}>
        <Part
          size={[0.27, 0.55, 0.27]}
          position={[0, -0.275, 0]}
          texture="pants"
          assemble={assemble}
          seed="leg-l"
        />
      </group>
      <group position={[0.15, 0.55, 0]} rotation={[-swing * 0.8, 0, 0]}>
        <Part
          size={[0.27, 0.55, 0.27]}
          position={[0, -0.275, 0]}
          texture="pants"
          assemble={assemble}
          seed="leg-r"
        />
      </group>

      <Part
        size={[0.6, 0.6, 0.34]}
        position={[0, 0.85, 0]}
        texture={[
          "hoodie",
          "hoodie",
          "hoodie",
          "hoodie",
          "hoodieFront",
          "hoodie",
        ]}
        assemble={assemble}
        seed="torso"
      />
      <Part
        size={[0.5, 0.2, 0.16]}
        position={[0, 1.1, -0.22]}
        texture="hoodie"
        assemble={assemble}
        seed="hood"
      />

      <group position={[-0.41, 1.12, 0]} rotation={[-swing * 0.7, 0, 0]}>
        <Part
          size={[0.2, 0.58, 0.24]}
          position={[0, -0.24, 0]}
          texture="hoodie"
          assemble={assemble}
          seed="arm-l"
        />
      </group>
      <group position={[0.41, 1.12, 0]} rotation={[rightArm, 0, 0]}>
        <Part
          size={[0.2, 0.58, 0.24]}
          position={[0, -0.24, 0]}
          texture="hoodie"
          assemble={assemble}
          seed="arm-r"
        />
      </group>

      <Part
        size={[0.72, 0.72, 0.72]}
        position={[0, 1.51, 0]}
        texture={["headSide", "headSide", "hair", "skin", "face", "headBack"]}
        assemble={assemble}
        seed="head"
      />
      <Part
        size={[0.84, 0.08, 0.16]}
        position={[0, 1.91, 0]}
        texture={ACCENT}
        assemble={assemble}
        seed="band"
      />
      <Part
        size={[0.1, 0.32, 0.32]}
        position={[-0.41, 1.5, 0]}
        texture={ACCENT}
        assemble={assemble}
        seed="cup-l"
      />
      <Part
        size={[0.1, 0.32, 0.32]}
        position={[0.41, 1.5, 0]}
        texture={ACCENT}
        assemble={assemble}
        seed="cup-r"
      />
    </group>
  );
};
