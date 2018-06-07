const MC = require('@kissmybutton/motorcortex');
global.THREE = require('three');
require('three/examples/js/renderers/CSS3DRenderer');
require('three/examples/js/controls/OrbitControls');
const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;
console.log(global)
var camera;
var controls;
var scene;
var torus;
var light;
var renderer;
var scene2;
var renderer2;
var div;
var element;
class Camera3D extends TimedIncident {
    onInitialise(attrs, incidentProps) {
        this.animationInitialised = false;
        // if(!this.attrs.attrs.hasOwnProperty('easing')){
        //     this.attrs.attrs.easing = 'linear';
        // }

    }

    onGetContext(){
        if(this.animationInitialised){
            return ;
        }
        console.log(this.elements)
        console.log(this.elements[0].offsetWidth)
        //camera
        camera = new THREE.PerspectiveCamera(45, this.elements[0].offsetWidth / this.elements[0].offsetHeight, 1, 10000);
        camera.position.set(0, 0, -100);
        
        //controls
        controls = new THREE.OrbitControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        
        //Scene
        // scene = new THREE.Scene();
        
        //TorusGeometry
        // torus = new THREE.Mesh(new THREE.TorusGeometry(120, 60, 40, 40),
        //                        new THREE.MeshNormalMaterial());
        // torus.position.set(0, 0, 0);
        // // scene.add(torus);
        
        // //HemisphereLight
        // light = new THREE.HemisphereLight(0xffbf67, 0x15c6ff);
        // scene.add(light);
        
        // //WebGL Renderer
        // renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
        // renderer.setClearColor(0xffffff, 0)
        // renderer.setSize(this.elements[0].offsetWidth, this.elements[0].offsetHeight);
        // renderer.domElement.style.zIndex = 5;
       

       //CSS3D Scene
        scene2 = new THREE.Scene();
        
        //HTML
        element = document.createElement('div');
        element.innerHTML = 'Plain text inside a div.';
        element.className = 'three-div';
        
        //CSS Object
        div = new THREE.CSS3DObject(element);
        div.position.x = 0;
        div.position.y = 0;
        div.position.z = 0;
        div.rotation.y = Math.PI;
        scene2.add(div);
        
        //CSS3D Renderer
        renderer2 = new THREE.CSS3DRenderer();
        renderer2.setSize(this.elements[0].offsetWidth, this.elements[0].offsetHeight);
        // renderer2.domElement.style.position = 'absolute';
        // renderer2.domElement.style.top = 0;
        // this.elements[0].appendChild(renderer.domElement);
        
        
        this.elements[0].appendChild(renderer2.domElement);
        animate();
        this.animationInitialised = true;
    }
    
    getScratchValue(mcid, attribute){
        // return Velocity(this.getElementByMCID(mcid), "style", attribute);
    }
    
    onProgress(progress, millisecond){
        
    }
    
    // lastWish(){
    //     this.stop();
    //     this.complete();
    // }
    

}

function animate() {
            requestAnimationFrame(animate);
            renderer2.render(scene2, camera);
            renderer.render(scene, camera);
            controls.update();
        }
module.exports = Camera3D;
