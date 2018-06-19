const MC = require('@kissmybutton/motorcortex');
global.THREE = require('three');
require('three/examples/js/renderers/CSS3DRenderer');
require('three/examples/js/controls/OrbitControls');
// const MC = require('../motorcortex');

const Helper = MC.Helper;
const helper = new MC.Helper();
const Group = MC.Group;
const conf = MC.conf;
const Iframe3DContextHandler = require('./Iframe3DContextHandler');

class Clip3D extends Group{
    /**
     * @param {object} props - an object that should contain all of the
     * following keys:
     * - html (the html template to render)
     * - css (the css template of the isolated tree)
     * - initParams (optional / the initialisation parameters that will be
     * passed both on the css and the html templates in order to render)
     * - host (an Element object that will host the isolated tree)
     * - containerParams (an object that holds parameters to affect the
     * container of the isolated tree, e.g. width, height etc)
    */
    constructor(attrs={}, props={}){
        super(attrs, props);

        const checks = this.runChecks(attrs,props);

        if(!checks) {
            return false;
        }

        let ContextHanlder = null;
        if(conf.selfContainedContextHandler === 'iframe'){
            ContextHanlder = Iframe3DContextHandler;
        }
        
        const contextHanlder = new ContextHanlder(props);

        this.ownContext = contextHanlder.context;
        this.isTheClip = true;

        this.attrs = attrs;

        this.ownContext.elements = {
            lights: [],
            cameras: [],
            scenes: [],
            renderers: [],
            models: []
        };

        /*
        * CAMERAS
        */

        for (let camera of attrs.cameras){
            this.initializeCamera(camera);
            const { type } = camera.settings;
            this.ownContext.elements.cameras.push(
                {
                    id: camera.id,
                    groups: camera.groups,
                    settings: camera.settings,
                    object: new THREE[type](...camera.parameters)
                }
            )

            let length = this.ownContext.elements.cameras.length - 1;
            const cameraObj = this.ownContext.elements.cameras[length].object;
            this.applySettingsToObjects(camera.settings, cameraObj);
            // case any parameters updated
            cameraObj.updateProjectionMatrix();
        }

        /*
        * SCENES
        */

        for (let scene of attrs.scenes){
            this.ownContext.elements.scenes.push(
                {
                    id: scene.id,
                    groups: scene.groups,
                    object: new THREE.Scene()
                }
            )

        }

        /*
        * RENDERERS
        */

        for (let renderer of attrs.renderers){
            this.initializeRenderer(renderer);
            const { type } = renderer.settings;
            console.log(type)
            this.ownContext.elements.renderers.push(
                {
                    id: renderer.id,
                    groups: renderer.groups,
                    object: new THREE[type](...renderer.parameters)
                }
            )

            let length = this.ownContext.elements.renderers.length - 1;
            const rendererObj = this.ownContext
                .elements
                .renderers[length]
                .object;
            this.applySettingsToObjects(renderer.settings, rendererObj )
        }

        /*
        * LIGHTS
        */

        for (let light of attrs.lights){
            this.initializeLight(light);

            this.ownContext.elements.lights.push(
                {
                    id: light.id,
                    groups: light.groups,
                    object: new THREE[light.settings.type](...light.parameters)
                }
            )

            let length = this.ownContext.elements.lights.length - 1;

            const lightObj = this.ownContext.elements.lights[length].object;
            
            this.applySettingsToObjects(light.settings, lightObj );

            for (let scene of this.ownContext.getElements(light.applyToSelector)){

                scene.object.add(lightObj)

            }

        }

        /*
        * MODELS
        */
        for (let model of attrs.models){
            this.ownContext.elements.models.push(
                model
            )
            for (let scene of this.ownContext.getElements(model.scenes)) {
                scene.object.add(model.object);
            }

        }
        this.render();

        this.controls = new THREE.OrbitControls( this.ownContext.getElements('#camera1')[0].object, document.body)
        this.controls.update()

        this.animate = () => {
            requestAnimationFrame( this.animate );
            this.controls.update();
            for (let i in this.attrs.renders) {
                this.ownContext.getElements(this.attrs.renders[i].renderer)[0].object.render(
                    this.ownContext.getElements(this.attrs.renders[i].scene)[0].object,
                    this.ownContext.getElements(this.attrs.renders[i].camera)[0].object
                );
            }
        }

        this.animate()
    }

    applySettingsToObjects(settings, obj) {
        const target = obj;
        
        for (const key in settings) {
            if (settings[key] instanceof Array) {
                obj[key](...settings[key]);
            } else if ( settings[key] !==  Object(settings[key])){
                // is primitive
                obj[key] = settings[key];
                continue;
            }
            this.applySettingsToObjects (settings[key], target[key])
        }
    }

