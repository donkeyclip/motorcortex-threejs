import { Raycaster, Vector2 } from "three";

export const applySettingsToObjects = (
  settings,
  obj,
  escapeProperties = []
) => {
  for (const key in settings) {
    if (escapeProperties.includes(key)) continue;
    if (settings[key] instanceof Array) {
      checkSchema(obj, key, "function");
      obj[key](...settings[key]);
      continue;
    } else if (settings[key] !== Object(settings[key])) {
      // is primitive
      checkSchema(obj, key, "primitive");
      obj[key] = settings[key];
      continue;
    }
    applySettingsToObjects(settings[key], obj[key]);
  }
};

export const enableControlEvents = (_this) => {
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const onMouseMove = (event) => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const camera = _this.getObject(_this.attributes.renders[0].camera);
    raycaster.setFromCamera(mouse, camera);
    const scene = _this.getObject(_this.attributes.renders[0].scene);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);
    // eslint-disable-next-line no-console
    console.groupCollapsed("Camera Position and intersections");
    // eslint-disable-next-line no-console
    console.log("INTERSECTIONS", intersects);
    // eslint-disable-next-line no-console
    console.log("CAMERA POSITION", camera.position);
    // eslint-disable-next-line no-console
    console.groupEnd();
  };
  window.addEventListener("click", onMouseMove, false);
};

export const checkSchema = (obj, key, type) => {
  switch (type) {
    case "function":
      if (typeof obj[key] !== "function")
        console.error(`Object property "${key}" is not a function`, obj);
      return;
    case "primitive":
      if (
        !Object.prototype.hasOwnProperty.call(obj, key) &&
        typeof obj !== "function" &&
        !["Euler"].includes(obj.constructor.name)
      )
        console.warn(
          `Key "${key}" not found in object`,
          obj,
          obj.constructor.name
        );
      return;
  }
};
