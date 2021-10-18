import Clip3D from "./Clip";
import ObjectAnimation from "./ObjectAnimation";
import MorphAnimation from "./MorphAnimation";
import compositeAttributes from "./compoAttrs";
import { name, version } from "../package.json";
export default {
  npm_name: name,
  version,
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
