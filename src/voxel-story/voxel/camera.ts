import * as THREE from "three";

export type Vec3 = [number, number, number];

export type CameraPose = {
  position: Vec3;
  target: Vec3;
  fov: number;
};

const rad = (deg: number) => (deg * Math.PI) / 180;

export const orbitPose = ({
  target,
  distance,
  azimuth,
  elevation,
  fov = 40,
}: {
  target: Vec3;
  distance: number;
  azimuth: number;
  elevation: number;
  fov?: number;
}): CameraPose => {
  const horizontal = Math.cos(rad(elevation)) * distance;
  return {
    target,
    fov,
    position: [
      target[0] + Math.sin(rad(azimuth)) * horizontal,
      target[1] + Math.sin(rad(elevation)) * distance,
      target[2] + Math.cos(rad(azimuth)) * horizontal,
    ],
  };
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixVec = (a: Vec3, b: Vec3, t: number): Vec3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

export const mixPose = (a: CameraPose, b: CameraPose, t: number): CameraPose => ({
  position: mixVec(a.position, b.position, t),
  target: mixVec(a.target, b.target, t),
  fov: mix(a.fov, b.fov, t),
});

export const applyPose = (
  camera: THREE.PerspectiveCamera,
  pose: CameraPose,
  aspect: number,
) => {
  camera.position.set(...pose.position);
  camera.fov = pose.fov;
  camera.aspect = aspect;
  camera.near = 0.1;
  camera.far = 400;
  camera.lookAt(...pose.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
};

const projector = new THREE.PerspectiveCamera();
const point = new THREE.Vector3();

export const projectToScreen = (
  pose: CameraPose,
  world: Vec3,
  width: number,
  height: number,
) => {
  applyPose(projector, pose, width / height);
  point.set(...world).project(projector);
  return {
    x: (point.x * 0.5 + 0.5) * width,
    y: (-point.y * 0.5 + 0.5) * height,
  };
};
