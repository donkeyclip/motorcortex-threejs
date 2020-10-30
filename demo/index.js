const MC = require("@kissmybutton/motorcortex");
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/dist/motorcortex-player.umd");
const threejsPluginDefinition = require("../src/index");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
const animeDef = require("@kissmybutton/motorcortex-anime");
const Anime = MC.loadPlugin(animeDef);
const soldierModelPath =
  "https://kissmybutton.github.io/motorcortex-threejs/demo/models/Soldier.glb";
const deathValleyPath =
  "https://kissmybutton.github.io/motorcortex-threejs/demo/models/mountainous_valley/scene.gltf";

// const soldierPath = [
//   [-31, -5, 16],
//   [-52, 34, 19][(-62, 80, 21)][(-57, 87, 22)]
// ];

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
soldier_1.settings.position = { x: -40, y: -21, z: 14 };

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
const containerParams = {
  width: "100%",
  height: "100%"
};
const entities = [soldier_1, deathValley_1];
const scene = new MC.Clip({
  html: `<div id="scene"><div id="curtains">MotorCortex Productions Presents</div></div>`,
  css: `#scene{
    display:flex;
    justify-content:center;
    align-items:center;
    width: 100%;
    height: 100%;
  }
  #curtains{
    font-size:20px;
    font-family:Arial;
    display:flex;
    align-items:center;
    justify-content:center;
    color:white;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:black;
  }
    `,
  audioSources: [
    {
      src:
        "https://raw.githubusercontent.com/kissmybutton/motorcortex-threejs/master/demo/sound.mp3",
      id: "sound",
      classes: ["sound"],
      base64: false
    }
  ],
  host: document.getElementById("clip"),
  containerParams
});

const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: ["#342a22"] } },
    scenes: { id: "scene", fog: ["#342a22", 0.1, 500] },
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
      id: "camera_1",
      settings: {
        position: { x: -400, y: -30, z: 230 },
        up: { set: [0, 0, 1] },
        lookAt: [-40, -21, 14]
      }
    },
    entities,
    controls: { enable: false }
  },
  {
    selector: "#scene",
    // selector: "#container",
    containerParams
  }
);
const fadeoutcurtain = new Anime.Anime(
  {
    animatedAttrs: {
      opacity: 0
    }
  },
  {
    duration: 5000,
    selector: `#curtains`
  }
);
const cameraAnimation = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -50,
        y: -105,
        z: 20
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 20000
  }
);

const soldierMAE = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1200,
      animationFrames: 30,
      animationName: "Idle"
    },
    animatedAttrs: {
      time: 10000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 10000
  }
);
const cameraAnimation1 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -70,
        y: 70,
        z: 35
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 20000
  }
);
const soldierAnimation1 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -52,
        y: 34,
        z: "!#deathValley_1"
      },
      rotation: {
        lookAt: [-52, 34, 19]
      }
    }
  },
  {
    selector: "!#soldier_1",
    duration: 20000
  }
);

const soldierMAE1 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1200,
      animationFrames: 30,
      animationName: "Walk"
    },
    animatedAttrs: {
      time: 20000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 20000
  }
);

const soldierMAE2 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1200,
      animationFrames: 30,
      animationName: "Idle"
    },
    animatedAttrs: {
      time: 10000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 10000
  }
);
const cameraAnimation2 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -70,
        y: 80,
        z: 40
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 10000
  }
);
const songPlayback = new MC.AudioPlayback({
  selector: "~#sound",
  startFrom: 0,
  duration: 45000
});

scene.addIncident(songPlayback, 0);

clip.addIncident(cameraAnimation, 0);
clip.addIncident(soldierMAE, 0);

clip.addIncident(cameraAnimation1, 20000);
clip.addIncident(soldierAnimation1, 20000);
clip.addIncident(soldierMAE1, 20000);

clip.addIncident(soldierMAE2, 40000);
clip.addIncident(cameraAnimation2, 40000);
scene.addIncident(fadeoutcurtain, 0);
scene.addIncident(clip, 1000);

//error when loading anime after clip
new Player({ clip: scene, scaleToFit: true });
