const Clip3D = require('./Clip3D');
const MC = require('@kissmybutton/motorcortex');
// const MC = require("../motorcortex");

module.exports = {
    npm_name: "@kissmybutton/motorcortex-threejs",
    incidents: [
    {
        exportable : Clip3D
    }
    ],
    channel: MC.AttributeChannel, 
    clip: Clip3D
}