"use strict";

var Clip3D = require("./Clip3D");

var Object3D = require("./Object3D");

var MAE = require("./ModelAnimationExecution");

var compositeAttributes = require("./compoAttrs");

module.exports = {
  npm_name: "@kissmybutton/motorcortex-threejs",
  incidents: [{
    exportable: Object3D,
    name: "Object3D"
  }, {
    exportable: MAE,
    name: "MAE"
  }],
  Clip: Clip3D,
  compositeAttributes: compositeAttributes
};