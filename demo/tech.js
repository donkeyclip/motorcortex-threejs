const MC = require("@kissmybutton/motorcortex");
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/src/Player");
const threejsPluginDefinition = require("../src/main");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);

const host = document.getElementById("clip");
const containerParams = {
  width: "100%",
  height: "100%"
};

const myClip = new MC.Clip({
  html: `
    <div class="container">
      <div class="cinema"></div>
      <div class="cinema"></div>
      <div class="cinema"></div>
    </div>
  `,
  css: `
    .container {
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
    }
    .cinema{
      width:90%;
      height:200px;
      margin:10px;
      position:relative;
    }
  `,
  host,
  containerParams,
  audio: "off"
});

const html = `
  <div class="myCam">
    <div id="image" style="background-image: url(./mclogo.png);background-repeat: no-repeat;background-size: 100% 100%;width:20px;height:20px;">&nbsp;</div>
    <p id = "paragraph" style="background-color:white;border-radius:5px;font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;padding:10px;color:#555">Demo of motorcortex-threejs plugin</p>
  </div>
`;
// const html = ``;
let shadow = true;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  shadow = false;
}

const clip = new threejsPlugin.Clip(
  {
    scenes: [
      {
        id: "scene1",
        groups: "scenes",
        settings: {
          // fog: new THREE.Fog(0x59472b, 150, 200)
        }
      },
      {
        id: "scene2",
        groups: "scenes",
        settings: {}
      }
    ],
    lights: [
      {
        id: "light1",
        groups: "lights",
        settings: {
          position: {
            set: [0, 0, 100]
          },
          target: {
            position: {
              set: [0, 0, 0]
            }
          },
          type: "SpotLight",
          castShadow: true,
          receiveShadow: true
        },
        applyToSelector: "#scene1"
      },
      {
        id: "light2",
        groups: "lights",
        parameters: [0x444444],
        applyToSelector: "#scene1"
      }
    ],
    cameras: [
      {
        id: "camera1",
        groups: "camera1",
        settings: {
          position: {
            x: 0,
            y: -450,
            z: 10
          },
          up: {
            set: [0, 0, 1]
          },
          lookAt: [0, 0, 0],
          far: 10000
        }
      }
    ],
    renderers: [
      {
        id: "renderer1",
        groups: "renderers",
        settings: {
          setClearColor: ["lightblue"],
          shadowMap: {
            enabled: shadow,
            type: THREE.PCFSoftShadowMap
          }
        },
        parameters: [{ alpha: true, antialias: true }]
      },
      {
        id: "renderer2",
        groups: "renderers",
        settings: {
          type: "CSS3DRenderer"
        }
      }
    ],
    meshes: [
      {
        id: "box",
        groups: "boxes",
        geometry: {
          type: "BoxBufferGeometry",
          parameters: [2, 2, 2]
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [{ color: 0xff0000 }]
        },
        settings: {
          castShadow: true,
          receiveShadow: false,
          position: {
            x: 0,
            y: 0,
            z: 2
          }
        },
        scenes: "#scene1"
      },
      {
        id: "plane",
        groups: "planes",
        geometry: {
          type: "PlaneGeometry",
          parameters: [200, 200, 200]
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [{ color: 0x00ff00, side: THREE.DoubleSide }]
        },
        settings: {
          castShadow: false,
          receiveShadow: true
        },
        scenes: "#scene1"
      }
    ],
    css3d_objects: [
      {
        id: "paragraph",
        groups: "css3d",
        selector: "#paragraph",
        settings: {
          position: {
            x: 0,
            y: -100,
            z: 10
          },
          rotation: {
            x: Math.PI / 2,
            y: 0,
            z: 0
          }
        },
        scenes: "#scene2"
      },
      {
        id: "image",
        groups: "css3d",
        selector: "#image",
        settings: {
          position: {
            x: 0,
            y: -50,
            z: 10
          },
          rotation: {
            x: Math.PI / 2,
            y: Math.PI / 2,
            z: 0
          }
        },
        scenes: "#scene2"
      }
    ],
    models: [
      {
        id: "horse",
        groups: "horses",
        scenes: "#scene1",
        loader: "#JSONLoader",
        file:
          "https://raw.githubusercontent.com/rollup/three-jsnext/master/examples/models/animated/horse.js",
        settings: {
          position: {
            x: -13,
            y: 0,
            z: 0
          },
          scale: {
            set: [0.02, 0.02, 0.02]
          },
          rotation: {
            x: -Math.PI / 2,
            y: Math.PI,
            z: Math.PI
          },
          castShadow: true,
          receiveShadow: false
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [
            {
              vertexColors: THREE.FaceColors,
              morphTargets: true
            }
          ]
        }
      },
      {
        id: "horse2",
        groups: "horses",
        scenes: "#scene1",
        loader: "#JSONLoader",
        file:
          "https://raw.githubusercontent.com/rollup/three-jsnext/master/examples/models/animated/horse.js",
        settings: {
          position: {
            x: 12,
            y: 0,
            z: 0
          },
          scale: {
            set: [0.02, 0.02, 0.02]
          },
          rotation: {
            x: -Math.PI / 2,
            y: Math.PI,
            z: Math.PI
          },
          castShadow: true,
          receiveShadow: false
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [
            {
              vertexColors: THREE.FaceColors,
              morphTargets: true
            }
          ]
        }
      },
      {
        id: "horse1",
        groups: "horses",
        scenes: "#scene1",
        loader: "#JSONLoader",
        file:
          "https://raw.githubusercontent.com/rollup/three-jsnext/master/examples/models/animated/horse.js",
        settings: {
          position: {
            x: 30,
            y: 0,
            z: 0
          },
          scale: {
            set: [0.02, 0.02, 0.02]
          },
          rotation: {
            x: -Math.PI / 2,
            y: Math.PI,
            z: Math.PI
          },
          castShadow: true,
          receiveShadow: false
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [
            {
              vertexColors: THREE.FaceColors,
              morphTargets: true
            }
          ]
        }
      }
    ],
    renders: [
      {
        renderer: "#renderer2",
        camera: "#camera1",
        scene: "#scene2"
      },
      {
        renderer: "#renderer1",
        camera: "#camera1",
        scene: "#scene1"
      }
    ],
    loaders: [
      {
        id: "JSONLoader",
        groups: "loaders",
        type: "JSONLoader"
      }
    ] /*,
    controls: {
      enable: false,
      cameraId: "#camera1"
    }*/
  },
  {
    id: "clip",
    groups: "clips",
    selector: ".cinema",
    // host,
    containerParams,
    html
  }
);

