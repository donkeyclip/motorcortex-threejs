import * as THREE from "three";

export const applySettingsToObjects = (settings, obj) => {
  for (const key in settings) {
    if (settings[key] instanceof Array) {
      obj[key](...settings[key]);
      continue;
    } else if (settings[key] !== Object(settings[key])) {
      // is primitive
      obj[key] = settings[key];
      continue;
    }
    applySettingsToObjects(settings[key], obj[key]);
  }
};

export const enableControlEvents = (_this) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
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
    console.log("INTERSECTIONS", intersects);
    // eslint-disable-next-line no-console
    console.log("CAMERA POSITION", camera.position);
  };
  window.addEventListener("click", onMouseMove, false);
};
