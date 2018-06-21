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


// // models 
// var geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
// var material = new THREE.MeshLambertMaterial({color:'green'});
// var mesh = new THREE.Mesh( geometry, material );
// mesh.castShadow = true; //default is false
// mesh.receiveShadow = true; //default
// mesh.position.z = 2

// var geometry = new THREE.PlaneGeometry( 50, 20, 32 );
// var material = new THREE.MeshLambertMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
// var plane = new THREE.Mesh( geometry, material );
// plane.castShadow = false;
// plane.receiveShadow = true;

// var axesHelper = new THREE.AxesHelper( 5 );

// var object = new THREE.CSS3DObject( document.getElementById('teo') );
// object.position.x = 20;
// object.position.y = 20;
// object.position.z = 20;

// var newobj = new THREE.CSS3DObject( document.getElementById('teo1') );
// newobj.position.x = 20;
// newobj.position.y = 20;
// newobj.position.z = 10;

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
            z: 10
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

// const clip1 = new threejsPlugin.Clip3D(
//   {
//     scenes:[
//     {
//       id: "scene1",
//       groups: "scenes"
//     },
//     {
//       id: "scene2",
//       groups: "scenes"
//     },
//     {
//       id: "scene3",
//       groups: "cssScenes" 
//     }
//     ],
//     lights:[
//     {
//       id: "light1",
//       groups: "lights",
//       settings: {
//         position:{
//           set: [0,1,1]
//         },
//         castShadow:true,
//         receiveShadow:true
//       },
//       applyToSelector: "#scene1"
//     },
//     {
//       id: "light2",
//       groups: "lights",
//       settings: {
//         position:{
//           set: [0,1,1]
//         },
//         castShadow:true,
//         receiveShadow:true
//       },
//       applyToSelector: "#scene2"
//     }
//     ],
//     cameras:[
//     {
//       id: "camera1",
//       groups: "camera1",
//       settings: {
//         position: {
//           z: 10000
//         },
//         far:100
//       }
//     },
//     {
//       id: "camera2",
//       groups: "camera2",
//       settings: {
//         position: {
//           z: 10,
//           y: -10
//         },
//         rotation: {
//           z: 0
//         },
//         far: 10000
//       }
//     }
//     ],
//     renderers:[
//     {
//       id: "renderer1",
//       groups: "renderers",
//       settings: {
//         setClearColor: ['lightblue'],
//         shadowMap: {
//           enabled: true,
//           type:THREE.PCFSoftShadowMap
//         }
//       },
//       parameters: [{alpha:true}]
//     },
//     {
//       id: "renderer2",
//       groups: "renderers",
//       settings: {
//         setClearColor: ['lightblue',0],
//         shadowMap: {
//           enabled: true,
//           type:THREE.PCFSoftShadowMap
//         }
//       },
//       parameters: [{alpha:true}]
//     },
//     {
//       id: "renderer3",
//       groups: "renderers",
//       settings: {
//         type: "CSS3DRenderer"
//       },
//       parameters: [{alpha:true}]
//     }
//     ],
//     renders: [
//       {
//         renderer: "#renderer1",
//         camera: "#camera2",
//         scene: "#scene1"
//       },
//       {
//         renderer: "#renderer2",
//         camera: "#camera2",
//         scene: "#scene2"
//       },
//       {
//         renderer: "#renderer3",
//         camera: "#camera2",
//         scene: "#scene3"
//       }
//     ]
//   }, 
//   {
//     id: "clip1",
//     groups: "clips",
//     host,
//     containerParams
//   }
// );
// group.addIncident(camera1,100)

// Add Group to Clip
// clip.addIncident(group, 0);


const Timer = MC.Timer;

let timer = new Timer({
    Incident: clip1
});
window.MCTestTimer = timer;


clip1.play();