const cameraAnimation = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        y: -90
      },
      rotation: {
        x: undefined,
        y: undefined,
        z: 2 * Math.PI,
        lookAt: [0, 0, 0]
      }
    }
  },
  {
    id: "move_to_paragraph",
    selector: "#camera1",
    duration: 2000
  }
);
const cameraAnimation2 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: 30,
        y: -50
      },
      rotation: {
        x: undefined,
        y: undefined,
        z: undefined,
        lookAt: [0, -50, 10]
      }
    }
  },
  {
    id: "camera_animation2",
    selector: "#camera1",
    duration: 2000
  }
);
const cameraAnimation21 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      rotation: {
        x: undefined,
        y: undefined,
        z: undefined,
        lookAt: [0, -50, 10]
      }
    }
  },
  {
    id: "camera_animation21",
    selector: "#camera1",
    duration: 2000
  }
);

const cameraAnimation3 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: 40,
        y: 0,
        z: 2
      },
      rotation: {
        x: undefined,
        y: undefined,
        z: undefined,
        lookAt: [0, 0, 0]
      }
    }
  },
  {
    id: "camera_animation3",
    selector: "#camera1",
    duration: 1000
  }
);

const cameraAnimation4 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: 40,
        y: -40,
        z: 20
      },
      rotation: {
        x: undefined,
        y: undefined,
        z: undefined,
        lookAt: [0, 0, 0]
      }
    }
  },
  {
    id: "camera_animation4",
    selector: "#camera1",
    duration: 2000
  }
);

const cameraAnimation5 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: 50,
        y: -90,
        z: 50
      },
      rotation: {
        x: undefined,
        y: undefined,
        z: undefined,
        lookAt: [0, 0, 0]
      }
    }
  },
  {
    id: "camera_animation5",
    selector: "#camera1",
    duration: 3500
  }
);

const boxAnimation3 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      rotation: {
        x: 1.5 * Math.PI,
        y: 1.5 * Math.PI,
        z: 1.5 * Math.PI
      },
      position: {
        y: -10
      }
    }
  },
  {
    id: "box_animation3",
    selector: "#box",
    duration: 1000
  }
);

const boxAnimation4 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      rotation: {
        x: 3 * Math.PI,
        y: 3 * Math.PI,
        z: 3 * Math.PI
      },
      position: {
        x: 20
      }
    }
  },
  {
    id: "box_animation4",
    selector: "#box",
    duration: 1000
  }
);
const horseAnimation4 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        y: -20
      }
    }
  },
  {
    id: "horse_animation4",
    selector: "#horse",
    duration: 1500
  }
);

const divAnimation5 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      rotation: {
        x: undefined,
        y: 4 * Math.PI,
        z: undefined
      }
    }
  },
  {
    id: "div_animation5",
    selector: "#image",
    duration: 2000
  }
);

const horseAnimation5 = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        y: -30
      }
    }
  },
  {
    id: "horse_animation5",
    selector: ".horses",
    duration: 1500
  }
);

const horseMAE = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "gallop"
    },
    animatedAttrs: {
      time: 1500
    }
  },
  {
    selector: "#horse",
    duration: 1500
  }
);

const horsesMAE = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "gallop"
    },
    animatedAttrs: {
      time: 1500
    }
  },
  {
    selector: ".horses",
    duration: 1500
  }
);

clip.addIncident(cameraAnimation, 2000);
clip.addIncident(cameraAnimation2, 4000);
clip.addIncident(cameraAnimation21, 6000);
clip.addIncident(divAnimation5, 6000);
clip.addIncident(cameraAnimation3, 8000);
clip.addIncident(cameraAnimation4, 9000);
clip.addIncident(cameraAnimation5, 11000);
clip.addIncident(boxAnimation3, 9000);
clip.addIncident(boxAnimation4, 10000);
clip.addIncident(horseAnimation4, 11000);
clip.addIncident(horseMAE, 11000);
clip.addIncident(horseAnimation5, 13000);
clip.addIncident(horsesMAE, 13000);

myClip.addIncident(clip, 0);
window.clip = myClip;
new Player({
  clip: myClip,
  theme: "transparent on-top",
  preview: false,
  pointerEvents: false,
  showIndicator: true
});
