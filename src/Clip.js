import uuidv1 from "uuid/v4";
import * as THREE from "three";
import MC from "@kissmybutton/motorcortex";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
const promise = Promise;

export default class Clip3D extends MC.API.DOMClip {
  onAfterRender() {
    this.attributes = JSON.parse(JSON.stringify(this.attrs));
    this.append = false;
    this.loaders = [
      {
        type: "FBXLoader",
        callback: (url, _f) => {
          const loader = new FBXLoader();
          loader.load(url, _f);
        }
      },
      {
        type: "GLTFLoader",
        callback: (url, _f) => {
          const loader = new GLTFLoader();
          const dracoLoader = new DRACOLoader();
          loader.setDRACOLoader(dracoLoader);
          loader.load(url, _f);
        }
      }
    ];

    this.context.loading = false;
    this.context.loadingElements = [];
    this.init();
    this.handleWindoResize();
  }

  getElements(selector) {
    return selector.includes("#")
      ? this.context.getElements(`!${selector}`)[0]
      : this.context.getElements(`!${selector}`);
  }

  async init() {
    /*
    * SCENES
    */
    !(this.attributes.scenes instanceof Array) &&
      (this.attributes.scenes = [this.attributes.scenes]);

    this.attributes.scenes.map(scene => {
      scene.id = scene.id || uuidv1();
      scene.class = scene.class || [];
      scene.settings = scene.settings || {};
      this.setCustomEntity(
        scene.id,
        {
          settings: scene.settings,
          object: new THREE.Scene()
        },
        ["scenes", ...scene.class]
      );

      const sceneObj = this.getElements(`#${scene.id}`);
      if (scene.settings.fog) {
        sceneObj.fog = new THREE.Fog(...scene.settings.fog);
      }
    });

    /*
    * CAMERAS
    */
    !(this.attributes.cameras instanceof Array) &&
      (this.attributes.cameras = [this.attributes.cameras]);

    this.attributes.cameras.map(camera => {
      this.initializeCamera(camera);
      this.setCustomEntity(
        camera.id,
        {
          settings: camera.settings,
          object: new THREE[camera.settings.type](...camera.parameters)
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

    this.attributes.renderers.map(renderer => {
      this.initializeRenderer(renderer);
      this.setCustomEntity(
        renderer.id,
        {
          settings: renderer.settings,
          object: new THREE[renderer.settings.type](...renderer.parameters)
        },
        ["renderers", ...renderer.class]
      );
      const rendererObj = this.getElements(`#${renderer.id}`).entity.object;
      this.applySettingsToObjects(renderer.settings, rendererObj);
    });

    /*
    * LIGHTS
    */
    !(this.attributes.lights instanceof Array) &&
      (this.attributes.lights = [this.attributes.lights]);

    this.attributes.lights.map(light => {
      this.initializeLight(light);
      this.setCustomEntity(
        light.id,
        {
          settings: light.settings,
          object: new THREE[light.settings.type](...light.parameters)
        },
        ["lights", ...light.class]
      );
      const lightObj = this.getElements(`#${light.id}`).entity.object;
      this.applySettingsToObjects(light.settings, lightObj);
      for (const scene of this.getElements(light.selector)) {
        scene.entity.object.add(lightObj);
      }
    });

    // /*
    // * CSS3DOBJECTS
    // */
    // !(this.attributes.css3d_objects instanceof Array) &&
    //   (this.attributes.css3d_objects = [this.attributes.css3d_objects]);

    // this.attributes.css3d_objects.map(css3d => {
    //   this.initializeMesh(css3d);
    //   const elements = this.context.rootElement.querySelectorAll(
    //     css3d.selector
    //   );

    //   this.setCustomEntity(
    //     css3d.id,
    //     {
    //       settings: css3d.settings,
    //       object: new CSS3DObject(element);
    //     },
    //     ["css3d_objects", ...renderer.class]
    //   );
    //   const lightObj = this.getElements(`#${css3d.id}`);
    //   this.applySettingsToObjects(css3d.settings, lightObj);
    //   lightObj.updateProjectionMatrix();
    // });

    // for (const css3d of this.attributes.css3d_objects || []) {
    //   css3d.scenes = css3d.scenes || "#" + this.context.elements.scenes[0].id;
    //   css3d.id = css3d.id || uuidv1();
    //   if (this.context.getElements("#" + css3d.id)[0]) {
    //     throw `This id ${css3d.id} is already in use.`;
    //   }
    //   this.initializeMesh(css3d);
    //   const elements = this.context.rootElement.querySelectorAll(
    //     css3d.selector
    //   );
    //   for (const element of elements) {
    //     css3d.object = new CSS3DObject(element);
    //     this.context.elements.css3d_objects.push(css3d);

    //     this.applySettingsToObjects(css3d.settings, css3d.object);

    //     for (const scene of this.context.getElements(css3d.scenes)) {
    //       scene.object.add(css3d.object);
    //     }
    //   }
    // }

    /*
    * LOADERS
    */
    // for (const loader of this.context.loaders) {
    //   loader.id = loader.id;

    //   this.initializeLoader(loader);
    //   if (!THREE[loader.type]) {
    //     try {
    //       require("three/examples/js/loaders/" + loader.type);
    //     } catch (e) {
    //       throw e;
    //     }
    //   }

    //   loader.object = new THREE[loader.type]();
    //   this.context.elements.loaders.push(loader);
    // }
    // /*
    // * MODELS
    // */
    // for (const model of this.attributes.models) {
    //   // model.scenes = model.scenes || "#" + this.context.elements.scenes[0].id;
    //   model.id = model.id || uuidv1();
    //   if (this.context.getElements("#" + model.id)[0]) {
    //     throw `This id ${model.id} is already in use.`;
    //   }
    //   // this.initializeModel(model);
    //   const loader = this.context.getElements(model.loader)[0];

    //   const loadGeometry = () => {
    //     return new promise(resolve => {
    //       if (model.loader === "#OBJMTLLoader") {
    //         const manager = new THREE.LoadingManager();
    //         // manager.addHandler(/\.dds$/i, new THREE.DDSLoader());
    //         new MTLLoader(manager).load(model.file[0], function(materials) {
    //           materials.preload();
    //           new OBJLoader(manager)
    //             .setMaterials(materials)
    //             .load(model.file[1], resolve);
    //         });
    //       } else {
    //         loader.parameters[0] = model.file;
    //         loader.parameters[1] = resolve;

    //         loader.object.load(...loader.parameters);
    //       }
    //     });
    //   };

    //   loadGeometry().then(g => {
    //     this.hasLoaded = true;
    //     const that = this;
    //     that.context.loadingElements.splice(0, 1);
    //     if (that.context.loadingElements.length === 0) {
    //       that.context.loading = false;
    //       that.o._thisClip.contextLoaded();
    //     }

    //     for (const i in that.context.elements.entities) {
    //       if (
    //         that.context.elements.entities[i].geometryFromModel ===
    //         "#" + model.id
    //       ) {
    //         const mod = that.context.getElements(
    //           that.context.elements.entities[i].geometryFromModel
    //         )[0];
    //         if (mod.loader === "#JSONLoader") {
    //           const entity = that.context.elements.entities[i];
    //           entity.object.geometry = g;
    //           entity.material = undefined;
    //           that.applySettingsToObjects(entity.settings, entity.object);
    //           entity.object.updateMorphTargets();
    //         } else if (
    //           mod.loader === "#FBXLoader" ||
    //           mod.loader === "#OBJMTLLoader"
    //         ) {
    //           const entity = that.context.elements.entities[i];
    //           if (that.context.elements.entities[i].geometryFromModel) {
    //             if (entity.clone) {
    //               entity.object = g.clone();
    //             } else {
    //               entity.object = g;
    //             }

    //             if (entity.texturePath) {
    //               const myloader = new THREE.TextureLoader();
    //               const myTexture = myloader.load(entity.texturePath);
    //               myTexture.anisotropy = 16;
    //               const customDepthMaterial = new THREE.MeshDepthMaterial({
    //                 depthPacking: THREE.RGBADepthPacking,

    //                 alphaMap: myTexture, // or, alphaMap: myAlphaMap

    //                 alphaTest: 0.5
    //               });

    //               entity.object.customDepthMaterial = customDepthMaterial;
    //             }
    //             that.applySettingsToObjects(entity.settings, entity.object);
    //             entity.object.traverse(function(child) {
    //               if (child.isMesh) {
    //                 child.castShadow = true;
    //                 child.receiveShadow = true;
    //               }
    //             });

    //             that.context.elements.scenes[0].object.add(entity.object);
    //           }
    //         }
    //       }
    //     }

    //     // this.elements.scenes[0].object.add(g);
    //     //rerender after the loading has been completed
    //     that.o._thisClip.render();
    //   });

    //   const that = this;
    //   that.context.loadingElements.push(1);
    //   if (that.context.loadingElements.length === 1 && !that.hasLoaded) {
    //     that.context.loading = true;
    //     that.o._thisClip.contextLoading();
    //   }
    //   // create pseudo point as element
    //   const geometry = new THREE.BufferGeometry();
    //   // const material = new THREE.PointsMaterial();
    //   // const pseudoModel = new THREE.Points(geometry, material);
    //   // pseudoModel.name = model.id;
    //   // model.object = pseudoModel;
    //   model.geometry = geometry;
    //   // this.applySettingsToObjects(model.settings, model.object);

    //   this.context.elements.models.push(model);
    // }
    /*
    * entities
    */

    for (const entity of this.attributes.entities) {
      this.initializeMesh(entity);

      const geometry = entity.geometryFromModel
        ? this.getElements(entity.geometryFromModel).geometry
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

      this.setCustomEntity(
        entity.id,
        {
          settings: entity.settings,
          object: new THREE[entity.settings.entityType || "Mesh"](
            geometry,
            material
          )
        },
        ["lights", ...entity.class]
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

      this.setCustomEntity(uuidv1(), render, ["renders"]);
    }

    /*
    * CONTROLS
    */
    if (this.attributes.controls) {
      let applyElement;
      if (this.attributes.controls.appplyTo) {
        applyElement = this.attributes.controls.applyTo;
      } else {
        applyElement = this.props.host;
      }
      this.attributes.controls.selector =
        this.attributes.controls.selector || ".cameras";
      const cameraElement = this.getElements(
        this.attributes.controls.selector
      )[0];
      const controls = new TrackballControls(
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
        if (
          (((controls || {}).domElement || {}).style || {}).pointerEvents ===
          "none"
        ) {
          return;
        }
        for (const i in this.attributes.renders) {
          this.getElements(
            this.attributes.renders[i].renderer
          ).entity.object.render(
            this.getElements(this.attributes.renders[i].scene).entity.object,
            this.getElements(this.attributes.renders[i].camera).entity.object
          );
        }
      };
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
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
    camera.id = camera.id || uuidv1();
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
    camera.settings.lookAt = camera.settings.lookAt || [0, 0, 0];
  }

  initializeRenderer(renderer) {
    renderer.id = renderer.id || uuidv1();
    renderer.class = renderer.class || [];
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
    light.id = light.id || uuidv1();
    light.selector = light.selector || ".scenes";
    light.class = light.class || [];
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
    entity.id = entity.id || uuidv1();
    entity.class = entity.class || [];
    entity.selector = entity.selector || ".scenes";
    entity.settings = entity.settings || {};
    entity.settings.castShadow = true;
    entity.settings.receiveShadow = true;
    entity.settings.position = entity.settings.position || {};
    entity.settings.position.x = entity.settings.position.x || 0;
    entity.settings.position.y = entity.settings.position.y || 0;
    entity.settings.position.z = entity.settings.position.z || 0;
  }

  initializeCSS3DObject(css3d) {
    css3d.id = css3d.id || uuidv1();
    css3d.class = css3d.class || [];
    css3d.selector = css3d.selector || ".scenes";
    css3d.settings = css3d.settings || {};
    css3d.settings.position = css3d.settings.position || {};
    css3d.settings.position.x = css3d.settings.position.x || 0;
    css3d.settings.position.y = css3d.settings.position.y || 0;
    css3d.settings.position.z = css3d.settings.position.z || 0;
  }

  initializeLoader(loader) {
    loader.id = loader.id || uuidv1();
    loader.class = loader.class || [];
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
    model.id = model.id || uuidv1();
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
