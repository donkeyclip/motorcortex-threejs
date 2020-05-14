const promise = Promise;
const uuidv1 = require("uuid/v4");
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { JSONLoader } from "three/examples/jsm/loaders/JSONLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { ObjectLoader } from "three/examples/jsm/loaders/ObjectLoader.js";

export default class ThreejsContextHandler {
  constructor(attrs, props, o) {
    this.props = props;
    this.attrs = attrs;
    this.o = { ...o };
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
      loading: false,
      loadingElements: [],
      loaders: [
        {
          id: "JSONLoader",
          groups: "loaders",
          type: "JSONLoader",
          object: JSONLoader
        },
        {
          id: "ColladaLoader",
          groups: "loaders",
          type: "ColladaLoader",
          object: ColladaLoader
        },
        {
          id: "FBXLoader",
          groups: "loaders",
          type: "FBXLoader",
          object: FBXLoader
        },
        {
          id: "OBJLoader",
          groups: "loaders",
          type: "OBJLoader",
          object: OBJLoader
        },
        {
          id: "MTLLoader",
          groups: "loaders",
          type: "MTLLoader",
          object: MTLLoader
        },
        {
          id: "DDSLoader",
          groups: "loaders",
          type: "DDSLoader",
          object: DDSLoader
        },
        {
          id: "ObjectLoader",
          groups: "loaders",
          type: "ObjectLoader",
          object: ObjectLoader
        }
      ],
      elements: {
        lights: [],
        cameras: [],
        scenes: [],
        renderers: [],
        models: [],
        entities: [],
        css3d_objects: [],
        loaders: [],
        renders: [],
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
    if (this.attrs.cameras instanceof Array) {
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
    } else {
      const camera = this.attrs.cameras || {};
      camera.id = camera.id || "camera";
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

      const cameraObj = this.context.elements.cameras[0].object;

      this.applySettingsToObjects(camera.settings, cameraObj);
      cameraObj.updateProjectionMatrix();
    }

    /*
    * SCENES
    */
    if (this.attrs.scenes instanceof Array) {
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
          sceneObj.fog = new THREE.Fog(...scene.settings.fog);
        }
      }
    } else {
      const scene = {};

      scene.id = (this.attrs.scenes || {}).id || "scene";
      this.context.elements.scenes.push({
        id: scene.id,
        groups: scene.groups,
        object: new THREE.Scene()
      });
      const sceneObj = this.context.elements.scenes[0].object;
      if ((this.attrs.scenes || {}).fog) {
        sceneObj.fog = new THREE.Fog(...this.attrs.scenes.fog);
      }
    }

    /*
    * RENDERERS
    */
    if (this.attrs.renderers instanceof Array) {
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
    } else {
      const renderer = this.attrs.renderers || {};
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

      const rendererObj = this.context.elements.renderers[0].object;
      this.applySettingsToObjects(renderer.settings, rendererObj);
    }

