export const mainScene = {
  id: "main-scene",
  model: {
    id: "main-scene",
    loader: "GLTFLoader",
    file: "../assets/scene.glb",
  },
  settings: {
    position: { x: 0, y: 0, z: 0 },
    receiveShadow: true,
  },
  children: ["Apocalyptic_Cityobjcleaner"],
};

export const man = {
  id: "man",
  model: {
    id: "man",
    loader: "GLTFLoader",
    file: "../assets/Soldier.glb",
  },
  settings: {
    castShadow: true,
    position: {
      x: -20,
      y: -9,
      z: 121,
    },
    scale: { x: 30, y: 30, z: 30 },
    rotation: { x: 0, y: -Math.PI / 2, z: 0 },
  },
};
export const plane = {
  id: "plane",
  geometry: { type: "BoxGeometry", parameters: [20000, 20000, 20000] },
  material: {
    type: "MeshBasicMaterial",
    parameters: [
      {
        color: "#947956",
        side: "DoubleSide",
      },
    ],
  },
  settings: {
    position: { x: 0, y: -15, z: 0 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
  },
};
