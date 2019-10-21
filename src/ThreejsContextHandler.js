const promise = Promise;
const uuidv1 = require("uuid/v4");

class ThreejsContextHandler {
  constructor(attrs, props, _thisClip) {
    this.props = props;
    this.attrs = attrs;
    this._thisClip = _thisClip;
    this.hasLoaded = false;
    const shadow = props.host.attachShadow({ mode: "closed" });
    const wrapper = document.createElement("div");
    if (Object.prototype.hasOwnProperty.call(props, "containerParams")) {
      if (
        Object.prototype.hasOwnProperty.call(props.containerParams, "width")
      ) {
        wrapper.style.width = props.containerParams.width;
      }
      if (
        Object.prototype.hasOwnProperty.call(props.containerParams, "height")
      ) {
        wrapper.style.height = props.containerParams.height;
      }
    }
    wrapper.innerHTML = props.html + "<slot></slot>";
    shadow.appendChild(wrapper);

    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText = props.css;
    } else {
      styleTag.appendChild(document.createTextNode(props.css));
    }
    shadow.appendChild(styleTag);

    if (Object.prototype.hasOwnProperty.call(props, "fonts")) {
      for (let i = 0; i < props.fonts.length; i++) {
        const theFont = props.fonts[i];
        if (theFont.type === "google-font") {
          const fontTag = document.createElement("link");
          fontTag.setAttribute("rel", "stylesheet");
          fontTag.setAttribute("src", theFont.src);
          shadow.appendChild(fontTag);
        }
      }
    }

    wrapper.style.overflow = "hidden";

    this.rootElement = wrapper;
    this.context = {
      clipId: uuidv1(),
      document: document,
      window: window,
      rootElement: this.rootElement,
      loading: [],
      elements: {
        lights: [],
        cameras: [],
        scenes: [],
        renderers: [],
        models: [],
        meshes: [],
        css3d_objects: [],
        loaders: [],
        renders: this.attrs.renders,
        mixers: [],
        controls: [],
        rn: Math.random().toFixed(2)
      },
      unmount: function() {},
      getElements: this.getElements.bind(this),
      getMCID: this.getMCID.bind(this),
      setMCID: this.setMCID.bind(this),
      getElementSelectorByMCID: this.getElementSelectorByMCID.bind(this),
      getElementByMCID: this.getElementByMCID.bind(this),
      pushMixer: this.pushMixer.bind(this)
    };