    /*
    * LIGHTS
    */
    if (this.attrs.lights instanceof Array) {
      for (const light of this.attrs.lights) {
        light.id = light.id || uuidv1();
        light.applyToSelector =
          light.applyToSelector || "#" + this.context.elements.scenes[0].id;
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
          const helper = new THREE.CameraHelper(lightObj.shadow.camera);
          scene.object.add(helper);
        }
      }
    } else {
      const light = this.attrs.lights || {};
      light.id = light.id || "light";
      light.applyToSelector =
        light.applyToSelector || "#" + this.context.elements.scenes[0].id;
      if (this.context.getElements("#" + light.id)[0]) {
        throw `This id  ${light.id} is already in use.`;
      }
      this.initializeLight(light);

      this.context.elements.lights.push({
        id: light.id,
        groups: light.groups,
        object: new THREE[light.settings.type](...light.parameters)
      });

      const lightObj = this.context.elements.lights[0].object;

      this.applySettingsToObjects(light.settings, lightObj);

      for (const scene of this.context.getElements(light.applyToSelector)) {
        scene.object.add(lightObj);
        const helper = new THREE.CameraHelper(lightObj.shadow.camera);
        scene.object.add(helper);
      }
    }

    /*
    * CSS3DOBJECTS
    */
    for (const css3d of this.attrs.css3d_objects || []) {
      css3d.scenes = css3d.scenes || "#" + this.context.elements.scenes[0].id;
      css3d.id = css3d.id || uuidv1();
      if (this.context.getElements("#" + css3d.id)[0]) {
        throw `This id ${css3d.id} is already in use.`;
      }
      this.initializeMesh(css3d);
      const elements = this.context.rootElement.querySelectorAll(
        css3d.selector
      );
      for (const element of elements) {
        css3d.object = new CSS3DObject(element);
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
    for (const loader of this.context.loaders) {
      loader.id = loader.id;

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
      // model.scenes = model.scenes || "#" + this.context.elements.scenes[0].id;
      model.id = model.id || uuidv1();
      if (this.context.getElements("#" + model.id)[0]) {
        throw `This id ${model.id} is already in use.`;
      }
      // this.initializeModel(model);
      const loader = this.context.getElements(model.loader)[0];

      const loadGeometry = () => {
        return new promise(resolve => {
          if (model.loader === "#OBJMTLLoader") {
            const manager = new THREE.LoadingManager();
            // manager.addHandler(/\.dds$/i, new THREE.DDSLoader());
            new MTLLoader(manager).load(model.file[0], function(materials) {
              materials.preload();
              new OBJLoader(manager)
                .setMaterials(materials)
                .load(model.file[1], resolve);
            });
          } else {
            loader.parameters[0] = model.file;
            loader.parameters[1] = resolve;

            loader.object.load(...loader.parameters);
          }
        });
      };

      loadGeometry().then(g => {
        this.hasLoaded = true;
        const that = this;
        that.context.loadingElements.splice(0, 1);
        if (that.context.loadingElements.length === 0) {
          that.context.loading = false;
          that.o._thisClip.contextLoaded();
        }

        for (const i in that.context.elements.entities) {
          if (
            that.context.elements.entities[i].geometryFromModel ===
            "#" + model.id
          ) {
            const mod = that.context.getElements(
              that.context.elements.entities[i].geometryFromModel
            )[0];
            if (mod.loader === "#JSONLoader") {
              const entity = that.context.elements.entities[i];
              entity.object.geometry = g;
              entity.material = undefined;
              that.applySettingsToObjects(entity.settings, entity.object);
              entity.object.updateMorphTargets();
            } else if (
              mod.loader === "#FBXLoader" ||
              mod.loader === "#OBJMTLLoader"
            ) {
              const entity = that.context.elements.entities[i];
              if (that.context.elements.entities[i].geometryFromModel) {
                if (entity.clone) {
                  entity.object = g.clone();
                } else {
                  entity.object = g;
                }

                if (entity.texturePath) {
                  const myloader = new THREE.TextureLoader();
                  const myTexture = myloader.load(entity.texturePath);
                  myTexture.anisotropy = 16;
                  const customDepthMaterial = new THREE.MeshDepthMaterial({
                    depthPacking: THREE.RGBADepthPacking,

                    alphaMap: myTexture, // or, alphaMap: myAlphaMap

                    alphaTest: 0.5
                  });

                  entity.object.customDepthMaterial = customDepthMaterial;
                }
                that.applySettingsToObjects(entity.settings, entity.object);
                entity.object.traverse(function(child) {
                  if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                });

                that.context.elements.scenes[0].object.add(entity.object);
              }
            }
          }
        }

        // this.elements.scenes[0].object.add(g);
        //rerender after the loading has been completed
        that.o._thisClip.render();
      });

      const that = this;
      that.context.loadingElements.push(1);
      if (that.context.loadingElements.length === 1 && !that.hasLoaded) {
        that.context.loading = true;
        that.o._thisClip.contextLoading();
      }
      // create pseudo point as element
      const geometry = new THREE.BufferGeometry();
      // const material = new THREE.PointsMaterial();
      // const pseudoModel = new THREE.Points(geometry, material);
      // pseudoModel.name = model.id;
      // model.object = pseudoModel;
      model.geometry = geometry;
      // this.applySettingsToObjects(model.settings, model.object);

      this.context.elements.models.push(model);
    }
    /*
    * entities
    */
    for (const entity of this.attrs.entities) {
      entity.id = entity.id || uuidv1();
      entity.scenes = entity.scenes || "#" + this.context.elements.scenes[0].id;
      if (this.context.getElements("#" + entity.id)[0]) {
        throw `This id ${entity.id} is already in use.`;
      }
      this.initializeMesh(entity);

      const geometry = entity.geometryFromModel
        ? this.context.getElements(entity.geometryFromModel)[0].geometry
        : new THREE[entity.geometry.type](...entity.geometry.parameters);

      if (entity.material.parameters.side) {
        entity.material.parameters.side =
          THREE[entity.material.parameters.side];
      }

      if (entity.material.parameters.vertexColors) {
        entity.material.parameters.vertexColors =
          THREE[entity.material.parameters.vertexColors];
      }
      const material = new THREE[entity.material.type](
        ...entity.material.parameters
      );
      entity.object = new THREE[entity.settings.entityType || "Mesh"](
        geometry,
        material
      );
      this.context.elements.entities.push(entity);

      this.applySettingsToObjects(entity.settings, entity.object);

      if (entity.callback) {
        entity.callback(
          entity.object.geometry,
          entity.object.material,
          entity.object
        );
      }
      for (const scene of this.context.getElements(entity.scenes)) {
        scene.object.add(entity.object);
      }
    }

    /*
    * renders
    */
    this.attrs.renders = this.attrs.renders || [{}];

    for (const render of this.attrs.renders) {
      render.scene = render.scene || "#" + this.context.elements.scenes[0].id;
      render.camera =
        render.camera || "#" + this.context.elements.cameras[0].id;
      render.renderer =
        render.renderer || "#" + this.context.elements.renderers[0].id;
      this.context.elements.renders.push(render);
    }

    /*
    * CONTROLS
    */
    if (this.attrs.controls) {
      let applyElement;
      if (this.attrs.controls.appplyTo) {
        applyElement = this.attrs.controls.applyTo;
      } else {
        applyElement = this.props.host;
      }
      this.attrs.controls.selector = this.attrs.controls.selector || "#camera";
      this.context.elements.controls[0] = new TrackballControls(
        this.context.getElements(this.attrs.controls.selector)[0].object,
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
      const far = 10000;
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
    camera.settings.position.z = camera.settings.position.z || 10;
    camera.settings.lookAt = camera.settings.lookAt || [0, 0, 0];
  }

  initializeRenderer(renderer) {
    renderer.settings = renderer.settings || {};
    renderer.settings.shadowMap = renderer.settings.shadowMap || {
      enabled: true,
      type: THREE.PCFSoftShadowMap
    };
    (renderer.settings.setClearColor = renderer.settings.setClearColor || [
      "lightblue"
    ]),
      (renderer.settings.type = renderer.settings.type || "WebGLRenderer");
    renderer.parameters = renderer.parameters || [
      {
        alpha: true,
        antialias: true
      }
    ];
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
      light.settings.castShadow = light.settings.hasOwnProperty("castShadow")
        ? light.settings.castShadow
        : true;

      light.settings.position = light.settings.position || {
        set: [0, 0, 50]
      };
      light.settings.shadow = {
        camera: {
          near: 0.5,
          far: 300,
          left: -50,
          bottom: -50,
          right: 50,
          top: 50
        },
        bias: 0.0001,
        mapSize: { x: 1024 * 6, y: 1024 * 6 }
      };
      light.settings.penumbra = light.settings.penumbra || 0.8;
      light.parameters = light.parameters || [0xffffff, 2];
    } else if (light.settings.type === "DirectionalLight") {
      light.settings.castShadow = light.settings.hasOwnProperty("castShadow")
        ? light.settings.castShadow
        : true;
      light.settings.shadow = light.settings.shadow || {
        camera: {
          near: 0.5,
          far: 100,
          left: -50,
          bottom: -50,
          right: 50,
          top: 50
        },
        bias: 0.0001,
        mapSize: { x: 1024 * 6, y: 1024 * 6 }
      };

      light.settings.position = light.settings.position || {
        set: [0, 0, 50]
      };

      light.parameters = light.parameters || [0xffffff, 1];
    } else if (light.settings.type === "PointLight") {
      light.settings.castShadow = light.settings.hasOwnProperty("castShadow")
        ? light.settings.castShadow
        : true;

      light.parameters = light.parameters || [0xffffff, 1, 100];
      light.settings.position = light.settings.position || {
        set: [0, 0, 50]
      };

      light.settings.shadow = {
        camera: {
          near: 0.5,
          far: 300,
          left: -50,
          bottom: -50,
          right: 50,
          top: 50
        },
        bias: 0.0001,
        mapSize: { x: 512, y: 512 }
      };
    } else if (light.settings.type === "AmbientLight") {
      light.parameters = light.parameters || [0x404040];
    } else if (light.settings.type === "HemisphereLight") {
      light.parameters = light.parameters || [0xffffff, 0xffffff, 0.6];
      light.settings.position = light.settings.position || {
        set: [0, 0, 50]
      };
    }
  }

  initializeMesh(entity) {
    entity.settings = entity.settings || {};
    entity.settings.castShadow = true;
    entity.settings.receiveShadow = true;
    entity.settings.position = entity.settings.position || {};
    entity.settings.position.x = entity.settings.position.x || 0;
    entity.settings.position.y = entity.settings.position.y || 0;
    entity.settings.position.z = entity.settings.position.z || 0;
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
