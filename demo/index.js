const MC = require("@kissmybutton/motorcortex");
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/dist/motorcortex-player.umd");
const threejsPluginDefinition = require("../src/index");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
const animeDef = require("@kissmybutton/motorcortex-anime");
const Anime = MC.loadPlugin(animeDef);

const TypewriteDefinition = require("@kissmybutton/motorcortex-typewriting");
const Typewrite = MC.loadPlugin(TypewriteDefinition);

const soldierModelPath =
  "https://kissmybutton.github.io/motorcortex-threejs/demo/models/Soldier.glb";
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
  position: { x: -33, y: 14, z: 30 },
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
const entities = [deathValley_1, soldier_1, tower_1];
const scene = new MC.Clip({
  html: `
    <div id="scene">
      <div id="curtains">
        <p>MotorCortex Productions Presents</p>
        <img width=200 height=150 src="https://github.com/kissmybutton/motorcortex-threejs/blob/master/three.png?raw=true"/>
      </div>
      <div id="date"></div>
    </div>`,
  css: `#scene{
    display:flex;
    justify-content:center;
    align-items:center;
    width: 100%;
    height: 100%;
  }
  #date{
    position:absolute;
    left:10%;
    bottom:30%;
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

const fadeincurtain = new Anime.Anime(
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
const textwriting = new Typewrite.TypeWriting(
  {
    size: 2,
    textColor: "#fff",
    cursorColor: [255, 255, 0],
    title: "18 April 2342",
    erase: 4,
    eraseAll: true,
    delayIfEraseAll: 0,
    blinking: true,
    blinkingDuration: 400,
    blinkDelay: 100
  },
  {
    selector: ".date"
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
      singleLoopDuration: 1000,
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
const rot = ThemeliodesProblima_2(-33, 30, -36, 9).Gab;
const soldierAnimation1 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -36,
        y: "!#deathValley_1",
        z: 9
      },
      rotationSetY: Math.PI + rot
    }
  },
  {
    selector: "!#soldier_1",
    duration: 15000
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
    duration: 15000
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
// Vector3 {x: 9.854846878733191, y: 30.191371479607458, z: -101.69151163546336}
const soldierMAE1 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 900,
      animationFrames: 30,
      animationName: "Walk"
    },
    animatedAttrs: {
      time: 15000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 15000
  }
);
const rot1 = ThemeliodesProblima_2(-36, 9, -60, -51).Gab;

const soldierAnimation2 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -60,
        y: "!#deathValley_1",
        z: -51
      },
      rotationSetY: Math.PI + rot1
    }
  },
  {
    selector: "!#soldier_1",
    duration: 15000
  }
);

const soldierMAE2 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 700,
      animationFrames: 30,
      animationName: "Run"
    },
    animatedAttrs: {
      time: 15000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 15000
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
    duration: 15000
  }
);

const rot3 = ThemeliodesProblima_2(-60, -51, -60, -88).Gab;

const soldierAnimation3 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -60,
        y: "!#deathValley_1",
        z: -88
      },
      rotationSetY: Math.PI + rot3
    }
  },
  {
    selector: "!#soldier_1",
    duration: 10000
  }
);

const soldierMAE3 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 600,
      animationFrames: 30,
      animationName: "Run"
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
const cameraAnimation3 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -130,
        y: 51,
        z: -150
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 10000
  }
);

const rot4 = ThemeliodesProblima_2(-60, -88, -46, -92).Gab;

const soldierAnimation4 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -46,
        y: "!#deathValley_1",
        z: -92
      },
      rotationSetY: Math.PI + rot4
    }
  },
  {
    selector: "!#soldier_1",
    duration: 5000
  }
);

const soldierMAE4 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 600,
      animationFrames: 30,
      animationName: "Run"
    },
    animatedAttrs: {
      time: 5000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 5000
  }
);
const cameraAnimation4 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: -130,
        y: 51,
        z: -150
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 5000
  }
);

const rot5 = ThemeliodesProblima_2(-46, -92, -6, -109).Gab;

const soldierAnimation5 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: -6,
        y: "!#deathValley_1",
        z: -109
      },
      rotationSetY: Math.PI + rot5
    }
  },
  {
    selector: "!#soldier_1",
    duration: 10000
  }
);

const soldierMAE5 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 600,
      animationFrames: 30,
      animationName: "Run"
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
const cameraAnimation5 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: 0,
        y: 40,
        z: -110
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 15000
  }
);
const soldierMAE6 = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "Idle"
    },
    animatedAttrs: {
      time: 15000
    }
  },
  {
    selector: "!#soldier_1",
    duration: 15000
  }
);
const cameraAnimation6 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#soldier_1",
      position: {
        x: 142,
        y: 40,
        z: -215
      }
    }
  },
  {
    selector: "!#camera_1",
    duration: 15000
  }
);
// Vector3 {x: -6.448264786082455, y: 37.61849341670934, z: -109.47186367589241}

const songPlayback = new MC.AudioPlayback({
  selector: "~#sound",
  startFrom: 0,
  duration: 100000
});

clip.addIncident(cameraAnimation, 0);
clip.addIncident(soldierMAE, 0);

clip.addIncident(cameraAnimation1, 20000);
clip.addIncident(soldierAnimation1, 20000);
clip.addIncident(soldierMAE1, 20000);

clip.addIncident(soldierAnimation2, 35000);
clip.addIncident(soldierMAE2, 35000);
clip.addIncident(cameraAnimation2, 35000);

clip.addIncident(soldierAnimation3, 50000);
clip.addIncident(soldierMAE3, 50000);
clip.addIncident(cameraAnimation3, 50000);

clip.addIncident(soldierAnimation4, 60000);
clip.addIncident(soldierMAE4, 60000);
clip.addIncident(cameraAnimation4, 60000);

clip.addIncident(soldierAnimation5, 65000);
clip.addIncident(soldierMAE5, 65000);
clip.addIncident(cameraAnimation5, 65000);
clip.addIncident(cameraAnimation6, 80000);
clip.addIncident(soldierMAE6, 75000);

scene.addIncident(songPlayback, 0);

scene.addIncident(fadeincurtain, 2000);
scene.addIncident(textwriting, 4000);
scene.addIncident(clip, 2000);

//error when loading anime after clip
new Player({
  theme: "mc-green",
  clip: scene,
  scaleToFit: true,
  showVolume: true
});
