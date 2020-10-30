const MC = require("@kissmybutton/motorcortex");
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/dist/motorcortex-player.umd");
const threejsPluginDefinition = require("../src/index");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
const soldierModelPath =
  "https://github.com/kissmybutton/motorcortex-threejs/blob/master/demo/models/Soldier.glb";
const deathValleyPath =
  "https://github.com/kissmybutton/motorcortex-threejs/blob/master/demo/models/mountainous_valley/scene.gltf";

// const box = {
//   id: "box",
//   geometry: { type: "BoxBufferGeometry", parameters: [2, 2, 2] },
//   material: {
//     type: "MeshBasicMaterial",
//     parameters: [
//       {
//         color: 0xff0000,
//         side: "DoubleSide"
//       }
//     ]
//   },
//   settings: { position: { x: 0, y: 0, z: 5 } }
// };

const soldierModel = {
  id: "soldier",
  loader: "GLTFLoader",
  file: soldierModelPath
};

const soldierTemplate = {
  model: soldierModel,
  settings: {
    scale: { set: [2, 2, 2] },
    rotation: { x: -Math.PI / 2, y: Math.PI, z: Math.PI }
  }
};

const soldier_1 = JSON.parse(
  JSON.stringify({
    ...soldierTemplate,
    id: "soldier_1"
  })
);
soldier_1.settings.position = { x: -10, y: 2, z: 3 };

const deathValleyModel = {
  id: "deathValley",
  loader: "GLTFLoader",
  file: deathValleyPath
};

const deathValleyTemplate = {
  model: deathValleyModel,
  settings: {
    rotation: { x: -Math.PI / 2, y: Math.PI, z: Math.PI }
  }
};

const deathValley_1 = JSON.parse(
  JSON.stringify({
    ...deathValleyTemplate,
    id: "deathValley_1"
  })
);
const entities = [soldier_1, deathValley_1];

const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: [0xf5f5f5] } },
    scenes: { fog: [0xf5f5f5, 0.1, 500] },
    lights: [
      {
        parameters: [0xffffff, 1],
        settings: {
          position: { set: [-40, 20, 80] },
          shadow: {
            radius: 1.2,
            camera: {
              near: 0.5,
              far: 500,
              left: -100,
              bottom: -100,
              right: 100,
              top: 100
            },
            bias: 0.01,
            mapSize: { x: 1024 * 6, y: 1024 * 6 }
          }
        }
      }
    ],
    cameras: {
      settings: { position: { x: 0, y: -20, z: 20 }, up: { set: [0, 0, 1] } }
    },
    entities,
    controls: { enable: true }
  },
  {
    host: document.getElementById("clip"),
    // selector: "#container",
    containerParams: { width: "100%", height: "100%" }
  }
);

const soldierMAE = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "Walk"
    },
    animatedAttrs: {
      time: 6000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 10000
  }
);

clip.addIncident(soldierMAE, 0);
new Player({ clip });
