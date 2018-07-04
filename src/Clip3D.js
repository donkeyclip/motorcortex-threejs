const MC = require("@kissmybutton/motorcortex");
global.THREE = require("three");
require("three/examples/js/renderers/CSS3DRenderer");
require("three/examples/js/controls/OrbitControls");

// const Helper = MC.Helper;
const helper = new MC.Helper();
const Group = MC.Group;
const conf = MC.conf;
const Iframe3DContextHandler = require("./Iframe3DContextHandler");

class Clip3D extends Group {
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
  constructor(attrs = {}, props = {}) {
    super(attrs, props);

    const checks = this.runChecks(attrs, props);

    if (!checks) {
      return false;
    }

    let ContextHanlder = null;
    if (conf.selfContainedContextHandler === "iframe") {
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
      models: [],
      meshes: [],
      css3d_objects: [],
      loaders: [],
      renders: this.attrs.renders,
      mixers: []
    };

    this.init(attrs);
  }

  async init(attrs) {
    /*
        * CAMERAS
        */

    for (const camera of attrs.cameras) {
      if (this.context.getElements("#" + camera.id)[0]) {
        throw "This id " + camera.id + " is already in use.";
      }
      this.initializeCamera(camera);
      const { type } = camera.settings;
      this.ownContext.elements.cameras.push({
        id: camera.id,
        // mcid: camera.id,
        groups: camera.groups,
        settings: camera.settings,
        object: new THREE[type](...camera.parameters)
      });

      const length = this.ownContext.elements.cameras.length - 1;
      const cameraObj = this.ownContext.elements.cameras[length].object;

      this.applySettingsToObjects(camera.settings, cameraObj);
      cameraObj.updateProjectionMatrix();
    }

    /*
        * SCENES
        */

    for (const scene of attrs.scenes) {
      if (this.context.getElements("#" + scene.id)[0]) {
        throw "This id " + scene.id + " is already in use.";
      }
      this.ownContext.elements.scenes.push({
        id: scene.id,
        // mcid: scene.id,
        groups: scene.groups,
        object: new THREE.Scene()
      });
    }

    /*
        * RENDERERS
        */

    for (const renderer of attrs.renderers) {
      if (this.context.getElements("#" + renderer.id)[0]) {
        throw "This id " + renderer.id + " is already in use.";
      }
      this.initializeRenderer(renderer);
      const { type } = renderer.settings;
      this.ownContext.elements.renderers.push({
        id: renderer.id,
        // mcid: renderer.id,
        groups: renderer.groups,
        object: new THREE[type](...renderer.parameters)
      });

      const length = this.ownContext.elements.renderers.length - 1;
      const rendererObj = this.ownContext.elements.renderers[length].object;
      this.applySettingsToObjects(renderer.settings, rendererObj);
    }

    /*
        * LIGHTS
        */

    for (const light of attrs.lights) {
      if (this.context.getElements("#" + light.id)[0]) {
        throw "This id " + light.id + " is already in use.";
      }
      this.initializeLight(light);

      this.ownContext.elements.lights.push({
        id: light.id,
        // mcid: light.id,
        groups: light.groups,
        object: new THREE[light.settings.type](...light.parameters)
      });

      const length = this.ownContext.elements.lights.length - 1;

      const lightObj = this.ownContext.elements.lights[length].object;

      this.applySettingsToObjects(light.settings, lightObj);

      for (const scene of this.ownContext.getElements(light.applyToSelector)) {
        scene.object.add(lightObj);
      }
    }

    /*
        * MESHES
        */
    for (const mesh of attrs.meshes) {
      if (this.context.getElements("#" + mesh.id)[0]) {
        throw "This id " + mesh.id + " is already in use.";
      }
      this.initializeMesh(mesh);
      // mesh.mcid = mesh.id;
      const geometry = new THREE[mesh.geometry.type](
        ...mesh.geometry.parameters
      );
      const material = new THREE[mesh.material.type](
        ...mesh.material.parameters
      );
      mesh.object = new THREE.Mesh(geometry, material);

      this.ownContext.elements.meshes.push(mesh);

      this.applySettingsToObjects(mesh.settings, mesh.object);

      for (const scene of this.ownContext.getElements(mesh.scenes)) {
        scene.object.add(mesh.object);
      }
    }

    /*
        * CSS3DOBJECTS
        */
    for (const css3d of attrs.css3d_objects) {
      if (this.context.getElements("#" + css3d.id)[0]) {
        throw "This id " + css3d.id + " is already in use.";
      }
      this.initializeMesh(css3d);
      // css3d.mcid = css3d.id;
      const elements = this.ownContext.document.querySelectorAll(
        css3d.selector
      );
      for (const element of elements) {
        css3d.object = new THREE.CSS3DObject(element);
        this.ownContext.elements.css3d_objects.push(css3d);

        this.applySettingsToObjects(css3d.settings, css3d.object);

        for (const scene of this.ownContext.getElements(css3d.scenes)) {
          scene.object.add(css3d.object);
        }
      }
    }

    /*
        * LOADERS
        */
    for (const loader of attrs.loaders) {
      if (this.context.getElements("#" + loader.id)[0]) {
        throw "This id " + loader.id + " is already in use.";
      }
      this.initializeLoader(loader);
      // loader.mcid = loader.id;
      if (!THREE[loader.type]) {
        try {
          require("three/examples/js/loaders/" + loader.type);
        } catch (e) {
          throw e;
        }
      }

      loader.object = new THREE[loader.type]();
      this.ownContext.elements.loaders.push(loader);
    }

    /*
        * MODELS
        */
    for (const model of attrs.models) {
      if (this.context.getElements("#" + model.id)[0]) {
        throw "This id " + model.id + " is already in use.";
      }
      this.initializeModel(model);
      // model.mcid = model.id
      const loader = this.ownContext.getElements(model.loader)[0];

      const loadGeometry = () => {
        return new Promise(resolve => {
          loader.parameters[0] = model.file;
          loader.parameters[1] = resolve;

          loader.object.load(...loader.parameters);
        });
      };

      try {
        const geometry = await loadGeometry();
        const material = new THREE[model.material.type](
          ...model.material.parameters
        );
        const mesh = new THREE.Mesh(geometry, material);

        model.object = mesh;
        this.applySettingsToObjects(model.settings, model.object);
        this.ownContext.elements.models.push(model);

        for (const scene of this.ownContext.getElements(model.scenes)) {
          scene.object.add(model.object);
        }
        this.flashDOM();
      } catch (e) {
        throw e;
      }
    }
    this.render();
  }

