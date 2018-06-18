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
      groups: "scene1"
    }
    ],
    lights:[
    {
      id: "light1",
      groups: "lights"
    }
    ],
    cameras:[
    {
      id: "camera1",
      groups: "camera1",
      settings: {
        position: {
          z: 10000
        },
        far: 10000
      }
    },
    {
      id: "camera2",
      groups: "camera2",
      settings: {
        position: {
          z: 10,
          y: -10
        },
        rotation: {
          z: 0
        },
        far: 100000
      }
    }
    ],
    renderers:[
    {
      id: "renderer1",
      groups: "renderer1",
      settings: {
        setClearColor: ['lightblue']
      }
    }
    ],
    renders: [
      {
        renderer: "#renderer1",
        camera: "#camera2",
        scene: "#scene1"
      }
    ]
  }, 
  {
    id: "clip1",
    groups: "clips",
    host,
    containerParams
  }
);

// group.addIncident(camera1,100)

// Add Group to Clip
// clip.addIncident(group, 0);


const Timer = MC.Timer;

let timer = new Timer({
    Incident: clip1
});
window.MCTestTimer = timer;


clip1.play();