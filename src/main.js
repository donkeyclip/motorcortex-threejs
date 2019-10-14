const Clip3D = require("./Clip3D");
const Object3D = require("./Object3D");
const MAE = require("./ModelAnimationExecution");
const compositeAttributes = require("./compoAttrs");

module.exports = {
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
