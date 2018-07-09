const MC = require("../node_modules/@kissmybutton/motorcortex");
const threejsPluginDefinition = require("../src/main");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);

const html = `
<div class="myCam">
  <div id="image" style="background-image: url(./mclogo.png);background-repeat: no-repeat;background-size: 100% 100%;width:20px;height:20px;">&nbsp;</div>
  <p id = "paragraph" style="background-color:white;border-radius:5px;font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;padding:10px;color:#555">Demo of motorcortex-threejs plugin</p>
</div>
`;

const host = document.getElementById("clip");

const containerParams = {
  width: "100%",
  height: "100%"
};

const clip1 = new threejsPlugin.Clip3D(
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
          lookAt: [new THREE.Vector3(0, -100, 10)],
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
            enabled: true,
            type: THREE.PCFSoftShadowMap
          }
        },
        parameters: [{ alpha: true }]
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
          "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/animated/horse.js",
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
          "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/animated/horse.js",
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
          "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/animated/horse.js",
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
        renderer: "#renderer1",
        camera: "#camera1",
        scene: "#scene1"
      },
      {
        renderer: "#renderer2",
        camera: "#camera1",
        scene: "#scene2"
      }
    ],
    loaders: [
      {
        id: "JSONLoader",
        groups: "loaders",
        type: "JSONLoader",
        material: {
          vertexColors: THREE.FaceColors,
          morphTargets: true
        }
      }
    ]
  },
  {
    id: "clip1",
    groups: "clips",
    host,
    containerParams,
    html
  }
);

const cameraAnimation = new threejsPlugin.Object3D(
  {
    attrs: {
      keepLookAt: [new THREE.Vector3(0, -90, 10)]
    },
    animatedAttrs: {
      position: {
        y: -90
      },
      rotation: {
        y: 2 * Math.PI
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
    attrs: {
      keepLookAt: [new THREE.Vector3(0, -50, 10)]
    },
    animatedAttrs: {
      position: {
        x: 30,
        y: -50
      }
    }
  },
  {
    id: "camera_animation2",
    selector: "#camera1",
    duration: 2000
  }
);

const cameraAnimation3 = new threejsPlugin.Object3D(
  {
    attrs: {
      // keepLookAt: [new THREE.Vector3()]
    },
    animatedAttrs: {
      position: {
        x: 40,
        y: 0,
        z: 2
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
    attrs: {
      keepLookAt: [new THREE.Vector3()]
    },
    animatedAttrs: {
      position: {
        x: 40,
        y: -40,
        z: 20
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
    attrs: {
      keepLookAt: [new THREE.Vector3()]
    },
    animatedAttrs: {
      position: {
        x: 50,
        y: -90,
        z: 50
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
        y: 4 * Math.PI
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

const Timer = MC.Timer;

const timer = new Timer({
  Incident: clip1,
  width: 1000
});
window.MCTestTimer = timer;

clip1.addIncident(cameraAnimation, 2000);
clip1.addIncident(cameraAnimation2, 4000);
clip1.addIncident(divAnimation5, 6000);
clip1.addIncident(cameraAnimation3, 8000);
clip1.addIncident(cameraAnimation4, 9000);
clip1.addIncident(cameraAnimation5, 11000);
clip1.addIncident(boxAnimation3, 9000);
clip1.addIncident(boxAnimation4, 10000);
clip1.addIncident(horseAnimation4, 11000);
clip1.addIncident(horseMAE, 11000);
clip1.addIncident(horseAnimation5, 13000);
clip1.addIncident(horsesMAE, 13000);

// console.log(clip1);
