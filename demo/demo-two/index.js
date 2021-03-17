const MC = require("@kissmybutton/motorcortex").default;
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/");
const threejsPluginDefinition = require("../src/index");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);

const planet_1 = {
  id: "planet_1",
  model: {
    id: "planet",
    loader: "GLTFLoader",
    file: "./models/firstAnimation2.glb",
  },
  settings: {
    position: { x: 0, y: 0, z: 0 },
  },
};

const skyBox = {
  geometry: {
    type: "BoxGeometry",
    parameters: [20, 20, 20],
  },
  material: {
    type: "MeshStandardMaterial",
    parameters: [
      {
        emissive:"0xd83b3b",
        color: "0x2194ce",
      },
    ],
  },
  settings: {
    entityType: "Mesh",
  },
};



const scene = new MC.HTMLClip({
  html: `
    <div id="scene">

    </div>`,
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

const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: ["#999"] } },
    scenes: { id: "scene" },
    lights: [
      {
        parameters: ["#457", 1],
        settings: {
          type: "SpotLight",
          position: { set: [-40, 80, 20] },
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
          position: { set: [-40, 80, 20] },
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
          position: { set: [-40, 180, 20] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: 10.761, y: 1.4348, z: 0.48725 },
        lookAt: [0, 0, 0],
      },
    },
    entities: [planet_1,skyBox],
    controls: { enable: true },
  },
  {
    // host: document.getElementById("clip"),
    selector: "#scene",
    containerParams: { width: "100%", height: "100%" },
  }
);

for (let index = 0; index <= 80; index++) {
  const rand = Math.floor(Math.random() * (12000 - 7500 + 1) + 7500);
  const planetAnimation = new threejsPlugin.MAE(
    {
      attrs: {
        singleLoopDuration: 7000,
        animationFrames: 24,
        animationName: `planet.0${index < 10 ? "0" + index : index}Action`,
      },
      animatedAttrs: {
        [`time_${index}`]: 700,
      },
    },
    {
      selector: "!#planet_1",
      duration: rand,
      delay: 12000-rand
    }
  );
  clip.addIncident(planetAnimation, 0);
}
const spaceshipAnimation = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 12000,
      animationFrames: 24,
      animationName: `Action`,
    },
    animatedAttrs: {
      time: 12000,
    },
  },
  {
    selector: "!#planet_1",
    duration: 12000,
  }
);
clip.addIncident(spaceshipAnimation, 0);


scene.addIncident(clip, 0);

window.clip = clip;
//error when loading anime after clip
new Player({
  theme: "mc-green",
  clip: scene,
  scaleToFit: true,
  showVolume: true,
  pointerEvents: true
});
