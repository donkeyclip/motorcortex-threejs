import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
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
