const Clip3D = require("./Clip3D");
const Object3D = require("./Object3D");
const MAE = require("./ModelAnimationExecution");
const MC = require("@kissmybutton/motorcortex");
// const MC = require("../motorcortex");

module.exports = {
  npm_name: "@kissmybutton/motorcortex-threejs",
  incidents: [
    {
      exportable: Clip3D
    },
    {
      exportable: Object3D
    },
    {
      exportable: MAE
    }
  ],
  channel: MC.AttributeChannel,
  clip: Clip3D
};
