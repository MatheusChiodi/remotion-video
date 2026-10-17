import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { getBlockMaterial, getTexture } from "./textures";

export type Block = {
  x: number;
  y: number;
  z: number;
  type: string;
  scale?: number;
  rotY?: number;
};

let sharedGeometry: THREE.BoxGeometry | null = null;
const getGeometry = () => {
  if (!sharedGeometry) {
    sharedGeometry = new THREE.BoxGeometry(1, 1, 1);
  }
  return sharedGeometry;
};

const capacityFor = (count: number) => {
  let capacity = 16;
  while (capacity < count) {
    capacity *= 2;
  }
  return capacity;
};

const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

const BlockBatch: React.FC<{ type: string; blocks: Block[] }> = ({
  type,
  blocks,
}) => {
  const capacity = capacityFor(blocks.length);

  const mesh = useMemo(() => {
    const instanced = new THREE.InstancedMesh(
      getGeometry(),
      getBlockMaterial(type),
      capacity,
    );
    instanced.frustumCulled = false;
    return instanced;
  }, [type, capacity]);

  // Escrito durante o render para a matriz já estar pronta quando o Remotion avança o frame.
  useMemo(() => {
    blocks.forEach((block, i) => {
      const size = block.scale ?? 1;
      position.set(block.x, block.y, block.z);
      quaternion.setFromAxisAngle(up, block.rotY ?? 0);
      scale.set(size, size, size);
      mesh.setMatrixAt(i, matrix.compose(position, quaternion, scale));
    });
    mesh.count = blocks.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [mesh, blocks]);

  useEffect(() => () => void mesh.dispose(), [mesh]);

  return <primitive object={mesh} />;
};

const GROUND_SIZE = 900;

// Chão infinito com a mesma textura do topo dos blocos, alinhada à grade.
export const Ground: React.FC = () => {
  const material = useMemo(() => {
    const map = getTexture("grassTop").clone();
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(GROUND_SIZE, GROUND_SIZE);
    map.offset.set(0.5, 0.5);
    map.needsUpdate = true;
    return new THREE.MeshLambertMaterial({ map });
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.5, 0]}
      material={material}
    >
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
    </mesh>
  );
};

export const VoxelWorld: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  const batches = useMemo(() => {
    const byType = new Map<string, Block[]>();
    for (const block of blocks) {
      const list = byType.get(block.type);
      if (list) {
        list.push(block);
      } else {
        byType.set(block.type, [block]);
      }
    }
    return [...byType.entries()];
  }, [blocks]);

  return (
    <>
      {batches.map(([type, list]) => (
        <BlockBatch key={type} type={type} blocks={list} />
      ))}
    </>
  );
};
