import { BrowserClip } from "@donkeyclip/motorcortex";
import * as THREE from "three";
import { Scene, TextureLoader, VideoTexture } from "three";
import { v4 as uuidv4 } from "uuid";
import { applySettingsToObjects, enableControlEvents } from "./utils/helpers";
import {
  initializeCamera,
  initializeLight,
  initializeMesh,
  initializeObject,
  initializeRenderer,
} from "./utils/initializers";
import { loaders } from "./utils/loaders";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

let SkeletonUtils;
export default class Clip3D extends BrowserClip {
  onAfterRender() {
    this.lightCallbackFunctions = [];
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

    this.checkLoadingContext();
    this.context.loadedModels = [];
    this.context.loadingModels = [];
    this.handleWindowResize();
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
    return this.context.getElements(selector)[0]?.entity.object;
  }

  loadModel(entity) {
    /*
    check if model is previously loaded
    and clone it to prevent loading twice
    */
    const model = this.getEntityById(`models-${entity.model.id}`) || {};
    if (Object.keys(model).length) {
      if (model.loader !== "GLTFLoader") {
        return Promise.resolve(model.object.clone());
      }

      if (SkeletonUtils) {
        return Promise.resolve(SkeletonUtils.clone(model.object.scene));
      }

      return import("three/examples/jsm/utils/SkeletonUtils.js").then(
        (Skeleton) => {
          SkeletonUtils ||= Skeleton.SkeletonUtils;
          return SkeletonUtils.clone(model.object.scene);
        }
      );
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
  checkIfFragment() {
    /* todo: change this function when mc is ready to inform us about fragmented clips  */
    if (this.attrs.isCasi && !this.attrs.timeCheckedCasi) {
      this.attrs.timeCheckedCasi = 1;
      return true;
    }
    return false;
  }
  checkLoadedContext() {
    if (
      this.context.loadedModels.length === this.context.loadingModels.length
    ) {
      this.context.loading = false;
      this.contextLoaded();
      if (this.checkIfFragment()) return;
      this.animate();
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
      if (entity.children) {
        entity.children.map((key) => {
          let theChild = {};
          model.traverse((child) => {
            if (child.name === key) {
              theChild = child;
            }
          });
          //create the custom entity reference
          this.setCustomEntity(
            `${entity.id}.${key}`,
            {
              object: theChild,
            },
            ["entities", ...entity.class, "child"]
          );
        });
      }
      model._id = entity.id;
      /* ENTITY CAST SHADOW */
      if (entity.settings.castShadow || entity.settings.receiveShadow) {
        model.castShadow = entity.settings.castShadow || false;
        model.receiveShadow = entity.settings.receiveShadow || false;
        model.traverse((child) => {
          if (entity.settings.castShadow) {
            child.castShadow = true;
          }
          if (entity.settings.receiveShadow) {
            child.receiveShadow = true;
          }
        });
      }
      this.getObjects(entity.selector).forEach((scene) => scene.add(model));
      this.context.loadedModels.push(1);
      this.checkLoadedContext();
    });
  }
  addLightHelper(light, type, selector) {
    let helper;
    switch (type) {
      case "DirectionalLight":
        helper = new THREE.DirectionalLightHelper(light, 5);
        break;
      case "PointLight":
        helper = new THREE.PointLightHelper(light, 5);
        break;
      case "SpotLight":
        helper = new THREE.SpotLightHelper(light, 5);
        break;
      case "HemisphereLight":
        helper = new THREE.HemisphereLightHelper(light, 5);
        break;
    }
    this.getObjects(selector).forEach((scene) => {
      const helper1 = new THREE.CameraHelper(light.shadow.camera);
      scene.add(helper1);
      scene.add(helper);
    });
  }
  createObject(entity) {
    initializeObject(entity);
    const object = new THREE.Object3D();
    applySettingsToObjects(entity.settings, object);
    //create the custom entity reference
    this.setCustomEntity(
      `${entity.id}`,
      {
        object,
      },
      ["entities", ...entity.class]
    );
    this.getObjects(entity.selector).forEach((scene) => {
      scene.add(object);
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
      entity.material.parameters[0].map = new TextureLoader().load(
        entity.material.parameters[0].textureMap
      );
    }

    if (entity.material.parameters[0].videoMap) {
      const video = document.createElement("video");
      video.src = entity.material.parameters[0].videoMap;
      this.context.rootElement.appendChild(video);
      video.play();
      entity.material.parameters[0].map = new VideoTexture(video);
    }

    const material = new THREE[entity.material.type](
      ...entity.material.parameters
    );

    let entityObj;
    // create a single mesh
    if (!entity?.settings?.count) {
      entityObj = new THREE[entity.settings.entityType || "Mesh"](
        geometry,
        material
      );

      applySettingsToObjects(entity.settings, entityObj);
    } else {
      // create an instanced mesh
      entityObj = new THREE.InstancedMesh(
        geometry,
        material,
        entity.settings.count
      );
      for (let i = 0; i < entity.settings.count; i++) {
        const matrixObject = new THREE.Object3D();

        matrixObject.position.set(...entity.settings.instance[i][1]);
        matrixObject.rotation.set(...entity.settings.instance[i][2]);
        if (entity.settings.instance[i][1][3]) {
          entityObj.setColorAt(
            entity.settings.instance[i][0],
            new THREE.Color(entity.settings.instance[i][3])
          );
        } else {
          entityObj.setColorAt(
            entity.settings.instance[i][0],
            new THREE.Color(entity.material?.parameters[0]?.color || "#000")
          );
        }

        matrixObject.updateMatrix();
        entityObj.setMatrixAt(
          entity.settings.instance[i][0],
          matrixObject.matrix
        );
      }

      entityObj.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }

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

    this.getObjects(entity.selector).forEach((scene) => {
      scene.add(entityObj);
    });
  }

  init() {
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
          object: new Scene(),
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
          object: new THREE[camera.type](...camera.parameters),
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
          object: new THREE[renderer.type](...renderer.parameters),
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
          object: new THREE[light.type](...light.parameters),
        },
        ["lights", ...light.class]
      );
      const lightObj = this.getObjectById(light.id);
      applySettingsToObjects(light.settings, lightObj, ["target"]);

      if (light.addHelper) {
        this.addLightHelper(lightObj, light.type, light.selector);
      }

      /* ADD TARGET OBJECT TO LIGHT */
      if (typeof light.settings.target === "string") {
        this.lightCallbackFunctions.push(() => {
          const target = this.context.getElements(light.settings.target)[0]
            .entity.object;
          lightObj.target = target;
        });
      }

      this.getObjects(light.selector).forEach((scene) => scene.add(lightObj));
    });
    /*
     ENTITIES
     */

    this.attributes.entities.forEach((entity) => {
      initializeMesh(entity);

      if (entity.model) return this.createModel(entity);
      else if (entity.object) return this.createObject(entity);
      return this.createMesh(entity);
    });
    /*
      Execute all light function callbacks
      we need this to add target to lights.
      Target entities should and must be initialized after
      initializing the lights
    */
    this.lightCallbackFunctions.forEach((func) => func());

    /*
    RENDERS
     */
    this.attributes.renders.forEach((render) => {
      render.scene ??= `!#${this.context.getElements("!.scenes")[0].id}`;
      render.camera ??= `!#${this.context.getElements("!.cameras")[0].id}`;
      render.renderer ??= `!#${this.context.getElements("!.renderers")[0].id}`;
      this.setCustomEntity(uuidv4(), render, ["renders"]);
    });

    /*
      store first camera, renderer and scene as default render combination
    */
    this.defaultScene = this.getObject(
      `!#${this.context.getElements("!.scenes")[0].id}`
    );
    this.defaultCamera = this.getObject(
      `!#${this.context.getElements("!.cameras")[0].id}`
    );
    this.defaultRenderer = this.getObject(
      `!#${this.context.getElements("!.renderers")[0].id}`
    );

    /* COMPOSERS */
    if (this.attributes.postProcessing) {
      const { offsetWidth, offsetHeight } = this.context.rootElement;

      this.composer = new EffectComposer(this.defaultRenderer);
      const renderScene = new RenderPass(this.defaultScene, this.defaultCamera);
      this.composer.addPass(renderScene);

      if (this.attributes.postProcessing.bloomPass) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(offsetWidth, offsetHeight),
          ...this.attributes.postProcessing.bloomPass.parameters
        );

        applySettingsToObjects(
          this.attributes.postProcessing.bloomPass.settings,
          bloomPass
        );

        this.composer.addPass(bloomPass);
      }
    }

    let frameNumber;
    this.animate = () => {
      try {
        frameNumber = requestAnimationFrame(this.animate);
        this.renderLoop();
        this.stats?.update();
      } catch (e) {
        console.error(e);
        window.cancelAnimationFrame(frameNumber);
      }
    };

    /*
    check if the content is loaded
    we need this call when no models
    are loaded into the scene
    */
    if (this.context.loading) this.checkLoadedContext();

    /* STATS */
    // this.stats;
    // if (this.attributes.stats && !this.checkIfFragment()) {
    //   import("three/examples/jsm/libs/stats.module").then((res) => {
    //     this.stats = res.default();
    //     this.context.window.document.body.appendChild(this.stats.dom);
    //   });
    // }

    /*
    CONTROLS
     */
    if (!this.attributes.controls?.enable || this.attributes.controls.applied) {
      return this.render();
    }

    const cameraEntity = this.getElements("!.cameras")[0].entity;
    const cameraObject = cameraEntity.object;
    const {
      enableDamping = true,
      dampingFactor = 0.5,
      screenSpacePanning = false,
      minDistance = 1,
      maxDistance = 1000,
      maxPolarAngle = Math.PI / 2,
      enableEvents,
    } = this.attributes.controls;

    return import("three/examples/jsm/controls/OrbitControls.js")
      .then((res) => {
        return res.OrbitControls;
      })
      .then((OrbitControls) => {
        const controls = new OrbitControls(
          cameraObject,
          this.props.host || this.props.rootElement
        );

        controls.target.set(...cameraEntity.settings.lookAt);
        controls.enableDamping = enableDamping; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = dampingFactor;
        controls.screenSpacePanning = screenSpacePanning;
        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;
        controls.maxPolarAngle = maxPolarAngle;
        controls.update();
        if (enableEvents) enableControlEvents(this);
        this.render();
      });
  }

  handleWindowResize() {
    this.context.window.addEventListener("resize", () => {
      const { offsetWidth, offsetHeight } = this.context.rootElement;
      const aspect = offsetWidth / offsetHeight;
      for (const camera of this.getElements("!.cameras")) {
        camera.entity.object.aspect = aspect;
        camera.entity.object.updateProjectionMatrix();
      }

      for (const renderer of this.context.getElements("!.renderers")) {
        renderer.entity.object.setSize(offsetWidth, offsetHeight);
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
    /*
     This code is only executed when postprocessing is set
     at clip attributes
     */

    if (this.attributes.postProcessing) {
      this.composer.render();
      return;
    }

    if (this.attributes.renders.length === 1) {
      return this.defaultRenderer.render(this.defaultScene, this.defaultCamera);
    }
    this.attributes.renders.forEach((render) => {
      const renderer = render.renderer
        ? this.getObject(render.renderer)
        : this.defaultRenderer;
      const scene = render.scene
        ? this.getObject(render.scene)
        : this.defaultScene;
      const camera = render.camera
        ? this.getObject(render.camera)
        : this.defaultCamera;
      /* the render function */
      renderer.render(scene, camera);
    });
  }
}
