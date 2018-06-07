const Animation = require('./Camera3D');
import MC from "@kissmybutton/motorcortex";

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