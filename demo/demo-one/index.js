import MC from "@kissmybutton/motorcortex";
import Player from "@kissmybutton/motorcortex-player/";
import threeDefinition from "../../src/index";
import { mainScene, skeleton } from "./entities";
import { skeletonWalk, skeletonMove, cameraMove } from "./animations";
const threejs = MC.loadPlugin(threeDefinition);

const entities = [mainScene, skeleton];

const scene = new MC.HTMLClip({
  html: `
    <div id="scene"></div>`,
  css: `
    #scene{
      display:flex;
      justify-content:center;
      align-items:center;
      width: 100%;
      height: 100%;
    }
    `,
  host: document.getElementById("clip"),
  containerParams: { width: "100%", height: "70%" },
});

const clip = new threejs.Clip(
  {
    renderers: {
      settings: { setClearColor: ["#999"], physicallyCorrectLights: true },
    },
    scenes: { id: "scene" },
    lights: [
      {
        parameters: ["#fff", 1],
        settings: {
          type: "AmbientLight",
          position: { set: [0, 0, 0] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: -231, y: 90, z: 195 },
        lookAt: [0, 0, 0],
      },
    },
    entities,
    controls: { enable: true },
  },
  {
    selector: "#scene",
    containerParams: { width: "100%", height: "100%" },
  }
);
clip.addIncident(skeletonWalk, 0);
clip.addIncident(skeletonMove, 0);
clip.addIncident(cameraMove, 0);
scene.addIncident(clip, 0);
new Player({
  theme: "mc-green",
  clip: scene,
  scaleToFit: true,
  showVolume: true,
  pointerEvents: true,
});
