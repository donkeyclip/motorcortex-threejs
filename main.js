const Camera3D = require('./Camera3D');
const MC = require("@kissmybutton/motorcortex");

// const Channel = require('./Channel');

module.exports = {
    npm_name: "@kissmybutton/motorcortex-threejs",
    incidents: [
        {
            exportable: Camera3D
        }    
    ],
    channel: MC.AttributeChannel
}