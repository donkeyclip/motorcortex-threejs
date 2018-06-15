// const MC = require('@kissmybutton/motorcortex');
const MC = require('../motorcortex');
global.THREE = require('three');
console.log(MC)

// require('three/examples/js/controls/OrbitControls');
const helper = new MC.Helper();
const THREEClip = MC.Clip3D;

// console.log("CLIIP ",Clip3D)
// class THREEClip extends Clip3D {
//     render(){
//         console.log(this)
//     }
// }
// THREEClip.render = function (argument) {
//     console.log(this)
// }
module.exports = MC.Clip3D;
