import React from "react";
import { random } from "remotion";
import type { Vec3 } from "./camera";
import { VoxelWorld, type Block } from "./VoxelWorld";

export const Burst: React.FC<{
  frame: number;
  start: number;
  seed: string;
  origin: Vec3;
  type: string;
  count?: number;
  speed?: number;
  gravity?: number;
  life?: number;
  size?: number;
}> = ({
  frame,
  start,
  seed,
  origin,
  type,
  count = 14,
  speed = 0.16,
  gravity = 0.012,
  life = 24,
  size = 0.2,
}) => {
  const age = frame - start;
  if (age < 0 || age > life) {
    return null;
  }
  const fade = 1 - age / life;
  const blocks: Block[] = new Array(count).fill(0).map((_, i) => {
    const angle = random(`${seed}-a-${i}`) * Math.PI * 2;
    const lift = 0.4 + random(`${seed}-l-${i}`) * 1.1;
    const velocity = speed * (0.5 + random(`${seed}-v-${i}`));
    return {
      x: origin[0] + Math.cos(angle) * velocity * age,
      y: origin[1] + lift * speed * age - gravity * age * age,
      z: origin[2] + Math.sin(angle) * velocity * age * 0.6,
      type,
      scale: size * fade,
      rotY: age * 0.2 + i,
    };
  });
  return <VoxelWorld blocks={blocks} />;
};

export const Rising: React.FC<{
  frame: number;
  seed: string;
  center: Vec3;
  type: string;
  count?: number;
  radius?: number;
  height?: number;
  speed?: number;
  size?: number;
  intensity?: number;
}> = ({
  frame,
  seed,
  center,
  type,
  count = 24,
  radius = 3.4,
  height = 16,
  speed = 0.09,
  size = 0.22,
  intensity = 1,
}) => {
  if (intensity <= 0) {
    return null;
  }
  const blocks: Block[] = new Array(count).fill(0).map((_, i) => {
    const angle = random(`${seed}-a-${i}`) * Math.PI * 2;
    const distance = 1.8 + random(`${seed}-d-${i}`) * radius;
    const travel =
      (frame * speed * (0.6 + random(`${seed}-s-${i}`) * 0.8) +
        random(`${seed}-p-${i}`) * height) %
      height;
    const life = travel / height;
    return {
      x: center[0] + Math.cos(angle + frame * 0.01) * distance,
      y: center[1] + travel,
      z: center[2] + Math.sin(angle + frame * 0.01) * distance,
      type,
      scale: size * Math.sin(life * Math.PI) * intensity,
      rotY: frame * 0.05 + i,
    };
  });
  return <VoxelWorld blocks={blocks} />;
};
