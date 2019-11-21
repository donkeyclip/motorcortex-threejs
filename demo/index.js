const MC = require("@kissmybutton/motorcortex");
// const Player = require("@kissmybutton/motorcortex-player/");
const Player = require("../../teo-motorcortex-player/src/Player");
const threejsPluginDefinition = require("../src/main");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
const host = document.getElementById("clip");

const containerParams = {
  width: "100%",
  height: "100%"
};

const cameras = {
  id: "camera",
  settings: {
    position: {
      x: 0,
      y: -20,
      z: 20
    }
  }
};

const box = {
  id: "box",
  geometry: {
    type: "BoxBufferGeometry",
    parameters: [2, 2, 2]
  },
  material: {
    type: "MeshLambertMaterial",
    parameters: [{ color: 0xff0000 }]
  },
  settings: {
    position: {
      x: 0,
      y: 0,
      z: 5
    }
  }
};

const plane = {
  geometry: {
    type: "PlaneBufferGeometry",
    parameters: [1000, 1000, 100, 100],
    dynamic: true
  },
  material: {
    type: "MeshPhongMaterial",
    parameters: [{ color: 0xffb851 }]
  },
  settings: {
    receiveShadow: true,
    castShadow: true
  },
  callback: (g, m, e) => {
    const pos = g.getAttribute("position");
    const pa = pos.array;

    const hVerts = g.parameters.width;
    const wVerts = g.parameters.height;
    for (let j = 0; j < hVerts; j++) {
      for (let i = 0; i < wVerts; i++) {
        //+0 is x, +1 is y.
        pa[3 * (j * wVerts + i) + 2] = Math.random() * 3;
      }
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
  }
};

const horseModel = {
  id: "horse",
  loader: "#JSONLoader",
  file:
    "https://raw.githubusercontent.com/rollup/three-jsnext/master/examples/models/animated/horse.js"
};

const horseTemplate = {
  groups: "horses",
  geometryFromModel: "#horse",
  material: {
    type: "MeshLambertMaterial",
    parameters: [
      {
        vertexColors: "FaceColors",
        morphTargets: true
      }
    ]
  },
  settings: {
    scale: {
      set: [0.02, 0.02, 0.02]
    },
    rotation: {
      x: -Math.PI / 2,
      y: Math.PI,
      z: Math.PI
    }
  }
};
const horse_1 = JSON.parse(JSON.stringify({ ...horseTemplate, id: "horse_1" }));
const horse_2 = JSON.parse(JSON.stringify({ ...horseTemplate, id: "horse_2" }));

horse_1.settings.position = {
  x: -10,
  y: 0,
  z: 3
};
horse_2.settings.position = {
  x: 5,
  y: 2,
  z: 3
};
const controls = {
  enable: true,
  cameraId: "#camera"
};
const clip = new threejsPlugin.Clip(
  {
    // renderers: { settings: { setClearColor: [0xf5f5f5] } },
    scenes: { fog: [0xf5f5f5, 0.1, 500] },
    cameras,
    entities: [box, plane, horse_1, horse_2],
    models: [horseModel],
    controls
  },
  {
    host,
    containerParams
  }
);

const boxAnimation = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      position: {
        x: 20
      }
    }
  },
  {
    id: "box_animation",
    selector: "#box",
    duration: 4000
  }
);

const cameraAnimation = new threejsPlugin.Object3D(
  {
    animatedAttrs: {
      targetEntity: "#box"
    }
  },
  {
    id: "camera_animation",
    selector: "#camera",
    duration: 4000
  }
);

const horseMAE = new threejsPlugin.MAE(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationFrames: 30,
      animationName: "gallop"
    },
    animatedAttrs: {
      time: 1500
    }
  },
  {
    selector: "#horse_1",
    duration: 1500
  }
);

clip.addIncident(boxAnimation, 0);
clip.addIncident(cameraAnimation, 0);
clip.addIncident(horseMAE, 0);
window.clip = clip;
new Player({ clip, showIndicator: true });
