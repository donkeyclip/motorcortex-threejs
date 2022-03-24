export const mainScene = {
  id: "main-scene",
  model: {
    id: "main-scene",
    loader: "GLTFLoader",
    file: "https://donkey-spaces.ams3.cdn.digitaloceanspaces.com/assets/threejs-plugin/christmas-village.glb",
  },
  settings: {
    position: { x: 0, y: 0, z: 0 },
  },
};

export const man = {
  id: "man",
  model: {
    id: "man",
    loader: "GLTFLoader",
    file: "https://donkey-spaces.ams3.cdn.digitaloceanspaces.com/assets/threejs-plugin/man.glb",
  },
  settings: {
    position: { x: 4, y: 0, z: -6 },
    rotation: { x: 0, y: -Math.PI / 2.5, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
};
