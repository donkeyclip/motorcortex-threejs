import MC from "@kissmybutton/motorcortex";
import Player from "@kissmybutton/motorcortex-player/";
import threeDef from "../../src/index";
import { mainScene, man, plane } from "./entities";
import { manMorph, manMove, cameraMove } from "./animations";
const threejs = MC.loadPlugin(threeDef);
import animeDef from "@kissmybutton/motorcortex-anime";
const Anime = MC.loadPlugin(animeDef);

import dcSvg from "./assets/images/donkey clip logo.svg";
const entities = [mainScene, man, plane];

const scene = new MC.HTMLClip({
  html: `
    <div id="scene">
      <div id="curtains">
        <div id="logo">
          <img src="${dcSvg}"/>
        </div>
      <div/>
    </div>`,
  css: `
    #scene{
      display:flex;
      justify-content:center;
      align-items:center;
      width: 100%;
      height: 100%;
    }
    #curtains{
      width:100%;
      height:100%;
      background:black;
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:1;
      position:relative;
    }
    img{
      width:1700px;
    }
    `,
  audioSources: [
    {
      src: "./assets/sound/intro-sound.mp3",
      id: "intro-sound",
      classes: ["sound"],
      base64: false,
    },
    {
      src: "./assets/sound/desert-wind.mp3",
      id: "desert-wind",
      classes: ["sound"],
      base64: false,
    },
    {
      src: "./assets/sound/walk-grass.mp3",
      id: "walk-grass",
      classes: ["sound"],
      base64: false,
    },
  ],
  host: document.getElementById("clip"),
  containerParams: { width: "800px", height: "600px" },
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
        settings: {
          type: "SpotLight",
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
        settings: {
          type: "PointLight",
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
        settings: {
          type: "HemisphereLight",
          position: { set: [139, 175, 195] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: -231, y: 20, z: 195 },
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

const scaleinlogo = new Anime.Anime(
  {
    animatedAttrs: {
      transform: {
        scale: 0.3,
      },
    },
    initialValues: {
      transform: {
        scale: 0,
      },
    },
  },
  {
    duration: 1000,
    selector: `#logo`,
    easing: "easeInCubic",
  }
);
const fadeoutcurtains = new Anime.Anime(
  {
    animatedAttrs: {
      opacity: 0,
    },
  },
  {
    duration: 1000,
    selector: `#curtains`,
    easing: "easeInCubic",
  }
);

manMorph.map((morph) => clip.addIncident(morph.animation, morph.millisecond));
manMove.map((move) => clip.addIncident(move.animation, move.millisecond));
cameraMove.map((camera) =>
  clip.addIncident(camera.animation, camera.millisecond)
);

const introSound = new MC.AudioPlayback({
  selector: "~#intro-sound",
  startFrom: 0,
  duration: 6000,
});
const desertWind = new MC.AudioPlayback({
  selector: "~#desert-wind",
  startFrom: 0,
  duration: 28000,
});

const walkGrass = new MC.AudioPlayback({
  selector: "~#walk-grass",
  startFrom: 0,
  duration: 13000,
});

scene.addIncident(introSound, 0);
scene.addIncident(desertWind, 6000);
scene.addIncident(walkGrass, 6000);

scene.addIncident(scaleinlogo, 1500);
scene.addIncident(fadeoutcurtains, 6000);
scene.addIncident(clip, 6000);

new Player({
  theme: "mc-green",
  clip: scene,
  showVolume: true,
  pointerEvents: true,
});
