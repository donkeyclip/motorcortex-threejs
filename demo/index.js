import { loadPlugin, HTMLClip } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import threeDef from "../src/index";
import { mainScene, man, plane } from "./entities";
import { manMorph, manMove, cameraMove } from "./animations";

const threejs = loadPlugin(threeDef);
const entities = [mainScene, man, plane];

const scene = new HTMLClip({
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
      type: "WebGLRenderer",
      parameters: [{ powerPreference: "high-performance" }],
      settings: {
        setClearColor: ["#111"],
        shadowMap: { enabled: true, type: "PCFSoftShadowMap" },
        physicallyCorrectLights: true,
      },
    },
    scenes: {},
    lights: [
      {
        id: "light_spot_pink",
        type: "PointLight",
        parameters: ["#111", 1],
        settings: {
          position: { x: -3, y: 2, z: 5 },
        },
      },
      {
        id: "DirectionalLight",
        type: "DirectionalLight",
        parameters: ["#fff", 1],
        settings: {
          position: { x: -3, y: 2, z: 5 },
        },
      },
      {
        id: "PointLight",
        type: "PointLight",
        parameters: ["#aa00ff", 1, 4],
        settings: {
          position: { x: 0, y: -3.5, z: 5 },
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
    controls: { enable: false, enableEvents: false, maxPolarAngle: Math.PI },
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
