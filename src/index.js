import Clip3D from "./Clip";
import Object3D from "./Object3D";
import MorphAnimation from "./MorphAnimation";
import compositeAttributes from "./compoAttrs";

export default {
  npm_name: "@kissmybutton/motorcortex-threejs",
  incidents: [
    {
      exportable: Object3D,
      name: "Object3D",
    },
    {
      exportable: MorphAnimation,
      name: "MorphAnimation",
    },
  ],
  Clip: Clip3D,
  helpers: {},
  compositeAttributes,
};
