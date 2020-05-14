const MC = require("@kissmybutton/motorcortex");
const Player = require("@kissmybutton/motorcortex-player/");
// const threejsPluginDefinition = require("../dist/motorcortex-three.umd");
const threejsPluginDefinition = require("../src/index");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
// const dancerModelPath = "./models/animated-animals/dancer.fbx";

const generateTerrain = (g /*,m, e*/) => {
  const pos = g.getAttribute("position");
  const pa = pos.array;

  const hVerts = g.parameters.width;
  const wVerts = g.parameters.height;
  for (let j = 0; j < hVerts; j++) {
    for (let i = 0; i < wVerts; i++) {
      pa[3 * (j * wVerts + i) + 2] = Math.random() * 3;
    }
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
};

const box = {
  id: "box",
  geometry: { type: "BoxBufferGeometry", parameters: [2, 2, 2] },
  material: { type: "MeshLambertMaterial", parameters: [{ color: 0xff0000 }] },
  settings: { position: { x: 0, y: 0, z: 5 } }
};

const plane = {
  geometry: { type: "PlaneBufferGeometry", parameters: [1000, 1000, 100, 100] },
  material: {
    type: "MeshPhongMaterial",
    parameters: [
      {
        color: 0xffb851
      }
    ]
  },
  settings: { receiveShadow: true, castShadow: true },
  callback: generateTerrain
};

// const dancerModel = {
//   id: "dancer",
//   loader: "#FBXLoader",
//   file: dancerModelPath
// };

// const dancerTemplate = {
//   class: "busts",
//   geometryFromModel: "#dancer",
//   material: {
//     type: "MeshLambertMaterial",
//     parameters: [
//       { color: "0xFFFFFF", vertexColors: "FaceColors", morphTargets: true }
//     ]
//   },
//   settings: {
//     scale: { set: [0.02, 0.02, 0.02] },
//     rotation: { x: -Math.PI / 2, y: Math.PI, z: Math.PI },
//     entityType: "Mesh"
//   }
// };
// const dancer_1 = JSON.parse(
//   JSON.stringify({ ...dancerTemplate, id: "dancer_1" })
// );
// dancer_1.settings.position = { x: 10, y: 2, z: 3 };

const entities = [box /*plane , dancer_1 */];

// const clip = new MC.Clip({
//   css: "#container{width:100%;height:100%;}",
//   html: "<div id='container'></div>",
//   host: document.getElementById("clip"),
//   containerParams: { width: "100%", height: "100%" }
// });

const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: [0xf5f5f5] } },
    scenes: { fog: [0xf5f5f5, 0.1, 500] },
    lights: [
      {
        parameters: [0xffffff, 0.6],
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
    cameras: { settings: { position: { x: 0, y: -20, z: 20 } } },
    entities,
    // models: [dancerModel],
    controls: { enable: true }
  },
  {
    host: document.getElementById("clip"),
    // selector: "#container",
    containerParams: { width: "100%", height: "100%" }
  }
);

const boxAnimation = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: 20,
        y: 20
      },
      rotation: {
        x: Math.PI * 2
      }
    }
  },
  {
    id: "box_animation",
    selector: "#box",
    duration: 4000
  }
);

// const dancerAnimation = new threejsPlugin.Object3D(
//   {
//     animatedAttrs: {
//       rotation: {
//         y: Math.PI * 2
//       }
//     }
//   },
//   {
//     id: "dancer_animation",
//     selector: "#dancer_1",
//     duration: 4000
//   }
// );
// const cameraAnimation = new threejsPlugin.Object3D(
//   {
//     animatedAttrs: {
//       targetEntity: "#dancer_1"
//     }
//   },
//   {
//     id: "camera_animation",
//     selector: "#camera",
//     duration: 4000
//   }
// );

// const horseMAE = new threejsPlugin.MAE(
//   {
//     attrs: {
//       singleLoopDuration: 1000,
//       animationFrames: 30,
//       animationName: "gallop"
//     },
//     animatedAttrs: {
//       time: 4000
//     }
//   },
//   {
//     selector: ".horses",
//     duration: 4000
//   }
// );

// const dancerMAE = new threejsPlugin.MAE(
//   {
//     attrs: {
//       singleLoopDuration: 10000,
//       animationFrames: 30,
//       animationIndex: "0"
//     },
//     animatedAttrs: {
//       time: 6000
//     }
//   },
//   {
//     selector: ".busts",
//     duration: 10000
//   }
// );

clip.addIncident(boxAnimation, 0);
// clip.addIncident(clip1, 0);
// clip.addIncident(cameraAnimation, 0);
// clip.addIncident(horseMAE, 0);
// clip.addIncident(dancerMAE, 0);
window.clip = clip;
new Player({ clip });
