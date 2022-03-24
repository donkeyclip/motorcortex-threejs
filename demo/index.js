import { loadPlugin /* , HTMLClip  */ } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import threeDef from "../src/index";
import { mainScene, man } from "./entities";
import {
  animateMan,
  animateScene,
  cameraInitialPosition,
  cameraGoDown,
  cameraZoomIn,
  moveMan,
} from "./incidents";

const threejs = loadPlugin(threeDef);
const entities = [mainScene, man];

// const scene = new HTMLClip({
//   html: `<div id="scene"></div>`,
//   css: `

//     #scene{
//       display:flex;
//       justify-content:center;
//       align-items:center;
//       width: 100%;
//       height: 100%;
//     }
//   `,
//   host: document.getElementById("clip"),
//   containerParams: { width: "1920px", height: "1080px" },
// });

const clip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [],
    },
    scenes: {},
    lights: [
      {
        // addHelper: true,
        id: "light_spot_pink",
        type: "PointLight",
        parameters: ["#fff", 1],
        settings: {
          position: { x: -50, y: 20, z: -20 },
        },
      },
      {
        // addHelper: true,
        id: "DirectionalLight",
        type: "DirectionalLight",
        parameters: ["#fff", 1],
        settings: {
          position: { x: 50, y: 20, z: 20 },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: cameraInitialPosition,
        lookAt: [0, 0, 0],
        far: 30000,
      },
    },
    entities,
    // controls: { enable: true, enableEvents: true, maxPolarAngle: Math.PI },
  },
  {
    // selector: "#scene",
    host: document.getElementById("clip"),
    containerParams: { width: "100%", height: "100%" },
  }
);
clip.addIncident(cameraZoomIn(), 0);
clip.addIncident(animateScene, 0);
clip.addIncident(animateMan, 0);
clip.addIncident(cameraGoDown(), 5000);
clip.addIncident(moveMan, 0);
// scene.addIncident(clip, 0);

new Player({
  clip /* : scene */,
  pointerEvents: true,
});
