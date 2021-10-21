export const loaders = {
  FBXLoader: (url, _f) => {
    return import("three/examples/jsm/loaders/FBXLoader.js").then(
      (loaderPackage) => {
        const loader = new loaderPackage.FBXLoader();
        loader.load(url, _f);
      }
    );
  },
  GLTFLoader: (url, _f) => {
    return Promise.all([
      import("three/examples/jsm/loaders/GLTFLoader.js").then(
        (gltfl) => new gltfl.GLTFLoader()
      ),
      import("three/examples/jsm/loaders/DRACOLoader.js").then(
        (draco) => new draco.DRACOLoader()
      ),
    ]).then(([loader, dracoLoader]) => {
      loader.setDRACOLoader(dracoLoader);
      return loader.load(url, (gltf) => {
        gltf.scene.animations = gltf.animations;
        return _f(gltf.scene);
      });
    });
  },
};