    _getChannel(channelId){
        if(!this.instantiatedChannels.hasOwnProperty(channelId)){
            return null;
        } else {
            return this.instantiatedChannels[channelId];
        }
    }

    render() {
        for (let i in this.ownContext.elements.renderers) {
            this.ownContext.rootElement.appendChild( this.ownContext.elements.renderers[i].object.domElement );
            this.ownContext.elements.renderers[i].object.domElement.style.zIndex = i;
            this.ownContext.elements.renderers[i].object.domElement.style.top = 0;
            this.ownContext.elements.renderers[i].object.domElement.style.position = "absolute";
        }

        for (let i in this.attrs.renders) {
            this.ownContext.getElements(this.attrs.renders[i].renderer)[0].object.render(
                this.ownContext.getElements(this.attrs.renders[i].scene)[0].object,
                this.ownContext.getElements(this.attrs.renders[i].camera)[0].object
            );
        }
    }
            
    initializeCamera(camera){
        camera.settings = camera.settings || {};
        camera.settings.type = camera.settings.type || "PerspectiveCamera";
        camera.parameters = camera.parameters || {};
        if (camera.settings.type === "PerspectiveCamera") {
            const fov = 45;
            const aspect = this.ownContext.window.innerWidth / this.ownContext.window.innerHeight;
            const near = 1;
            const far = 1000;
            camera.parameters = [fov, aspect, near, far];
        } else {
            const left = this.ownContext.window.innerWidth / - 2;
            const right = this.ownContext.window.innerWidth / 2;
            const top = this.ownContext.window.innerHeight / 2;
            const bottom = this.ownContext.window.innerHeight / - 2;
            const near = 1;
            const far = 1000;
            camera.parameters = [left, right, top, bottom, near, far];
        }
        camera.settings.position = camera.settings.position || {};
        camera.settings.position.x = camera.settings.position.x || 0;
        camera.settings.position.y = camera.settings.position.y || 0;
        camera.settings.position.z = camera.settings.position.z || 1000;

        camera.settings.rotation = camera.settings.rotation || {};
        camera.settings.rotation.x = camera.settings.rotation.x || 0;
        camera.settings.rotation.y = camera.settings.rotation.y || 0;
        camera.settings.rotation.z = camera.settings.rotation.z || 0;
    }

    initializeRenderer(renderer) {
        renderer.settings = renderer.settings || {};
        renderer.settings.type = renderer.settings.type || "WebGLRenderer";
        renderer.parameters = renderer.parameters || [{}];
        if (renderer.settings.type === "WebGLRenderer") {
            renderer.settings.setPixelRatio = renderer.settings.setPixelRatio ||
                [this.ownContext.window.devicePixelRatio];
        }
        
        renderer.settings.setSize = renderer.settings.setSize ||
            [
                this.ownContext.window.innerWidth,
                this.ownContext.window.innerHeight
            ];
    }

    initializeLight(light) {
        light.settings = light.settings || {};
        light.settings.type = light.settings.type || "DirectionalLight";

        if (light.settings.type === "SpotLight") {
            light.parameters = light.parameters || [0xDDDDDD, 1]
        }
        else if ( light.settings.type === "DirectionalLight") {
            light.parameters = light.parameters || [0xffffff,1,100];
        } else if (light.setting.type === "PointLight") {
            light.parameters = light.parameters || [0xff0000,1,100];
        }
    }

    runChecks(attrs,props){
        if(!helper.isObject(props)){
            helper.error(`Self Contained Incident expects an object on its \
                second argument on the constructor. ${typeof props} passed`);
            return false;
        }
        
        if(!props.hasOwnProperty('id')){
            helper.error(`Self Contained Incident expects the 'id' key on its \
                constructor properties which is missing`);
            return false;
        }
        
        
        if(!props.hasOwnProperty('host')){
            helper.error(`Self Contained Incident expects the 'host' key on its\
             constructor properties which is missing`);
            return false;
        }

        if(!props.hasOwnProperty('containerParams')){
            helper.error(`Self Contained Incident expects the 'containerParams'\
             key on its constructor properties which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('scenes')){
            helper.error(`Self Contained Incident expects the 'scenes' key on\
             its constructor attributes which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('lights')){
            helper.error(`Self Contained Incident expects the 'lights' key on \
                its constructor attributes which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('cameras')){
            helper.error(`Self Contained Incident expects the 'cameras' key on \
                its constructor attributes which is missing`);
            return false;
        }

        if(!attrs.hasOwnProperty('renderers')){
            helper.error(`Self Contained Incident expects the 'renderers' key \
                on its constructor attributes which is missing`);
            return false;
        }
        return true;
    }

    lastWish(){
        this.ownContext.unmount();
    }
}


module.exports = Clip3D;
