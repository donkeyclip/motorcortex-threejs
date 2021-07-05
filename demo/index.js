import MC from "@kissmybutton/motorcortex";
import Player from "@kissmybutton/motorcortex-player";
import threeDef from "../src/index";
import { mainScene, man, plane } from "./entities";
import { manMorph, manMove, cameraMove } from "./animations";

const threejs = MC.loadPlugin(threeDef);
const entities = [mainScene, man, plane];

const scene = new MC.HTMLClip({
  html: `<div id="scene"></div>`,
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
  containerParams: { width: "1920px", height: "1080px" },
});

const clip = new threejs.Clip(
  {
    renderers: {
      settings: {
        setClearColor: ["#999"],
        physicallyCorrectLights: true,
      },
    },
    scenes: { id: "scene_1", fog: ["#947956", 0.1, 5000] },
    lights: [
      {
        parameters: ["#457", 1],
        type: "SpotLight",
        settings: {
          position: { set: [139, 175, 195] },
          shadow: {
            radius: 1.2,
            camera: {
              near: 0.5,
              far: 500,
              left: -100,
              bottom: -100,
              right: 100,
              top: 100,
            },
            bias: 0.01,
            mapSize: { x: 1024 * 6, y: 1024 * 6 },
          },
        },
      },
      {
        parameters: ["#999", 1],
        type: "PointLight",
        settings: {
          position: { set: [139, 175, 195] },
          shadow: {
            radius: 1.2,
            camera: {
              near: 0.5,
              far: 500,
              left: -100,
              bottom: -100,
              right: 100,
              top: 100,
            },
            bias: 0.01,
            mapSize: { x: 1024 * 6, y: 1024 * 6 },
          },
        },
      },
      {
        type: "HemisphereLight",
        settings: {
          position: { set: [139, 175, 195] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: -92, y: 103, z: 324 },
        lookAt: [0, 0, 0],
        far: 30000,
      },
    },
    entities,
    controls: { enable: true, enableEvents: true },
  },
  {
    selector: "#scene",
    containerParams: { width: "100%", height: "100%" },
  }
);

manMorph.map((morph) => clip.addIncident(morph.animation, morph.millisecond));
manMove.map((move) => clip.addIncident(move.animation, move.millisecond));
cameraMove.map((camera) =>
  clip.addIncident(camera.animation, camera.millisecond)
);

scene.addIncident(clip, 0);

new Player({
  theme: "green",
  clip: scene,
});
