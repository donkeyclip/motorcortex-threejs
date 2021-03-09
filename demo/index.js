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
    file: "./models/firstAnim3.glb",
  },
  settings: {
    position: { x: 0, y: 0, z: 0 },
  },
};

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

const clip = new threejsPlugin.Clip(
  {
    renderers: { settings: { setClearColor: ["#999"] } },
    scenes: { id: "scene", fog: ["#999", 0.1, 500] },
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
        position: { x: 0, y: 0, z: 0 },
        lookAt: [0, 0, 0],
      },
    },
    entities: [planet_1],
    controls: { enable: true },
  },
  {
    // host: document.getElementById("clip"),
    selector: "#scene",
    containerParams: { width: "100%", height: "100%" },
  }
);

for (let index = 0; index <= 80; index++) {
  const rand = Math.floor(Math.random() * 4500 + 7000);
  const planetAnimation = new threejsPlugin.MAE(
    {
      attrs: {
        singleLoopDuration: rand,
        animationFrames: 30,
        animationName: `planet.0${index < 10 ? "0" + index : index}Action`,
      },
      animatedAttrs: {
        [`time_${index}`]: rand,
      },
    },
    {
      selector: "!#planet_1",
      duration: rand,
      easing: "easeOutExpo",
    }
  );
  clip.addIncident(planetAnimation, 0);
}
scene.addIncident(clip, 0);

window.clip = clip;
//error when loading anime after clip
new Player({
  theme: "mc-green",
  clip: scene,
  scaleToFit: true,
  showVolume: true,
});
