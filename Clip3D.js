const MC = require('@kissmybutton/motorcortex');
global.THREE = require('three');
require('three/examples/js/renderers/CSS3DRenderer');
require('three/examples/js/controls/OrbitControls');
var controls;
// const MC = require('../motorcortex');


// console.log(MC)

const Helper = MC.Helper;
const helper = new MC.Helper();
const Group = MC.Group;
const conf = MC.conf;
// context handlers
const Iframe3DContextHandler = require('./Iframe3DContextHandler');

class Clip3D extends Group{
    /**
     * @param {object} props - an object that should contain all of the following keys:
     * - html (the html template to render)
     * - css (the css template of the isolated tree)
     * - initParams (optional / the initialisation parameteres that will be passed both on the css and the html templates in order to render)
     * - host (an Element object that will host the isolated tree)
     * - containerParams (an object that holds parameters to affect the container of the isolated tree, e.g. width, height etc)
    */
    constructor(attrs={}, props={}){
        if(!helper.isObject(props)){
            helper.error(`Self Contained Incident expects an object on its second argument on the constructor. ${typeof props} passed`);
            return false;
        }
        
        if(!props.hasOwnProperty('id')){
            helper.error(`Self Contained Incident expects the 'id' key on its constructor properties which is missing`);
            return false;
        }
        
        
        if(!props.hasOwnProperty('host')){
            helper.error(`Self Contained Incident expects the 'host' key on its constructor properties which is missing`);
            return false;
        }

        if(!props.hasOwnProperty('containerParams')){
            helper.error(`Self Contained Incident expects the 'containerParams' key on its constructor properties which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('scenes')){
            helper.error(`Self Contained Incident expects the 'scenes' key on its constructor attributes which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('lights')){
            helper.error(`Self Contained Incident expects the 'lights' key on its constructor attributes which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('cameras')){
            helper.error(`Self Contained Incident expects the 'cameras' key on its constructor attributes which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('renderers')){
            helper.error(`Self Contained Incident expects the 'renderers' key on its constructor attributes which is missing`);
            return false;
        }

        let ContextHanlder = null;
        if(conf.selfContainedContextHandler === 'iframe'){
            ContextHanlder = Iframe3DContextHandler;
        }
        
        const contextHanlder = new ContextHanlder(props);
        
        super(attrs, props);

        this.ownContext = contextHanlder.context;
        this.isTheClip = true;
        this.ownContext.elements = {
            lights: [],
            cameras: [],
            scenes: [],
            renderers: [],
            models: []
        };

        for (let camera of attrs.cameras){

            camera.settings = camera.settings || {};
            camera.settings.type = camera.settings.type || "PerspectiveCamera";
            if (camera.settings.type === "PerspectiveCamera") {
                camera.settings.fov = camera.settings.fov || 45;
                camera.settings.aspect = camera.settings.aspect || this.ownContext.window.innerWidth / this.ownContext.window.innerHeight;
                camera.settings.near = camera.settings.near || 1;
                camera.settings.far = camera.settings.far || 1000;
            } else {
                camera.settings.left = camera.settings.left || this.ownContext.window.innerWidth / - 2;
                camera.settings.right = camera.settings.right || this.ownContext.window.innerWidth / 2;
                camera.settings.top = camera.settings.top || this.ownContext.window.innerHeight / 2;
                camera.settings.bottom = camera.settings.bottom || this.ownContext.window.innerHeight / - 2;
                camera.settings.near = camera.settings.near || 1;
                camera.settings.far = camera.settings.far || 1000;
            }
            camera.settings.position = camera.settings.position || {};
            camera.settings.position.x = camera.settings.position.x || 0;
            camera.settings.position.y = camera.settings.position.y || 0;
            camera.settings.position.z = camera.settings.position.z || 1000;

            camera.settings.rotation = camera.settings.rotation || {};
            camera.settings.rotation.x = camera.settings.rotation.x || 0;
            camera.settings.rotation.y = camera.settings.rotation.y || 0;
            camera.settings.rotation.z = camera.settings.rotation.z || 0;

            const { type, fov, aspect, near, far } = camera.settings;
            this.ownContext.elements.cameras.push(
                {
                    id: camera.id,
                    groups: camera.groups,
                    settings: camera.settings,
                    object: type === "PerspectiveCamera" ? new THREE[type]( fov, aspect, near, far) : new THREE[type]( left, right, top, bottom, near, far)
                }
            )

            let length = this.ownContext.elements.cameras.length - 1;

            this.ownContext.elements.cameras[length].object.position.x = camera.settings.position.x;
            this.ownContext.elements.cameras[length].object.position.y = camera.settings.position.y;
            this.ownContext.elements.cameras[length].object.position.z = camera.settings.position.z;
            this.ownContext.elements.cameras[length].object.rotation.x = camera.settings.rotation.x;
            this.ownContext.elements.cameras[length].object.rotation.y = camera.settings.rotation.y;
            this.ownContext.elements.cameras[length].object.rotation.z = camera.settings.rotation.z;

            console.log(this.ownContext.elements.cameras[length].object.rotation)
        }

        for (let scene of attrs.scenes){
            this.ownContext.elements.scenes.push(
                {
                    id: scene.id,
                    groups: scene.groups,
                    object: new THREE.Scene()
                }
            )

        }

        for (let renderer of attrs.renderers){
            renderer.parameters = renderer.parameters || null;

            this.ownContext.elements.renderers.push(
                {
                    id: renderer.id,
                    groups: renderer.groups,
                    object: new THREE.WebGLRenderer()
                }
            )

            let length = this.ownContext.elements.renderers.length - 1;

            renderer.settings = renderer.settings || {};
            renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [this.ownContext.window.devicePixelRatio];
            renderer.settings.setSize = renderer.settings.setSize || [ this.ownContext.window.innerWidth, this.ownContext.window.innerHeight ];

            for (const setting in renderer.settings) {
                console.log(setting,renderer.settings[setting])
                this.ownContext.elements.renderers[length].object[setting](...renderer.settings[setting]);
            }
            
            this.ownContext.elements.renderers[0].object.shadowMap.enabled = true;
            this.ownContext.elements.renderers[0].object.shadowMap.type = THREE.PCFSoftShadowMap;

        }

        for (let light of attrs.lights){
            light.parameters = light.parameters || [0xffffff,1,100];

            this.ownContext.elements.lights.push(
                {
                    id: light.id,
                    groups: light.groups,
                    object: new THREE.DirectionalLight(...light.parameters)
                }
            )

            let length = this.ownContext.elements.lights.length - 1;
            console.log(this.ownContext.getElements('#scene1')[0].object)
            light = this.ownContext.elements.lights[length].object;

            light.position.set( 0, 1, 0 );          //default; light shining from top
            light.castShadow = true;            // default false
            light.shadow.mapSize.width = this.ownContext.window.innerWidth;  // default
            light.shadow.mapSize.height = this.ownContext.window.innerHeight; // default
            light.shadow.camera.near = 0.5;    // default
            light.shadow.camera.far = 10000;     // default

            this.ownContext.getElements('#scene1')[0].object.add(this.ownContext.elements.lights[length].object)
            

            
        }

        this.controls = new THREE.OrbitControls( this.ownContext.getElements('#camera2')[0].object, document.body)
        this.controls.update()
        // console.log(this.controls)
        this.attrs = attrs;
        // run render function
        // this.render.bind(this);
        // this.animate.bind(this);

        this.render();
        this.animate = () => {
            // console.log("asdf ")
            // console.log("onece", this)
            requestAnimationFrame( this.animate );
            // console.log("asdf")
            // required if controls.enableDamping or controls.autoRotate are set to true
            this.controls.update();

            this.ownContext.getElements("#renderer1")[0].object.render(
                this.ownContext.getElements("#scene1")[0].object,
                this.ownContext.getElements("#camera2")[0].object
            );

        }
        this.animate()
    }


    _getChannel(channelId){
        if(!this.instantiatedChannels.hasOwnProperty(channelId)){
            return null;
        } else {
            return this.instantiatedChannels[channelId];
        }
    }

    render() {
        
        var geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
        var material = new THREE.MeshBasicMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = true; //default is false
        mesh.receiveShadow = false; //default

        var geometry = new THREE.PlaneGeometry( 50, 20, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        plane.castShadow = true;
        plane.position.z = -1
        plane.receiveShadow = true;
        var axesHelper = new THREE.AxesHelper( 5 );
        this.ownContext.elements.scenes[0].object.add( mesh );
        this.ownContext.elements.scenes[0].object.add( plane );
        this.ownContext.elements.scenes[0].object.add( axesHelper );
        console.log(this.ownContext)
        for (let i in this.ownContext.elements.renderers) {
            this.ownContext.rootElement.appendChild( this.ownContext.elements.renderers[i].object.domElement );
        }

        // this.ownContext.window.addEventListener( 'resize', onWindowResize, false );
        for (let i in this.attrs.renders) {
            this.ownContext.getElements(this.attrs.renders[i].renderer)[0].object.render(
                this.ownContext.getElements(this.attrs.renders[i].scene)[0].object,
                this.ownContext.getElements(this.attrs.renders[i].camera)[0].object
            );
        }
        // this.controls.update();
        // this.animate(); 
    }
            

    lastWish(){
        // this.ownContext.unmount();
    }
}

// function onWindowResize() {
//                 camera.aspect = window.innerWidth / window.innerHeight;
//                 camera.updateProjectionMatrix();
//                 renderer.setSize( window.innerWidth, window.innerHeight );
//             }
//             function animate() {
//                 requestAnimationFrame( animate );
//                 mesh.rotation.x += 0.005;
//                 mesh.rotation.y += 0.01;
//             }

console.log("cliip",Clip3D)
// module.exports = Clip3D;


module.exports = Clip3D;
