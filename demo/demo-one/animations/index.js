import MC from "@kissmybutton/motorcortex";
import threeDefinition from "../../../src/index";
const threejs = MC.loadPlugin(threeDefinition);
import { ThemeliodesProblima_2 } from "../helpers";
export const skeletonWalk = new threejs.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "Take 001",
    },
    animatedAttrs: {
      time: 50000,
    },
  },
  {
    selector: "!#skeleton",
    duration: 50000,
  }
);

const xa = -20.89;
const za = 33.15;
const xb = 1730.76;
const yb = -12.31;
const zb = -138.29;
const rot = ThemeliodesProblima_2(xa, za, xb, zb).Gab;
export const skeletonMove = new threejs.Object3D(
  {
    animatedAttrs: {
      position: {
        x: xb,
        y: yb,
        z: zb,
      },
      rotationSetY: rot,
    },
  },
  {
    selector: "!#skeleton",
    duration: 50000,
  }
);

export const cameraMove = new threejs.Object3D(
  {
    animatedAttrs: {
      targetEntity: "!#skeleton",
      position: {
        x: 1857,
        y: 50,
        z: 172,
      },
    },
  },
  {
    selector: "!#camera_1",
    duration: 45000,
  }
);
