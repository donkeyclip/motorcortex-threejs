const MC = require("@kissmybutton/motorcortex");
// const MC = require("../motorcortex");
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
        id: "helloWorldRed",
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
            x:10
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

const cameraAnimation = new threejsPlugin.Camera3D({
  animatedAttrs: {
    position_y: -100,
    position_x: 100
  }
  },{
    id: 'camera_animation',
    selector: '#camera1',
    duration: 2000
  });
const cameraAnimation2 = new threejsPlugin.Camera3D({
  animatedAttrs: {
    position_y: -40,
    position_x: 40
  }
  },{
    id: 'camera_animation2',
    selector: '#camera1',
    duration: 2000
  });

const Timer = MC.Timer;

let timer = new Timer({
    Incident: clip1
});
window.MCTestTimer = timer;

clip1.addIncident(cameraAnimation,0)
clip1.addIncident(cameraAnimation2,2000)
// clip1.play();