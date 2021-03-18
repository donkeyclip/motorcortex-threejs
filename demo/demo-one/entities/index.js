export const mainScene = {
  id: "main-scene",
  model: {
    id: "main-scene",
    loader: "GLTFLoader",
    file: "../assets/scene.glb",
  },
  settings: {
    position: { x: 0, y: 0, z: 0 },
  },
};

export const skeleton = {
  id: "skeleton",
  model: {
    id: "skeleton",
    loader: "GLTFLoader",
    file: "../assets/skeleton.glb",
  },
  settings: {
    position: {
      x: -20.89,
      y: -12.31,
      z: 33.15,
    },
    scale: { x: 6, y: 6, z: 6 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
  },
};
