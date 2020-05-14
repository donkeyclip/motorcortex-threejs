import Clip3D from "./Clip";
import Object3D from "./Object3D";
import MAE from "./ModelAnimationExecution";
import compositeAttributes from "./compoAttrs";

export default {
  npm_name: "@kissmybutton/motorcortex-threejs",
  incidents: [
    {
      exportable: Object3D,
      name: "Object3D"
    },
    {
      exportable: MAE,
      name: "MAE"
    }
  ],
  Clip: Clip3D,
  compositeAttributes
};
