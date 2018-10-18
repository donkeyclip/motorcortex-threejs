"use strict";

var Clip3D = require("./Clip3D");
var Object3D = require("./Object3D");
var MAE = require("./ModelAnimationExecution");
// const MC = require("@kissmybutton/motorcortex");
var Channel3D = require("./Channel3D");
// const MC = require("../motorcortex");

module.exports = {
  npm_name: "@kissmybutton/motorcortex-threejs",
  incidents: [{
    exportable: Clip3D,
    name: "Clip3D"
  }, {
    exportable: Object3D,
    name: "Object3D"
  }, {
    exportable: MAE,
    name: "MAE"
  }],
  channel: Channel3D,
  clip: Clip3D
};