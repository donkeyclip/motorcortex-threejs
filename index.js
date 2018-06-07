const MC = require("@kissmybutton/motorcortex");
const threejsPluginDefinition = require("./main");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);

// Create a Clip
let css = `
  .myCam {
    background: palevioletred;
    border-radius: 64px;
    border:1px solid black;
    height: 64px;
    left: 0;
    position: absolute;
    top: 0;
    width: 64px;
  }
`;

let html = `<div class="myCam"></div>`;

let host = document.getElementById("clip");

let containerParams = {
  width: "384px",
  height: "384px"
};

const clip = new MC.Clip(null, {
  css,
  html,
  host,
  containerParams
});

// Create a Group
const group = new MC.Group();
const camera1 =  new threejsPlugin.Camera3D({
            animatedAttrs: {
                left: 800,
                opacity: 0
            }
        }, {
            id: "camera1",
            selector: ".myCam",
            duration: 1000
        });

group.addIncident(camera1,100)

// Add Group to Clip
clip.addIncident(group, 0);