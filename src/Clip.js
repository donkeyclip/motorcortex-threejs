import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils.js";
import MC from "@kissmybutton/motorcortex";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const promise = Promise;

export default class Clip3D extends MC.BrowserClip {
  onAfterRender() {
    this.attributes = {
      ...JSON.parse(JSON.stringify(this.attrs)),
      entities: this.attrs.entities,
      controls: this.attrs.controls,
    };
    this.append = false;
    this.loaders = {
      FBXLoader: (url, _f) => {
        const loader = new FBXLoader();
        loader.load(url, _f);
      },
      GLTFLoader: (url, _f) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load(url, (gltf) => {
          gltf.scene.animations = gltf.animations;
          return _f(gltf.scene);
        });
      },
    };

    this.context.loading = false;
    this.context.loadedModels = [];
    this.context.loadingModels = [];
    this.handleWindoResize();
    this.init();
  }

  getElements(selector) {
    return selector.includes("#")
      ? this.context.getElements(`!${selector}`)[0]
      : this.context.getElements(`!${selector}`);
  }

  async loadTheModel(entity) {
    //check if model is previously loaded
    const theModel = this.getElements(`#${entity.model.id}`);
    if (Object.keys(theModel?.entity?.object || {}).length) {
      if (theModel.entity.loader === "GLTFLoader") {
        return SkeletonUtils.clone(theModel.entity.object.scene);
      } else {
        return theModel.entity.object.clone();
      }
    }

    entity.model.id = entity.model.id || uuidv4();
    entity.model.class = entity.model.class || [];
    const loader = this.loaders[entity.model.loader];
    const loadModel = () => {
      return new promise((resolve) => {
        loader(entity.model.file, (obj) => resolve(obj));
      });
    };

    this.context.loadingModels.push(1);
    return loadModel(entity)
      .then((obj) => {
        this.setCustomEntity(
          "models-" + entity.model.id,
          {
            object: obj,
          },
          ["models"]
        );
        return obj;
      })
      .catch((e) => console.error(e));
  }
  async init() {
    /*
     * SCENES
     */
    !(this.attributes.scenes instanceof Array) &&
      (this.attributes.scenes = [this.attributes.scenes]);

    this.attributes.scenes.map((scene) => {
      scene.id = scene.id || uuidv4();
      scene.class = scene.class || [];
      scene.settings = scene.settings || {};
      this.setCustomEntity(
        scene.id,
        {
          settings: scene.settings,
          object: new THREE.Scene(),
        },
        ["scenes", ...scene.class]
      );

      const sceneObj = this.getElements(`#${scene.id}`);
      if (scene.fog) {
        sceneObj.entity.object.fog = new THREE.Fog(...scene.fog);
      }
    });

    /*
     * CAMERAS
     */
    !(this.attributes.cameras instanceof Array) &&
      (this.attributes.cameras = [this.attributes.cameras]);

    this.attributes.cameras.map((camera) => {
      this.initializeCamera(camera);
      this.setCustomEntity(
        camera.id || "camera",
        {
          settings: camera.settings,
          object: new THREE[camera.settings.type](...camera.parameters),
        },
        ["cameras", ...camera.class]
      );
      const cameraObj = this.getElements(`#${camera.id}`).entity.object;
      this.applySettingsToObjects(camera.settings, cameraObj);
      cameraObj.updateProjectionMatrix();
    });

    /*
     * RENDERERS
     */
    !(this.attributes.renderers instanceof Array) &&
      (this.attributes.renderers = [this.attributes.renderers]);

    this.attributes.renderers.map((renderer) => {
      this.initializeRenderer(renderer);
      this.setCustomEntity(
        renderer.id,
        {
          settings: renderer.settings,
          object: new THREE[renderer.settings.type](...renderer.parameters),
        },
        ["renderers", ...renderer.class]
      );
      const rendererObj = this.getElements(`#${renderer.id}`).entity.object;
      rendererObj.outputEncoding = THREE.sRGBEncoding;
      this.applySettingsToObjects(renderer.settings, rendererObj);
    });

    /*
     * LIGHTS
     */
    !(this.attributes.lights instanceof Array) &&
      (this.attributes.lights = [this.attributes.lights]);

    this.attributes.lights.map((light) => {
      this.initializeLight(light);
      this.setCustomEntity(
        light.id,
        {
          settings: light.settings,
          object: new THREE[light.settings.type](...light.parameters),
        },
        ["lights", ...light.class]
      );
      const lightObj = this.getElements(`#${light.id}`).entity.object;
      this.applySettingsToObjects(light.settings, lightObj);
      for (const scene of this.getElements(light.selector)) {
        scene.entity.object.add(lightObj);
        // const helper = new THREE.DirectionalLightHelper(lightObj, 5);
        // scene.entity.object.add(helper);
      }
    });

    /*
     * entities
     */
    this.attributes.models = [];

    for (const entity of this.attributes.entities) {
      this.initializeMesh(entity);
      if (entity.model) {
        // check if context previously loading
        if (!this.context.loading) {
          this.context.loading = true;
          this.contextLoading();
        }

        //create the custume entity reference
        this.setCustomEntity(
          entity.id,
          {
            model: entity.model,
            settings: entity.settings,
            object: {},
          },
          ["entities", ...entity.class]
        );

        // run the loadTheModel function
        // and push in loadingModels Array one

        this.loadTheModel(entity).then((model) => {
          //apply settings
          this.applySettingsToObjects(entity.settings, model);

          const theEntity = this.getElements(`#${entity.id}`);

          theEntity.entity.object = model;
          // add to the scene
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = entity.settings.castShadow;
              child.receiveShadow = entity.settings.receiveShadow;
            }
          });

          for (const scene of this.getElements(entity.selector)) {
            scene.entity.object.add(model);
          }

          this.context.loadedModels.push(1);
          if (
            this.context.loadedModels.length ===
            this.context.loadingModels.length
          ) {
            this.context.loading = false;
            this.contextLoaded();
          }
        });

        continue;
      }

      const geometry = new THREE[entity.geometry.type](
        ...entity.geometry.parameters
      );

      if (
        entity.material.parameters[0].side &&
        typeof entity.material.parameters[0].side == "string"
      ) {
        const side = entity.material.parameters[0].side;
        entity.material.parameters[0].side = THREE[side];
      }
      if (
        entity.material.parameters[0].textureMap &&
        !entity.material.parameters[0].map
      ) {
        entity.material.parameters[0].map = new THREE.TextureLoader().load(
          entity.material.parameters[0].textureMap
        );
      }

      if (entity.material.parameters[0].videoMap) {
        const video = document.createElement("video");
        video.src = entity.material.parameters[0].videoMap;
        this.context.rootElement.appendChild(video);
        video.play();
        entity.material.parameters[0].map = new THREE.VideoTexture(video);
      }

      const material = new THREE[entity.material.type](
        ...entity.material.parameters
      );
      console.log(entity);

      this.setCustomEntity(
        entity.id,
        {
          settings: entity.settings,
          object: new THREE[entity.settings.entityType || "Mesh"](
            geometry,
            material
          ),
        },
        ["entities", ...entity.class]
      );
      const entityObj = this.getElements(`#${entity.id}`).entity.object;

      this.applySettingsToObjects(entity.settings, entityObj);

      if (entity.callback) {
        entity.callback(entityObj.geometry, entityObj.material, entityObj);
      }

      for (const scene of this.getElements(entity.selector)) {
        scene.entity.object.add(entityObj);
      }
    }

    /*
     * renders
     */
    this.attributes.renders = this.attributes.renders || [{}];

    for (const render of this.attributes.renders) {
      render.scene = render.scene || "#" + this.getElements(".scenes")[0].id;
      render.camera = render.camera || "#" + this.getElements(".cameras")[0].id;
      render.renderer =
        render.renderer || "#" + this.getElements(".renderers")[0].id;

      this.setCustomEntity(uuidv4(), render, ["renders"]);
    }

    /*
     * CONTROLS
     */
    if (this.attributes.controls && !this.attributes.controls.applied) {
      let applyElement;
      if (this.attributes.controls.applyTo) {
        this.attrs.controls.applied = true;
        applyElement = this.attributes.controls.applyTo;
      } else {
        applyElement = this.props.host || this.props.rootElement;
      }
      this.attributes.controls.selector =
        this.attributes.controls.selector || ".cameras";
      const cameraElement = this.getElements(
        this.attributes.controls.selector
      )[0];
      const controls = new OrbitControls(
        cameraElement.entity.object,
        applyElement
      );
      controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.5;
      controls.screenSpacePanning = false;
      controls.minDistance = 1;
      controls.maxDistance = 1000;
      controls.maxPolarAngle = Math.PI / 2;

      const render = () => {
        // if (
        //   (((controls || {}).domElement || {}).style || {}).pointerEvents ===
        //   "none"
        // ) {
        //   return;
        // }
        for (const i in this.attributes.renders) {
          this.getElements(
            this.attributes.renders[i].renderer
          ).entity.object.render(
            this.getElements(this.attributes.renders[i].scene).entity.object,
            this.getElements(this.attributes.renders[i].camera).entity.object
          );
        }
      };
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const onMouseMove = (event) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const camera = this.getElements(this.attributes.renders[0].camera)
          .entity.object;
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(
          this.getElements(this.attributes.renders[0].scene).entity.object
            .children,
          true
        );
        console.log(intersects);
      };
      window.addEventListener("click", onMouseMove, false);
      const animate = () => {
        requestAnimationFrame(animate);
        // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        render();
      };
      animate();
    }
    this.render();
  }

  pushMixer(mixer) {
    this.context.elements.mixers.push(mixer);
  }

  initializeCamera(camera) {
    camera.id = camera.id || uuidv4();
    camera.class = camera.class || [];
    camera.settings = camera.settings || {};
    camera.class = camera.class || [];
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
    camera.settings.lookAt = new THREE.Vector3(
      ...(camera.settings.lookAt || [0, 0, 0])
    );
  }

  initializeRenderer(renderer) {
    renderer.id = renderer.id || uuidv4();
    renderer.class = renderer.class || [];
    renderer.settings = renderer.settings || {};
    renderer.settings.shadowMap = renderer.settings.shadowMap || {
      enabled: true,
      type: THREE.PCFSoftShadowMap,
    };
    (renderer.settings.setClearColor = renderer.settings.setClearColor || [
      "lightblue",
    ]),
      (renderer.settings.type = renderer.settings.type || "WebGLRenderer");
    renderer.parameters = renderer.parameters || [
      {
        alpha: true,
        antialias: true,
      },
    ];
    if (renderer.settings.type === "WebGLRenderer") {
      renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [
        this.context.window.devicePixelRatio,
      ];
    }

    renderer.settings.setSize = renderer.settings.setSize || [
      this.context.rootElement.offsetWidth,
      this.context.rootElement.offsetHeight,
    ];
  }

  initializeLight(light) {
    light.id = light.id || uuidv4();
    light.selector = light.selector || ".scenes";
    light.class = light.class || [];
    light.settings = light.settings || {};
    light.settings.type = light.settings.type || "DirectionalLight";

    if (light.settings.type === "SpotLight") {
      light.settings.castShadow = light.settings.hasOwnProperty("castShadow")
        ? light.settings.castShadow
        : true;

      light.settings.position = light.settings.position || {
        set: [0, 0, 50],
      };
      light.settings.shadow = {
        camera: {
          near: 0.5,
          far: 300,
          left: -50,
          bottom: -50,
          right: 50,
          top: 50,
        },
        bias: 0.0001,
        mapSize: { x: 1024 * 6, y: 1024 * 6 },
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
          top: 50,
        },
        bias: 0.0001,
        mapSize: { x: 1024 * 6, y: 1024 * 6 },
      };

      light.settings.position = light.settings.position || {
        set: [0, 0, 50],
      };

      light.parameters = light.parameters || [0xffffff, 1];
    } else if (light.settings.type === "PointLight") {
      light.settings.castShadow = light.settings.hasOwnProperty("castShadow")
        ? light.settings.castShadow
        : true;

      light.parameters = light.parameters || [0xffffff, 1, 100];
      light.settings.position = light.settings.position || {
        set: [0, 0, 50],
      };

      light.settings.shadow = {
        camera: {
          near: 0.5,
          far: 300,
          left: -50,
          bottom: -50,
          right: 50,
          top: 50,
        },
        bias: 0.0001,
        mapSize: { x: 512, y: 512 },
      };
    } else if (light.settings.type === "AmbientLight") {
      light.parameters = light.parameters || [0x404040];
    } else if (light.settings.type === "HemisphereLight") {
      light.parameters = light.parameters || [0xffffff, 0xffffff, 0.6];
      light.settings.position = light.settings.position || {
        set: [0, 0, 50],
      };
    }
  }

  initializeMesh(entity) {
    entity.id = entity.id || uuidv4();
    entity.class = entity.class || [];
    entity.selector = entity.selector || ".scenes";
    entity.settings = entity.settings || {};
    entity.settings.castShadow = entity.settings.castShadow || false;
    entity.settings.receiveShadow = entity.settings.receiveShadow || false;
    entity.settings.position = entity.settings.position || {};
    entity.settings.position.x = entity.settings.position.x || 0;
    entity.settings.position.y = entity.settings.position.y || 0;
    entity.settings.position.z = entity.settings.position.z || 0;
  }

  initializeCSS3DObject(css3d) {
    css3d.id = css3d.id || uuidv4();
    css3d.class = css3d.class || [];
    css3d.selector = css3d.selector || ".scenes";
    css3d.settings = css3d.settings || {};
    css3d.settings.position = css3d.settings.position || {};
    css3d.settings.position.x = css3d.settings.position.x || 0;
    css3d.settings.position.y = css3d.settings.position.y || 0;
    css3d.settings.position.z = css3d.settings.position.z || 0;
  }

  initializeLoader(loader) {
    loader.id = loader.id || uuidv4();
    loader.class = loader.class || [];
    loader.parameters = loader.parameters || [];
    if (loader.parameters.length < 2) {
      loader.parameters.push(
        null,
        null,
        function (/*xhr*/) {
          // console.log((xhr.loaded / xhr.total) * 100 + "%loaded");
        },
        function (error) {
          throw error;
        }
      );
    }
  }

  initializeModel(model) {
    model.id = model.id || uuidv4();
    model.class = model.class || [];
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

  handleWindoResize() {
    this.context.window.addEventListener("resize", () => {
      for (const camera of this.getElements(".cameras")) {
        camera.entity.object.aspect =
          this.context.rootElement.offsetWidth /
          this.context.rootElement.offsetHeight;
        camera.entity.object.updateProjectionMatrix();
      }

      for (const renderer of this.getElements(".renderers")) {
        renderer.entity.object.setSize(
          this.context.rootElement.offsetWidth,
          this.context.rootElement.offsetHeight
        );
      }
      // render the scene
      for (const i in this.attributes.renders) {
        this.attributes.renders[i].scene =
          this.attributes.renders[i].scene ||
          "#" + this.getElements(".scenes")[0].id;

        this.attributes.renders[i].camera =
          this.attributes.renders[i].camera ||
          "#" + this.getElements(".cameras")[0].id;

        this.attributes.renders[i].renderer =
          this.attributes.renders[i].renderer ||
          "#" + this.getElements(".renderers")[0].id;
        this.getElements(
          this.attributes.renders[i].renderer
        ).entity.object.render(
          this.getElements(this.attributes.renders[i].scene).entity.object,
          this.getElements(this.attributes.renders[i].camera).entity.object
        );
      }
    });
  }

  render() {
    for (const i in this.getElements(".renderers")) {
      const renderer = this.getElements(".renderers")[i];
      this.context.rootElement.appendChild(renderer.entity.object.domElement);
      renderer.entity.object.domElement.style.zIndex = i;
      renderer.entity.object.domElement.style.top = "0px";
      renderer.entity.object.domElement.style.position = "absolute";
    }

    for (const i in this.attributes.renders) {
      this.attributes.renders[i].scene =
        this.attributes.renders[i].scene ||
        "#" + this.getElements(".scenes")[0].id;

      this.attributes.renders[i].camera =
        this.attributes.renders[i].camera ||
        "#" + this.getElements(".cameras")[0].id;
      this.attributes.renders[i].renderer =
        this.attributes.renders[i].renderer ||
        "#" + this.getElements(".renderers")[0].id;
      this.getElements(
        this.attributes.renders[i].renderer
      ).entity.object.render(
        this.getElements(this.attributes.renders[i].scene).entity.object,
        this.getElements(this.attributes.renders[i].camera).entity.object
      );
    }
  }
}
