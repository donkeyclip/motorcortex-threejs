import MC from "@kissmybutton/motorcortex";
import threeDefinition from "../../../src/index";
const threejs = MC.loadPlugin(threeDefinition);
import { ThemeliodesProblima_2 } from "../helpers";

export const manMorph = [
  {
    animation: new threejs.MorphAnimation(
      {
        attrs: {
          singleLoopDuration: 1000,
          animationFrames: 30,
          animationName: "Walk",
        },
        animatedAttrs: {
          time: 14000,
        },
      },
      {
        selector: "!#man",
        duration: 14000,
      }
    ),
    millisecond: 0,
  },
  {
    animation: new threejs.MorphAnimation(
      {
        attrs: {
          singleLoopDuration: 1000,
          animationFrames: 30,
          animationName: "Run",
        },
        animatedAttrs: {
          time: 14000,
        },
      },
      {
        selector: "!#man",
        duration: 14000,
      }
    ),
    millisecond: 14000,
  },
];

export const manMove = [
  {
    animation: new threejs.Object3D(
      {
        animatedAttrs: {
          position: {
            x: 665,
            y: -12.31,
            z: -161,
          },
          rotationSetY:
            Math.PI + ThemeliodesProblima_2(-20, 121, 665, -161).Gab,
        },
      },
      {
        selector: "!#man",
        duration: 14000,
      }
    ),
    millisecond: 0,
  },
  {
    animation: new threejs.Object3D(
      {
        animatedAttrs: {
          position: {
            x: 1807,
            y: -12.31,
            z: -99,
          },
          rotationSetY:
            Math.PI + ThemeliodesProblima_2(665, -161, 1807, -99).Gab,
        },
      },
      {
        selector: "!#man",
        duration: 14000,
      }
    ),
    millisecond: 14000,
  },
];

export const cameraMove = [
  {
    animation: new threejs.Object3D(
      {
        animatedAttrs: {
          targetEntity: "!#man",
          position: {
            x: 231,
            y: 50,
            z: 195,
          },
        },
      },
      {
        selector: "!#camera_1",
        duration: 6000,
        easing: "easeInOutCubic",
      }
    ),
    millisecond: 0,
  },
  {
    animation: new threejs.Object3D(
      {
        animatedAttrs: {
          targetEntity: "!#man",
          position: {
            x: 307,
            y: 59,
            z: 300,
          },
        },
      },
      {
        selector: "!#camera_1",
        duration: 8000,
        easing: "easeInOutCubic",
      }
    ),
    millisecond: 6000,
  },
  {
    animation: new threejs.Object3D(
      {
        animatedAttrs: {
          targetEntity: "!#man",
          position: {
            x: 1171,
            y: 46,
            z: 0,
          },
        },
      },
      {
        selector: "!#camera_1",
        duration: 8000,
        easing: "easeInOutCubic",
      }
    ),
    millisecond: 14000,
  },
  {
    animation: new threejs.Object3D(
      {
        animatedAttrs: {
          targetEntity: "!#man",
          position: {
            x: 1767,
            y: 65,
            z: 191,
          },
        },
      },
      {
        selector: "!#camera_1",
        duration: 6000,
        easing: "easeInOutCubic",
      }
    ),
    millisecond: 22000,
  },
];
