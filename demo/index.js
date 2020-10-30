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
  model: soldierModel
};

const soldier_1 = JSON.parse(
  JSON.stringify({
    ...soldierTemplate,
    id: "soldier_1"
  })
);
soldier_1.settings = {
  position: { x: -33, y: 14, z: 30 }
};

const deathValleyModel = {
  id: "deathValley",
  loader: "GLTFLoader",
  file: deathValleyPath
};

const deathValleyTemplate = {
  model: deathValleyModel
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
const entities = [deathValley_1, soldier_1];
const scene = new MC.Clip({
  html: `
    <div id="scene">
      <div id="curtains">
        <p>MotorCortex Productions Presents</p>
        <img width=200 height=150 src="https://github.com/kissmybutton/motorcortex-threejs/blob/master/three.png?raw=true"/>
      </div>
    </div>`,
  css: `#scene{
    display:flex;
    justify-content:center;
    align-items:center;
    width: 100%;
    height: 100%;
  }
  #curtains{
    font-size:25px;
    font-family:Arial;
    display:flex;
    align-items:center;
    flex-direction:column;
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
  containerParams: { width: "100%", height: "70%" }
});

const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: ["#342a22"] } },
    scenes: { id: "scene", fog: ["#342a22", 0.1, 500] },
    lights: [
      {
        parameters: [0xffffff, 3],
        settings: {
          position: { set: [-40, 80, 20] },
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
        position: { x: -290, y: 70, z: 150 },
        lookAt: [-33, 14, 30]
      }
    },
    entities,
    controls: { enable: true }
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
    duration: 3000,
    selector: `#curtains`
  }
);
const cameraAnimation = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -150,
        y: 20,
        z: 80
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

const soldierAnimation1 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -36,
        y: "!#deathValley_1",
        z: 9
      },
      rotation: {
        // lookAt: [-17, 17, 14]
      }
    }
  },
  {
    selector: "!#soldier_1",
    duration: 20000
  }
);

const cameraAnimation1 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -46,
        y: 25,
        z: -20
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 20000
  }
);

// Vector3 {x: -33.05862710874124, y: 14.2412998275283, z: 30.540445980956793}
// Clip.js?ec19:348 undefined
// Clip.js?ec19:348 Vector3 {x: -36.00494356512677, y: 17.676858007396643, z: -9.374431879098442}
// Clip.js?ec19:348 undefined
// Clip.js?ec19:348 Vector3 {x: -60.86447867115839, y: 19.720236862743278, z: -51.98990126098527}
// Clip.js?ec19:348 undefined
// Clip.js?ec19:348 Vector3 {x: -60.253242693492545, y: 21.783746471905896, z: -88.8038843646755}
// Clip.js?ec19:348 undefined
// Clip.js?ec19:348 Vector3 {x: -46.541444386336615, y: 23.834236872385162, z: -92.37887143938472}

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

const soldierAnimation2 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -60,
        y: "!#deathValley_1",
        z: -51
      },
      rotation: {
        // lookAt: [-62, 21, 80]
      }
    }
  },
  {
    selector: "!#soldier_1",
    duration: 17000
  }
);

const soldierMAE2 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "Run"
    },
    animatedAttrs: {
      time: 17000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 17000
  }
);
const cameraAnimation2 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -66,
        y: 24,
        z: -17
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 17000
  }
);
const songPlayback = new MC.AudioPlayback({
  selector: "~#sound",
  startFrom: 0,
  duration: 51000
});

clip.addIncident(cameraAnimation, 0);
clip.addIncident(soldierMAE, 0);

clip.addIncident(cameraAnimation1, 20000);
clip.addIncident(soldierAnimation1, 20000);
clip.addIncident(soldierMAE1, 20000);

clip.addIncident(soldierAnimation2, 40000);
clip.addIncident(soldierMAE2, 40000);
clip.addIncident(cameraAnimation2, 40000);

scene.addIncident(songPlayback, 0);

scene.addIncident(fadeoutcurtain, 2000);
scene.addIncident(clip, 2000);

//error when loading anime after clip
new Player({
  theme: "mc-green",
  clip: scene,
  scaleToFit: true,
  showVolume: true
});
