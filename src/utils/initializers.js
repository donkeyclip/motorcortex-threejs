import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

export const initializeCamera = (camera, context) => {
  camera.id = camera.id || uuidv4();
  camera.class = camera.class || [];
  camera.settings = camera.settings || {};
  camera.class = camera.class || [];
  camera.type = camera.type || "PerspectiveCamera";
  camera.parameters = camera.parameters || {};
  if (camera.type === "PerspectiveCamera") {
    const fov = 45;
    const aspect =
      context.rootElement.offsetWidth / context.rootElement.offsetHeight;

    const near = 1;
    const far = 10000;
    camera.parameters = [fov, aspect, near, far];
  } else {
    const left = context.rootElement.offsetWidth / -2;
    const right = context.rootElement.offsetWidth / 2;
    const top = context.rootElement.offsetHeight / 2;
    const bottom = context.rootElement.offsetHeight / -2;
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
};

export const initializeRenderer = (renderer, context) => {
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
    (renderer.type = renderer.type || "WebGLRenderer");
  renderer.parameters = renderer.parameters || [
    {
      alpha: true,
      antialias: true,
    },
  ];
  if (renderer.type === "WebGLRenderer") {
    renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [
      context.window.devicePixelRatio,
    ];
  }

  renderer.settings.setSize = renderer.settings.setSize || [
    context.rootElement.offsetWidth,
    context.rootElement.offsetHeight,
  ];
};

export const initializeLight = (light) => {
  light.id = light.id || uuidv4();
  light.selector = light.selector || "!.scenes";
  light.class = light.class || [];
  light.settings = light.settings || {};
  light.type = light.type || "DirectionalLight";

  if (light.type === "SpotLight") {
    // eslint-disable-next-line no-prototype-builtins
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
  } else if (light.type === "DirectionalLight") {
    // eslint-disable-next-line no-prototype-builtins
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
  } else if (light.type === "PointLight") {
    // eslint-disable-next-line no-prototype-builtins
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
  } else if (light.type === "AmbientLight") {
    light.parameters = light.parameters || [0x404040];
  } else if (light.type === "HemisphereLight") {
    light.parameters = light.parameters || [0xffffff, 0xffffff, 0.6];
    light.settings.position = light.settings.position || {
      set: [0, 0, 50],
    };
  }
};

export const initializeMesh = (entity) => {
  entity.id = entity.id || uuidv4();
  entity.class = entity.class || [];
  entity.selector = entity.selector || "!.scenes";
  entity.settings = entity.settings || {};
  entity.settings.castShadow = entity.settings.castShadow || false;
  entity.settings.receiveShadow = entity.settings.receiveShadow || false;
  entity.settings.position = entity.settings.position || {};
  entity.settings.position.x = entity.settings.position.x || 0;
  entity.settings.position.y = entity.settings.position.y || 0;
  entity.settings.position.z = entity.settings.position.z || 0;
};

export const initializeCSS3DObject = (css3d) => {
  css3d.id = css3d.id || uuidv4();
  css3d.class = css3d.class || [];
  css3d.selector = css3d.selector || "!.scenes";
  css3d.settings = css3d.settings || {};
  css3d.settings.position = css3d.settings.position || {};
  css3d.settings.position.x = css3d.settings.position.x || 0;
  css3d.settings.position.y = css3d.settings.position.y || 0;
  css3d.settings.position.z = css3d.settings.position.z || 0;
};

export const initializeLoader = (loader) => {
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
};

export const initializeModel = (model) => {
  model.id = model.id || uuidv4();
  model.class = model.class || [];
  model.settings = model.settings || {};
  model.settings.position = model.settings.position || {};
  model.settings.position.x = model.settings.position.x || 0;
  model.settings.position.y = model.settings.position.y || 0;
  model.settings.position.z = model.settings.position.z || 0;
};