  applySettingsToObjects(settings, obj) {
    for (const key in settings) {
      if (settings[key] instanceof Array) {
        obj[key](...settings[key]);
        continue;
      } else if (settings[key] !== Object(settings[key])) {
        // is primitive
        obj[key] = settings[key];
        continue;
      }
      this.applySettingsToObjects(settings[key], obj[key]);
    }
  }

  _getChannel(channelId) {
    if (!this.instantiatedChannels.hasOwnProperty(channelId)) {
      return null;
    } else {
      return this.instantiatedChannels[channelId];
    }
  }

  render() {
    for (const i in this.ownContext.elements.renderers) {
      this.ownContext.rootElement.appendChild(
        this.ownContext.elements.renderers[i].object.domElement
      );
      this.ownContext.elements.renderers[i].object.domElement.style.zIndex = i;
      this.ownContext.elements.renderers[i].object.domElement.style.top = 0;
      this.ownContext.elements.renderers[i].object.domElement.style.position =
        "absolute";
    }

    for (const i in this.attrs.renders) {
      this.ownContext
        .getElements(this.attrs.renders[i].renderer)[0]
        .object.render(
          this.ownContext.getElements(this.attrs.renders[i].scene)[0].object,
          this.ownContext.getElements(this.attrs.renders[i].camera)[0].object
        );
    }
    // console.log(JSON.parse(JSON.stringify(this.ownContext.elements)),this.ownContext.elements)
  }

  initializeCamera(camera) {
    camera.settings = camera.settings || {};
    camera.settings.type = camera.settings.type || "PerspectiveCamera";
    camera.parameters = camera.parameters || {};
    if (camera.settings.type === "PerspectiveCamera") {
      const fov = 45;
      const aspect =
        this.ownContext.window.innerWidth / this.ownContext.window.innerHeight;
      const near = 1;
      const far = 1000;
      camera.parameters = [fov, aspect, near, far];
    } else {
      const left = this.ownContext.window.innerWidth / -2;
      const right = this.ownContext.window.innerWidth / 2;
      const top = this.ownContext.window.innerHeight / 2;
      const bottom = this.ownContext.window.innerHeight / -2;
      const near = 1;
      const far = 1000;
      camera.parameters = [left, right, top, bottom, near, far];
    }
    camera.settings.position = camera.settings.position || {};
    camera.settings.position.x = camera.settings.position.x || 0;
    camera.settings.position.y = camera.settings.position.y || 0;
    camera.settings.position.z = camera.settings.position.z || 1000;
    // if (!camera.settings.lookAt) {
    //     camera.settings.rotation = camera.settings.rotation || {};
    //     camera.settings.rotation.x = camera.settings.rotation.x || 0;
    //     camera.settings.rotation.y = camera.settings.rotation.y || 0;
    //     camera.settings.rotation.z = camera.settings.rotation.z || 0;
    // }
    camera.settings.lookAt = camera.settings.lookAt || [new THREE.Vector3()];
  }

