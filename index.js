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
  <div id="sample-div">Plaintextsample</div>
</div>
`;

let host = document.getElementById("clip");

let containerParams = {
  width: "100%",
  height: "100%"
};

const clip = new MC.Clip(null, {
  css,
  html,
  host,
  containerParams
});

// Create a Group
const group = new MC.Group();

// HTML
// element.innerHTML = 'Plain text inside a div.';
// element.className = 'three-div';

const camera1 = new threejsPlugin.Camera3D(
  {
    animatedAttrs: {
      camera_rotation_x: 0,
      camera_rotation_y: 10 * Math.PI,
      camera_rotation_z: 0,
      camera_position_x: 0,
      camera_position_y: 0,
      camera_position_z: -200
    },
    attrs: {
      camera_rotation_x: 0,
      camera_rotation_y: 0,
      camera_rotation_z: 0,
      camera_position_x: 0,
      camera_position_y: 0,
      camera_position_z: -20
    }
  }, 
  {
    id: "camera1",
    selector: "#sample-div",
    duration: 10000
  }
);

group.addIncident(camera1,100)

// Add Group to Clip
clip.addIncident(group, 0);


const Timer = MC.Timer;

let timer = new Timer({
    Incident: clip
});
window.MCTestTimer = timer;


clip.play();