    this.init();
  }

  getElementByMCID(mcid) {
    for (const prop in this.context.elements) {
      for (const element in this.context.elements[prop]) {
        if (this.context.elements[prop][element].id === mcid) {
          return this.context.elements[prop][element];
        }
      }
    }
    return null;
  }

  getElements(selector) {
    const elements = [];
    let key = "groups";

    if (selector.substring(0, 1) === "#" || selector.substring(0, 1) !== ".") {
      key = "id";
    }
    selector = selector.substring(1, selector.length);

    for (const prop in this.context.elements) {
      for (const element in this.context.elements[prop]) {
        if (this.context.elements[prop][element][key] === selector) {
          elements.push(this.context.elements[prop][element]);
        }
      }
    }
    return elements;
  }

  getMCID(element) {
    return element.id;
  }

  setMCID(element /*, mcid*/) {
    element.mcid = element.id;
  }

  getElementSelectorByMCID(mcid) {
    for (const prop in this.context.elements) {
      for (const element in this.context.elements[prop]) {
        if (this.context.elements[prop][element].id === mcid) {
          return "#" + mcid;
        }
      }
    }
    return null;
  }

  async init() {
    /*
    * CAMERAS
    */
    for (const camera of this.attrs.cameras) {
      camera.id = camera.id || uuidv1();
      if (this.context.getElements("#" + camera.id)[0]) {
        throw `This id '${camera.id}' is already in use.`;
      }
      this.initializeCamera(camera);
      const { type } = camera.settings;
      this.context.elements.cameras.push({
        id: camera.id,
        groups: camera.groups,
        settings: camera.settings,
        object: new THREE[type](...camera.parameters)
      });

      const length = this.context.elements.cameras.length - 1;
      const cameraObj = this.context.elements.cameras[length].object;

      this.applySettingsToObjects(camera.settings, cameraObj);
      cameraObj.updateProjectionMatrix();
    }

    /*
    * SCENES
    */
    for (const scene of this.attrs.scenes) {
      scene.id = scene.id || uuidv1();
      if (this.context.getElements("#" + scene.id)[0]) {
        throw `This id ${scene.id} is already in use.`;
      }
      this.context.elements.scenes.push({
        id: scene.id,
        groups: scene.groups,
        object: new THREE.Scene()
      });

      const length = this.context.elements.scenes.length - 1;
      const sceneObj = this.context.elements.scenes[length].object;
      if (scene.settings.fog) {
        sceneObj.fog = scene.settings.fog;
      }
    }

    /*
    * RENDERERS
    */
    for (const renderer of this.attrs.renderers) {
      renderer.id = renderer.id || uuidv1();
      if (this.context.getElements("#" + renderer.id)[0]) {
        throw `This id ${renderer.id}is already in use.`;
      }
      this.initializeRenderer(renderer);
      const { type } = renderer.settings;
      this.context.elements.renderers.push({
        id: renderer.id,
        groups: renderer.groups,
        object: new THREE[type](...renderer.parameters)
      });

      const length = this.context.elements.renderers.length - 1;
      const rendererObj = this.context.elements.renderers[length].object;
      this.applySettingsToObjects(renderer.settings, rendererObj);
    }

    /*
    * LIGHTS
    */

    for (const light of this.attrs.lights) {
      light.id = light.id || uuidv1();
      if (this.context.getElements("#" + light.id)[0]) {
        throw `This id  ${light.id} is already in use.`;
      }
      this.initializeLight(light);

      this.context.elements.lights.push({
        id: light.id,
        groups: light.groups,
        object: new THREE[light.settings.type](...light.parameters)
      });

      const length = this.context.elements.lights.length - 1;

      const lightObj = this.context.elements.lights[length].object;

      this.applySettingsToObjects(light.settings, lightObj);

      for (const scene of this.context.getElements(light.applyToSelector)) {
        scene.object.add(lightObj);
      }
    }

    /*
    * MESHES
    */
    for (const mesh of this.attrs.meshes) {
      mesh.id = mesh.id || uuidv1();
      if (this.context.getElements("#" + mesh.id)[0]) {
        throw `This id ${mesh.id} is already in use.`;
      }
      this.initializeMesh(mesh);

      const geometry = new THREE[mesh.geometry.type](
        ...mesh.geometry.parameters
      );
      const material = new THREE[mesh.material.type](
        ...mesh.material.parameters
      );
      mesh.object = new THREE.Mesh(geometry, material);
      this.context.elements.meshes.push(mesh);

      this.applySettingsToObjects(mesh.settings, mesh.object);

      for (const scene of this.context.getElements(mesh.scenes)) {
        scene.object.add(mesh.object);
      }
    }

    /*
    * CSS3DOBJECTS
    */
    for (const css3d of this.attrs.css3d_objects) {
      css3d.id = css3d.id || uuidv1();
      if (this.context.getElements("#" + css3d.id)[0]) {
        throw `This id ${css3d.id} is already in use.`;
      }
      this.initializeMesh(css3d);
      const elements = this.context.rootElement.querySelectorAll(
        css3d.selector
      );
      for (const element of elements) {
        css3d.object = new THREE.CSS3DObject(element);
        this.context.elements.css3d_objects.push(css3d);

        this.applySettingsToObjects(css3d.settings, css3d.object);

        for (const scene of this.context.getElements(css3d.scenes)) {
          scene.object.add(css3d.object);
        }
      }
    }

    /*
    * LOADERS
    */
    for (const loader of this.attrs.loaders) {
      loader.id = loader.id || uuidv1();
      if (this.context.getElements("#" + loader.id)[0]) {
        throw `This id ${loader.id} is already in use.`;
      }
      this.initializeLoader(loader);
      if (!THREE[loader.type]) {
        try {
          require("three/examples/js/loaders/" + loader.type);
        } catch (e) {
          throw e;
        }
      }

      loader.object = new THREE[loader.type]();
      this.context.elements.loaders.push(loader);
    }
    /*
    * MODELS
    */
    for (const model of this.attrs.models) {
      model.id = model.id || uuidv1();
      if (this.context.getElements("#" + model.id)[0]) {
        throw `This id ${model.id} is already in use.`;
      }
      this.initializeModel(model);
      const loader = this.context.getElements(model.loader)[0];

      const loadGeometry = () => {
        return new promise(resolve => {
          loader.parameters[0] = model.file;
          loader.parameters[1] = resolve;

          loader.object.load(...loader.parameters);
        });
      };

      loadGeometry().then(g => {
        this.hasLoaded = true;
        const material = new THREE[model.material.type](
          ...model.material.parameters
        );
        model.object = new THREE.Mesh(g, material);
        this.applySettingsToObjects(model.settings, model.object);

        for (const scene of this.context.getElements(model.scenes)) {
          scene.object.add(model.object);
        }

        setTimeout(() => {
          this.context.loading.splice(0, 1);
          if (this.context.loading.length === 0) {
            this._thisClip.contextLoaded();
          }
        }, 2000);
      });

      this.context.loading.push(1);
      if (this.context.loading.length === 1 && !this.hasLoaded) {
        this._thisClip.contextLoading();
      }
      // create pseudo point as element
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.PointsMaterial();
      const pseudoModel = new THREE.Points(geometry, material);
      pseudoModel.name = model.id;
      model.object = pseudoModel;
      //
      this.applySettingsToObjects(model.settings, model.object);

      this.context.elements.models.push(model);
    }
    /*
    * CONTROLS
    */
    if (this.attrs.controls) {
      let applyElement;
      if (this.attrs.controls.appplyTo) {
        applyElement = this.attrs.controls.applyTo;
      } else {
        applyElement = this.context.rootElement;
      }
      this.context.elements.controls[0] = new THREE.OrbitControls(
        this.context.getElements(this.attrs.controls.cameraId)[0].object,
        applyElement
      );
      this.context.elements.controls[0].enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.context.elements.controls[0].dampingFactor = 0.5;
      this.context.elements.controls[0].screenSpacePanning = false;
      this.context.elements.controls[0].minDistance = 1;
      this.context.elements.controls[0].maxDistance = 1000;
      this.context.elements.controls[0].maxPolarAngle = Math.PI / 2;

      const render = () => {
        if (
          (
            ((this.context.elements.controls[0] || {}).domElement || {})
              .style || {}
          ).pointerEvents === "none"
        ) {
          return;
        }

        for (const i in this.attrs.renders) {
          this.context
            .getElements(this.attrs.renders[i].renderer)[0]
            .object.render(
              this.context.getElements(this.attrs.renders[i].scene)[0].object,
              this.context.getElements(this.attrs.renders[i].camera)[0].object
            );
        }
      };
      const animate = () => {
        requestAnimationFrame(animate);
        this.context.elements.controls[0].update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        render();
      };
      animate();
    }
  }
  pushMixer(mixer) {
    this.context.elements.mixers.push(mixer);
  }
  initializeCamera(camera) {
    camera.settings = camera.settings || {};
    camera.settings.type = camera.settings.type || "PerspectiveCamera";
    camera.parameters = camera.parameters || {};
    if (camera.settings.type === "PerspectiveCamera") {
      const fov = 45;
      const aspect =
        this.context.rootElement.offsetWidth /
        this.context.rootElement.offsetHeight;

      const near = 1;
      const far = 1000;
      camera.parameters = [fov, aspect, near, far];
    } else {
      const left = this.context.rootElement.offsetWidth / -2;
      const right = this.context.rootElement.offsetWidth / 2;
      const top = this.context.rootElement.offsetHeight / 2;
      const bottom = this.context.rootElement.offsetHeight / -2;
      const near = 1;
      const far = 1000;
      camera.parameters = [left, right, top, bottom, near, far];
    }
    camera.settings.position = camera.settings.position || {};
    camera.settings.position.x = camera.settings.position.x || 0;
    camera.settings.position.y = camera.settings.position.y || 0;
    camera.settings.position.z = camera.settings.position.z || 1000;
    camera.settings.lookAt = camera.settings.lookAt || [0, 0, 0];
  }

  initializeRenderer(renderer) {
    renderer.settings = renderer.settings || {};
    renderer.settings.type = renderer.settings.type || "WebGLRenderer";
    renderer.parameters = renderer.parameters || [{}];
    if (renderer.settings.type === "WebGLRenderer") {
      renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [
        this.context.window.devicePixelRatio
      ];
    }

    renderer.settings.setSize = renderer.settings.setSize || [
      this.context.rootElement.offsetWidth,
      this.context.rootElement.offsetHeight
    ];
  }

  initializeLight(light) {
    light.settings = light.settings || {};
    light.settings.type = light.settings.type || "DirectionalLight";

    if (light.settings.type === "SpotLight") {
      light.parameters = light.parameters || [0xffffff, 1];
      light.shadow = new THREE.LightShadow(
        new THREE.PerspectiveCamera(50, 1, 700, 500)
      );
      light.shadow.bias = 0.0001;
    } else if (light.settings.type === "DirectionalLight") {
      light.parameters = light.parameters || [0xffffff, 1, 100];
    } else if (light.setting.type === "PointLight") {
      light.parameters = light.parameters || [0xffffff, 1, 100];
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
}

module.exports = ThreejsContextHandler;
