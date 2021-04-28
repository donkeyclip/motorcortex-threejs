import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils.js";
import { BrowserClip } from "@kissmybutton/motorcortex";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import loaders from "./utils/loaders";
import { applySettingsToObjects, enableControlEvents } from "./utils/helpers";

import {
  initializeCamera,
  initializeRenderer,
  initializeLight,
  initializeMesh,
} from "./utils/initializers";

export default class Clip3D extends BrowserClip {
  onAfterRender() {
    /* 
      attributes needs to be cloned for the scene to work as CASI
      entities and controls should not be cloned to avoid
      double creations 
    */
    const attrs = JSON.parse(JSON.stringify(this.attrs));
    this.attributes = {
      ...attrs,
      entities: attrs.entities || [],
      controls: attrs.controls,
      models: [],
      renders: attrs.renders || [{}],
    };

    this.context.loading = false;
    this.context.loadedModels = [];
    this.context.loadingModels = [];
    this.handleWindoResize();
    this.init();
  }

  getElementById(id) {
    return this.context.getElements(`!#${id}`)[0];
  }

  getEntityById(id) {
    return (this.context.getElements(`!#${id}`)[0] || {}).entity;
  }

  getObjectById(id) {
    return (this.context.getElements(`!#${id}`)[0] || {}).entity?.object;
  }

  getObjects(selector) {
    return this.context
      .getElements(selector)
      .map((element) => element.entity.object);
  }

  getObject(selector) {
    return this.context
      .getElements(selector)
      .map((element) => element.entity.object)[0];
  }

  async loadModel(entity) {
    /* 
    check if model is previously loaded
    and clone it to prevent loading twice
    */
    const model = this.getEntityById(`models-${entity.model.id}`) || {};
    if (Object.keys(model).length) {
      if (model.loader === "GLTFLoader") {
        return SkeletonUtils.clone(model.object.scene);
      } else {
        return model.object.clone();
      }
    }

    entity.model.id ??= uuidv4();
    entity.model.class ??= [];
    this.context.loadingModels.push(1);
    const loader = loaders[entity.model.loader];

    return new Promise((resolve) =>
      loader(entity.model.file, (obj) => resolve(obj))
    )
      .then((obj) => {
        /* store the model for future use */
        this.setCustomEntity(`models-${entity.model.id}`, { object: obj }, [
          "models",
        ]);
        return obj;
      })
      .catch((e) => console.error(e));
  }

  checkLoadingContext() {
    if (!this.context.loading) {
      this.context.loading = true;
      this.contextLoading();
    }
  }

  checkLoadedContext() {
    if (
      this.context.loadedModels.length === this.context.loadingModels.length
    ) {
      this.context.loading = false;
      this.contextLoaded();
    }
  }

  createModel(entity) {
    // check if context previously loading
    this.checkLoadingContext();

    //create the custom entity reference
    this.setCustomEntity(
      entity.id,
      {
        model: entity.model,
        settings: entity.settings,
        object: {},
      },
      ["entities", ...entity.class]
    );

    // run the loadModel function
    // and push in loadingModels Array one

    this.loadModel(entity).then((model) => {
      //apply settings
      applySettingsToObjects(entity.settings, model);

      const theEntity = this.getEntityById(entity.id);
      theEntity.object = model;

      this.getObjects(entity.selector).forEach((scene) => scene.add(model));
      this.context.loadedModels.push(1);
      this.checkLoadedContext();
    });
  }

  createMesh(entity) {
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

    const entityObj = new THREE[entity.settings.entityType || "Mesh"](
      geometry,
      material
    );
    applySettingsToObjects(entity.settings, entityObj);
    this.setCustomEntity(
      entity.id,
      {
        settings: entity.settings,
        object: entityObj,
      },
      ["entities", ...entity.class]
    );

    if (entity.callback) {
      entity.callback(entityObj.geometry, entityObj.material, entityObj);
    }

    this.getObjects(entity.selector).forEach((scene) => scene.add(entityObj));
  }

