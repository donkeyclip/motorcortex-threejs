import Clip3D from "./Clip";
import ObjectAnimation from "./ObjectAnimation";
import MorphAnimation from "./MorphAnimation";
import compositeAttributes from "./compoAttrs";

export default {
  npm_name: "@kissmybutton/motorcortex-threejs",
  incidents: [
    {
      exportable: ObjectAnimation,
      name: "ObjectAnimation",
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