  initializeRenderer(renderer) {
    renderer.settings = renderer.settings || {};
    renderer.settings.type = renderer.settings.type || "WebGLRenderer";
    renderer.parameters = renderer.parameters || [{}];
    if (renderer.settings.type === "WebGLRenderer") {
      renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [
        this.ownContext.window.devicePixelRatio
      ];
    }

    renderer.settings.setSize = renderer.settings.setSize || [
      this.ownContext.window.innerWidth,
      this.ownContext.window.innerHeight
    ];
  }

  initializeLight(light) {
    light.settings = light.settings || {};
    light.settings.type = light.settings.type || "DirectionalLight";

    if (light.settings.type === "SpotLight") {
      light.parameters = light.parameters || [0xdddddd, 1];
    } else if (light.settings.type === "DirectionalLight") {
      light.parameters = light.parameters || [0xffffff, 1, 100];
    } else if (light.setting.type === "PointLight") {
      light.parameters = light.parameters || [0xff0000, 1, 100];
    }
  }

  initializeMesh(mesh) {
    mesh.settings = mesh.settings || {};
    mesh.settings.position = mesh.settings.position || {};
    mesh.settings.position.x = mesh.settings.position.x || 0;
    mesh.settings.position.y = mesh.settings.position.y || 0;
    mesh.settings.position.z = mesh.settings.position.z || 0;
  }

  initializeCSS3DObject(css3d) {
    css3d.settings = css3d.settings || {};
    css3d.settings.position = css3d.settings.position || {};
    css3d.settings.position.x = css3d.settings.position.x || 0;
    css3d.settings.position.y = css3d.settings.position.y || 0;
    css3d.settings.position.z = css3d.settings.position.z || 0;
  }

  initializeLoader(loader) {
    loader.parameters = loader.parameters || [];
    if (loader.parameters.length < 2) {
      loader.parameters.push(
        null,
        null,
        function(/*xhr*/) {
          // console.log((xhr.loaded / xhr.total) * 100 + "%loaded");
        },
        function(error) {
          // console.log(error);
          throw error;
        }
      );
    }
  }

  initializeModel(model) {
    model.settings = model.settings || {};
    model.settings.position = model.settings.position || {};
    model.settings.position.x = model.settings.position.x || 0;
    model.settings.position.y = model.settings.position.y || 0;
    model.settings.position.z = model.settings.position.z || 0;
  }

  runChecks(attrs, props) {
    if (!helper.isObject(props)) {
      helper.error(`Self Contained Incident expects an object on its \
                second argument on the constructor. ${typeof props} passed`);
      return false;
    }

    if (!props.hasOwnProperty("id")) {
      helper.error(`Self Contained Incident expects the 'id' key on its \
                constructor properties which is missing`);
      return false;
    }

    if (!props.hasOwnProperty("host")) {
      helper.error(`Self Contained Incident expects the 'host' key on its\
             constructor properties which is missing`);
      return false;
    }

    if (!props.hasOwnProperty("containerParams")) {
      helper.error(`Self Contained Incident expects the 'containerParams'\
             key on its constructor properties which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("scenes")) {
      helper.error(`Self Contained Incident expects the 'scenes' key on\
             its constructor attributes which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("lights")) {
      helper.error(`Self Contained Incident expects the 'lights' key on \
                its constructor attributes which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("cameras")) {
      helper.error(`Self Contained Incident expects the 'cameras' key on \
                its constructor attributes which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("renderers")) {
      helper.error(`Self Contained Incident expects the 'renderers' key \
                on its constructor attributes which is missing`);
      return false;
    }
    return true;
  }

  lastWish() {
    this.ownContext.unmount();
  }
}

module.exports = Clip3D;
