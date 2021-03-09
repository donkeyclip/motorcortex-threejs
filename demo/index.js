const MC = require("@kissmybutton/motorcortex").default;
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/dist/motorcortex-player.umd");
const threejsPluginDefinition = require("../src/index");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
const animeDef = require("@kissmybutton/motorcortex-anime");
const Anime = MC.loadPlugin(animeDef);

// const SubtitlesDefinition = require("@kissmybutton/motorcortex-subtitles");
// const Subtitles = MC.loadPlugin(SubtitlesDefinition);

const soldierModelPath =
  "./models/firstAnim2.glb";
const deathValleyPath =
  "https://kissmybutton.github.io/motorcortex-threejs/demo/models/mountainous_valley/scene.gltf";
const towerPath =
  "https://kissmybutton.github.io/motorcortex-threejs/demo/models/tower/scene.gltf";

const rad2Grad = 63.6619772367581; // 1 rad ~= 63 grads
const ThemeliodesProblima_2 = (Xa, Ya, Xb, Yb) => {
  const absDX = Math.abs(Xb - Xa);
  const absDY = Math.abs(Yb - Ya);
  const Sab = Math.sqrt(Math.pow(absDX, 2) + Math.pow(absDY, 2));
  const DX = Xb - Xa;
  const DY = Yb - Ya;
  const theta = Math.atan(absDX / absDY) * rad2Grad; //http://www.translatorscafe.com/cafe/EN/units-converter/angle/2-3/radian-grad/
  let Gab;
  if (DX > 0 && DY > 0) {
    Gab = theta;
  } else if (DX > 0 && DY < 0) {
    Gab = 200 - theta;
  } else if (DX < 0 && DY < 0) {
    Gab = 200 + theta;
  } else if (DX < 0 && DY > 0) {
    Gab = 400 - theta;
  } else if (DX === 0 && DY > 0) {
    Gab = 0;
  } else if (DX === 0 && DY < 0) {
    Gab = 200;
  } else if (DX > 0 && DY === 0) {
    Gab = 100;
  } else if (DX < 0 && DY === 0) {
    Gab = 300;
  } else if (DX === 0 && DY === 0) {
    Gab = 0;
  }

  return { Gab: Gab.toFixed(4) / rad2Grad, Sab: Sab.toFixed(4) };
};

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
  // position: { x: -33, y: 14, z: 30 },
  castShadow: true
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

const towerModel = {
  id: "deathValley",
  loader: "GLTFLoader",
  file: towerPath
};

const towerTemplate = {
  model: towerModel
};

const tower_1 = JSON.parse(
  JSON.stringify({
    ...towerTemplate,
    id: "deathValley_1"
  })
);

// Vector3 {x: -1.0938934870262997, y: 39.6476360020323, z: -83.63681332688691}
tower_1.settings = {
  scale: { set: [0.002, 0.002, 0.002] },
  castShadow: true,
  position: { x: -1, y: 39, z: -83 }
};
deathValley_1.settings = {
  receiveShadow: true
};
const containerParams = {
  width: "100%",
  height: "100%"
};
const entities = [deathValley_1, soldier_1];
const scene = new MC.HTMLClip({
  html: `
    <div id="scene">
      <div id="date">18 April 3046</div>
      <div id="location">Thessaloniki | Hortiatis</div>
      <div id="subs-container"></div>
    </div>`,
  css: `
  #subs-container{
    position:absolute;
    bottom:80px;
    left:50%;
    transform:translateX(-50%);
    text-align:center
  }
  #scene{
    display:flex;
    justify-content:center;
    align-items:center;
    width: 100%;
    height: 100%;
  }
  #date,
  #location{
    position:absolute;
    left:40px;
    color:white;
    opacity:0;
    bottom: 40px;
    z-index: 3;
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    font-weight:100;
    font-size:30px
  }
  #location{
    bottom:10px
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
    opacity:0.98;
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
    },
    {
      src:
        "https://raw.githubusercontent.com/kissmybutton/motorcortex-threejs/master/demo/soundtrack.mp4",
      id: "soundtrack",
      classes: ["sound"],
      base64: false
    },
    {
      src:
        "https://raw.githubusercontent.com/kissmybutton/motorcortex-threejs/master/demo/output.mp3",
      id: "monologue",
      classes: ["sound"],
      base64: false
    },
    {
      src:
        "https://raw.githubusercontent.com/kissmybutton/motorcortex-threejs/master/demo/mono3.mp3",
      id: "monologue2",
      classes: ["sound"],
      base64: false
    }
  ],
  host: document.getElementById("clip"),
  containerParams: { width: "100%", height: "70%" }
});
console.log(entities)
const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: ["#999"] } },
    scenes: { id: "scene", fog: ["#999", 0.1, 500] },
    lights: [
      {
        parameters: ["#457", 1],
        settings: {
          type: "SpotLight",
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
      },
      {
        parameters: ["#999", 1],
        settings: {
          type: "PointLight",
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
      },
      {
        settings: {
          type: "HemisphereLight",
          position: { set: [-40, 180, 20] }
        }
      }
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: 0, y: 0, z: 0 },
        // lookAt: [-33, 14, 30]
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


// const soldierMAE1 = new threejsPlugin.MAE(
//   {
//     attrs: {
//       singleLoopDuration: 7500,
//       animationFrames: 30,
//       animationName: "Sphere_cellAction"
//     },
//     animatedAttrs: {
//       time: 7500
//     }
//   },
//   {
//     selector: "!#soldier_1",
//     duration: 7500
//   }
// );

// clip.addIncident(soldierMAE1, 0);

// const soldierMAE2 = new threejsPlugin.MAE(
//   {
//     attrs: {
//       singleLoopDuration: 7500,
//       animationFrames: 30,
//       animationName: "Sphere_cell.007Action"
//     },
//     animatedAttrs: {
//       time: 7500
//     }
//   },
//   {
//     selector: "!#soldier_1",
//     duration: 7500
//   }
// );

// clip.addIncident(soldierMAE2, 0);

console.log(clip)
for (let index = 1; index <= 1; index++) {
  console.log(index)
  const soldierAn = new threejsPlugin.MAE(
    {
      attrs: {
        singleLoopDuration: 7500,
        animationFrames: 30,
        animationName: `Sphere_cell.0${index<10?"0"+index:index}Action`
      },
      animatedAttrs: {
        time: 7500
      }
    },
    {
      selector: "!#soldier_1",
      duration: 7500
    }
  );
  
  clip.addIncident(soldierAn, index);
  
}


scene.addIncident(clip, 2000);


// scene.addIncident(subtitle, 0);

//error when loading anime after clip
new Player({
  theme: "mc-green",
  clip: scene,
  scaleToFit: true,
  showVolume: true
});
