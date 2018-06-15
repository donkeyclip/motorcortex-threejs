// const MC = require("@kissmybutton/motorcortex");
const MC = require("../motorcortex");
const threejsPluginDefinition = require("./main");
// const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);

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

// const clip = new MC.Clip(null, {
//   css,
//   html,
//   host,
//   containerParams
// });

// Create a Group
// const group = new MC.Group();

// HTML
// element.innerHTML = 'Plain text inside a div.';
// element.className = 'three-div';

const clip1 = new MC.Clip3D(
  {
    scenes:[
    {
      id: "scene1",
      selector: "scene1"
    }
    ],
    lights:[
    ],
    cameras:[
    {
      id: "camera1",
      selector: "camera1",
    }
    ],
    renderers:[
    {
      id: "renderer1",
      selector: "renderer1"
    }
    ],
    render: () => {
      console.log("this",this)
    }

  }, 
  {
    id: "clip1",
    selector: "clips",
    duration: 10000,
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