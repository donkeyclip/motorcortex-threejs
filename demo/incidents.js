import { loadPlugin } from "@donkeyclip/motorcortex";
import threeDef from "../src/index";
const threejs = loadPlugin(threeDef);

/* configuration and helper functions */
export const cameraInitialPosition = { x: -50, y: 20, z: 20 };
const cameraAnimation = (position, duration) =>
  new threejs.ObjectAnimation(
    {
      animatedAttrs: {
        targetEntity: "!#man",
        position,
      },
    },
    {
      selector: "!#camera_1",
      duration,
    }
  );

/* actual incidents */
export const animateScene = new threejs.MorphAnimation(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationName: "Idle",
    },
    animatedAttrs: {
      time: 10000,
    },
  },
  {
    selector: "!#main-scene",
    duration: 10000,
  }
);
export const animateMan = new threejs.MorphAnimation(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationName: "armature|walk",
    },
    animatedAttrs: {
      time: 10000,
    },
  },
  {
    selector: "!#man",
    duration: 10000,
  }
);
export const moveMan = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      position: { x: -10, y: 0, z: -1 },
    },
  },
  {
    selector: "!#man",
    duration: 10000,
  }
);
export const cameraZoomIn = () =>
  cameraAnimation({ x: -20, y: 20, z: 20 }, 5000);

export const cameraGoDown = () => cameraAnimation({ x: -19, y: 2, z: 4 }, 2000);
export const cameraWatchMan = () =>
  cameraAnimation({ x: -19, y: 2, z: 4 }, 3000);
