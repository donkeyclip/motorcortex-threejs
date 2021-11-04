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
  camera.settings.lookAt ??= [0, 0, 0];
};

export const initializeRenderer = (renderer, context) => {
  renderer.id = renderer.id || uuidv4();
  renderer.class = renderer.class || [];
  renderer.settings = renderer.settings || {};

  (renderer.settings.setClearColor = renderer.settings.setClearColor || [
    "lightblue",
  ]),
    (renderer.type = renderer.type || "WebGLRenderer");

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
export const initializeObject = (object) => {
  object.id = object.id || uuidv4();
  object.selector = object.selector || "!.scenes";
  object.class = object.class || [];
  object.settings = object.settings || {};
};

export const initializeLight = (light) => {
  light.id = light.id || uuidv4();
  light.selector = light.selector || "!.scenes";
  light.class = light.class || [];
  light.settings = light.settings || {};
  light.settings.position = light.settings.position || { x: 0, y: 0, z: 0 };
};

export const initializeMesh = (entity) => {
  entity.id = entity.id || uuidv4();
  entity.class = entity.class || [];
  entity.selector = entity.selector || "!.scenes";
  entity.settings = entity.settings || {};
  entity.settings.position = entity.settings.position || { x: 0, y: 0, z: 0 };
};

export const initializeCSS3DObject = (css3d) => {
  css3d.id = css3d.id || uuidv4();
  css3d.class = css3d.class || [];
  css3d.selector = css3d.selector || "!.scenes";
  css3d.settings = css3d.settings || {};
  css3d.settings.position = css3d.settings.position || { x: 0, y: 0, z: 0 };
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
  model.settings.position = model.settings.position || { x: 0, y: 0, z: 0 };
};