  async init() {
    /*
     * SCENES
     */

    if (!(this.attributes.scenes instanceof Array))
      this.attributes.scenes = [this.attributes.scenes];

    this.attributes.scenes.forEach((scene) => {
      scene.id ??= uuidv4();
      scene.class ??= [];
      scene.settings ??= {};

      this.setCustomEntity(
        scene.id,
        {
          settings: scene.settings,
          object: new THREE.Scene(),
        },
        ["scenes", ...scene.class]
      );

      const sceneObj = this.getObjectById(scene.id);
      if (scene.fog) {
        sceneObj.fog = new THREE.Fog(...scene.fog);
      }
    });

    /*
     * CAMERAS
     */
    if (!(this.attributes.cameras instanceof Array))
      this.attributes.cameras = [this.attributes.cameras];

    this.attributes.cameras.forEach((camera) => {
      initializeCamera(camera, this.context);
      this.setCustomEntity(
        camera.id,
        {
          settings: camera.settings,
          object: new THREE[camera.settings.type](...camera.parameters),
        },
        ["cameras", ...camera.class]
      );
      const cameraObj = this.getObjectById(camera.id);
      applySettingsToObjects(camera.settings, cameraObj);
      cameraObj.updateProjectionMatrix();
    });

    /*
     * RENDERERS
     */
    if (!(this.attributes.renderers instanceof Array))
      this.attributes.renderers = [this.attributes.renderers];

    this.attributes.renderers.forEach((renderer) => {
      initializeRenderer(renderer, this.context);
      this.setCustomEntity(
        renderer.id,
        {
          settings: renderer.settings,
          object: new THREE[renderer.settings.type](...renderer.parameters),
        },
        ["renderers", ...renderer.class]
      );
      const rendererObj = this.getObjectById(renderer.id);
      rendererObj.outputEncoding = THREE.sRGBEncoding;
      applySettingsToObjects(renderer.settings, rendererObj);
    });

    /*
     * LIGHTS
     */
    if (!(this.attributes.lights instanceof Array))
      this.attributes.lights = [this.attributes.lights];

    this.attributes.lights.forEach((light) => {
      initializeLight(light);
      this.setCustomEntity(
        light.id,
        {
          settings: light.settings,
          object: new THREE[light.settings.type](...light.parameters),
        },
        ["lights", ...light.class]
      );
      const lightObj = this.getObjectById(light.id);
      applySettingsToObjects(light.settings, lightObj);
      this.getObjects(light.selector).forEach((scene) => scene.add(lightObj));
    });

    /*
     ENTITIES
     */

    this.attributes.entities.forEach((entity) => {
      initializeMesh(entity);

      if (entity.model) return this.createModel(entity);
      return this.createMesh(entity);
    });

    /*
    RENDERS
     */
    this.attributes.renders.forEach((render) => {
      render.scene ??= "!#" + this.context.getElements("!.scenes")[0].id;
      render.camera ??= "!#" + this.context.getElements("!.cameras")[0].id;
      render.renderer ??= "!#" + this.context.getElements("!.renderers")[0].id;
      this.setCustomEntity(uuidv4(), render, ["renders"]);
    });

    /*
    CONTROLS
     */
    if (this.attributes.controls && !this.attributes.controls.applied) {
      const cameraObject = this.getObject("!.cameras");

      const controls = new OrbitControls(
        cameraObject,
        this.props.host || this.props.rootElement
      );
      controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.5;
      controls.screenSpacePanning = false;
      controls.minDistance = 1;
      controls.maxDistance = 1000;
      controls.maxPolarAngle = Math.PI / 2;

      if (this.attributes.controls.enableEvents) enableControlEvents(this);

      const animate = () => {
        try {
          requestAnimationFrame(animate);
          // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
          this.renderLoop();
        } catch (e) {
          console.error(e);
          window.cancelAnimationFrame(animate);
        }
      };
      animate();
    }
    this.render();
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
      this.renderLoop();
    });
  }

  render() {
    this.context.getElements("!.renderers").forEach((renderer, index) => {
      this.context.rootElement.appendChild(renderer.entity.object.domElement);
      renderer.entity.object.domElement.style.zIndex = index;
      renderer.entity.object.domElement.style.top = "0px";
      renderer.entity.object.domElement.style.position = "absolute";
    });
    this.renderLoop();
  }

  renderLoop() {
    this.attributes.renders.forEach((render) => {
      render.scene ??= "!#" + this.context.getElements("!.scenes")[0].id;
      render.camera ??= "!#" + this.context.getElements("!.cameras")[0].id;
      render.renderer ??= "!#" + this.context.getElements("!.renderers")[0].id;

      /* the render function */
      this.getObject(render.renderer).render(
        this.getObject(render.scene),
        this.getObject(render.camera)
      );
    });
  }
}
