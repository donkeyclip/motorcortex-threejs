const MC = require("@kissmybutton/motorcortex");
const threejsPluginDefinition = require("./main");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);

// Create a Clip
let css = `
  .myCam {
    background: lightblue;
    border-radius: 64px;
    border:1px solid black;
    height: 64px;
    left: 0;
    position: absolute;
    top: 0;
    width: 64px;
  }
`;

let html = `
<div class="myCam">
  <p id = "teo">Hello World!!</p>
  <p id = "teo1" class="animated bounceInDown" style="background-color: red">Hello World!!</p>
</div>
`;

let host = document.getElementById("clip");

let containerParams = {
  width: "100%",
  height: "100%"
};

const clip1 = new threejsPlugin.Clip3D(
  {
    scenes:[
      {
        id: "scene1",
        groups: "scenes"
      },
      {
        id: "scene2",
        groups: "scenes" 
      }
    ],
    lights:[
      {
        id: "light1",
        groups: "lights",
        settings: {
          position:{
            set: [0,1,1]
          },
          castShadow: true,
          receiveShadow: true
        },
        applyToSelector: "#scene1"
      }
    ],
    cameras:[
      {
        id: "camera1",
        groups: "camera1",
        settings: {
          position: {
            z: 20,
            y: -40,
            x: 40
          },
          up:{
            set:[0,0,1]
          },
          far: 1000
        }
      }
    ],
    renderers:[
      {
        id: "renderer1",
        groups: "renderers",
        settings: {
          setClearColor: ['lightblue'],
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap
          }
        },
        parameters: [{alpha:true}]
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
        parameters: [2,2,2]
      },
      material: {
        type: "MeshLambertMaterial",
        parameters : [{color: 0xff0000}]
      },
      settings: {
        castShadow: true,
        receiveShadow: true,
        position: { 
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
        parameters: [20,20,20]
      },
      material: {
        type: "MeshLambertMaterial",
        parameters : [{color: 0x00ff00, side: THREE.DoubleSide}]
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
        id: "helloWorld",
        groups: "helloWorlds",
        selector: "#teo",
        settings: {
          position: {
            x:4,
            y:4,
            z:10
          },
          rotation: {
            z:0.2,
            x:0.2
          }
        },
        scenes: "#scene2"
      },
      {
        id: "helloWorldRed",
        groups: "helloWorlds",
        selector: '#teo1',
        settings: {
          position: {
            x:4,
            y:4,
            z:5
          },
          rotation: {
            z:0.4,
            x:0.4
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
        file: "./models/horse.js",
        settings: {
          position: {
            x: 13,
            y: 0,
            z: 0
          },
          scale: {
            set: [0.02, 0.02, 0.02]
          },
          rotation: {
            x:-Math.PI/2,
            y: Math.PI,
            z: Math.PI
          }
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [{
            vertexColors: THREE.FaceColors,
            morphTargets: true
          }]
        }
      },
      {
        id: "horse2",
        groups: "horses",
        scenes: "#scene1",
        loader: "#JSONLoader",
        file: "./models/horse.js",
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
            x:-Math.PI/2,
            y: Math.PI,
            z: Math.PI
          }
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [{
            vertexColors: THREE.FaceColors,
            morphTargets: true
          }]
        }
      },
      {
        id: "horse1",
        groups: "horses",
        scenes: "#scene1",
        loader: "#JSONLoader",
        file: "./models/horse.js",
        settings: {
          position: {
            x: 10,
            y: 0,
            z: 0
          },
          scale: {
            set: [0.02, 0.02, 0.02]
          },
          rotation: {
            x:-Math.PI/2,
            y: Math.PI,
            z: Math.PI
          }
        },
        material: {
          type: "MeshLambertMaterial",
          parameters: [{
            vertexColors: THREE.FaceColors,
            morphTargets: true
          }]
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
    ],
  }, 
  {
    id: "clip1",
    groups: "clips",
    host,
    containerParams,
    html
  }
);

const cameraAnimation = new threejsPlugin.Object3D({
  attrs:{
    keepLookAt: [new THREE.Vector3()]
  },
  animatedAttrs: {
    position_y: -100,
    position_x: 100,
    rotation_z: 2*Math.PI+ 0.3217/2
  }
  },{
    id: 'camera_animation',
    selector: '#camera1',
    duration: 2000
  });
const cameraAnimation2 = new threejsPlugin.Object3D({
  attrs: {
    keepLookAt: [new THREE.Vector3()]
  },
  animatedAttrs: {
    position_y: -60,
    position_x: 60
  }
  },{
    id: 'camera_animation2',
    selector: '#camera1',
    duration: 2000
  });

const boxAnimation3 = new threejsPlugin.Object3D({
  animatedAttrs: {
    rotation_z: 3 * Math.PI
  }
  },{
    id: 'box_animation3',
    selector: '#box',
    duration: 2000
  });

const horseAnimation4 = new threejsPlugin.Object3D({
  animatedAttrs: {
    position_y: -20
  }
  },{
    id: 'horse_animation4',
    selector: '#horse',
    duration: 1500
  });

const divAnimation5 = new threejsPlugin.Object3D({
  animatedAttrs: {
    position_x: -20
  }
  },{
    id: 'div_animation5',
    selector: '#helloWorldRed',
    duration: 2000
  });

const horseAnimation5 = new threejsPlugin.Object3D({
  animatedAttrs: {
    position_y: -30
  }
  },{
    id: 'horse_animation5',
    selector: '.horses',
    duration: 1500
  });

const horseMAE = new threejsPlugin.MAE({
  attrs: {
    singleLoopDuration:1000,
    animationFrames: 30,
    animationName: 'gallop'
  },
  animatedAttrs: {
    time: 1500
  }
  },{
    selector: '#horse',
    duration: 1500
  });


const horsesMAE = new threejsPlugin.MAE({
  attrs: {
    singleLoopDuration:1000,
    animationFrames: 30,
    animationName: 'gallop'
  },
  animatedAttrs: {
    time: 1500
  }
  },{
    selector: '.horses',
    duration: 1500
  });




const Timer = MC.Timer;

let timer = new Timer({
    Incident: clip1,
    width: 1000
});
window.MCTestTimer = timer;

clip1.addIncident(cameraAnimation,0)
clip1.addIncident(cameraAnimation2,2000)
clip1.addIncident(boxAnimation3,4000)
clip1.addIncident(horseAnimation4,6000)
clip1.addIncident(horseMAE,6000)
clip1.addIncident(divAnimation5,8000)
clip1.addIncident(horseAnimation5,10000)
clip1.addIncident(horsesMAE,10000)
