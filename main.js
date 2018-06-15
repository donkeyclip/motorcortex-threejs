const Clip3D = require('./Clip3D');
const MC = require("../motorcortex");
require('three/examples/js/renderers/CSS3DRenderer');
// const Channel = require('./Channel');

// class Channel extends MC.AttributeChannel {
//     constructor(props){
//         super(props)
//         this.ratio = this.context.rootElement.offsetWidth / this.context.rootElement.offsetHeight;
        
//         //camera
//         this.camera = new THREE.PerspectiveCamera( 45, this.ratio, 1, 10000 );

//         this.camera.position.set(0,0,0);
//         this.camera.lookAt(0,0,0)

//         this.CSS3DRenderer = new THREE.CSS3DRenderer();
//         this.CSS3DRenderer
//             .setSize(
//                 this.context.rootElement.offsetWidth,
//                 this.context.rootElement.offsetHeight
//             );
//        //CSS3D Scene
//         this.CSS3DScene = new THREE.Scene();
//         this.CSS3Objects = {};
//     }

//     getCSS3Objects(element) {
//         if (this.CSS3Objects[element.dataset.motorcortex2Id]) {
//             return this.CSS3Objects[element.dataset.motorcortex2Id];
//         }
//         this.CSS3Objects[element.dataset.motorcortex2Id] = new THREE.CSS3DObject(element);
//         this.CSS3Objects[element.dataset.motorcortex2Id].rotation.y = Math.PI;
//         this.CSS3Objects[element.dataset.motorcortex2Id].position.set(0,0,0);

//         this.CSS3DScene.add(this.CSS3Objects[element.dataset.motorcortex2Id]);

//         // console.log(this.CSS3Objects)
//         return this.CSS3Objects[element.dataset.motorcortex2Id];
//     }
// } 

module.exports = {
    npm_name: "@kissmybutton/motorcortex-threejs",
    incidents: [
        {
            exportable: Clip3D
        }
    ],
    channel: MC.AttributeChannel
}