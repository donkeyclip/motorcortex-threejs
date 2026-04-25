import { loadPlugin, HTMLClip, CSSEffect } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import threeDef from "../src/index";
import { mainScene, man } from "./entities";
import {
  animateMan,
  animateScene,
  cameraInitialPosition,
  cameraGoDown,
  cameraZoomIn,
  moveMan,
} from "./incidents";

const threejs = loadPlugin(threeDef);

// ─── Master clip with two overlapping divs ─────────────────────────────────
const master = new HTMLClip({
  html: `
  <div>
    <div id="scene1" style="position:absolute;inset:0;width:100%;height:100%;z-index:1;"></div>
    <div id="scene2" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0;"></div>
  </div>
  `,
  css: "",
  host: document.getElementById("clip"),
  containerParams: { width: "1920px", height: "1080px" },
});

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 1 — Original demo (GLTF models + animations) as CAsI
// ═══════════════════════════════════════════════════════════════════════════
const scene1Clip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [],
    },
    scenes: {},
    lights: [
      {
        id: "light_spot_pink",
        type: "PointLight",
        parameters: ["#fff", 1],
        settings: { position: { x: -50, y: 20, z: -20 } },
      },
      {
        id: "DirectionalLight",
        type: "DirectionalLight",
        parameters: ["#fff", 1],
        settings: { position: { x: 50, y: 20, z: 20 } },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: cameraInitialPosition,
        lookAt: [0, 0, 0],
        far: 30000,
      },
    },
    entities: [mainScene, man],
  },
  {
    selector: "#scene1",
    containerParams: { width: "1920px", height: "1080px" },
  }
);

scene1Clip.addIncident(cameraZoomIn(), 0);
scene1Clip.addIncident(animateScene, 0);
scene1Clip.addIncident(animateMan, 0);
scene1Clip.addIncident(cameraGoDown(), 5000);
scene1Clip.addIncident(moveMan, 0);

master.addIncident(scene1Clip, 0);

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITION — fade scene1 out, scene2 in
// ═══════════════════════════════════════════════════════════════════════════
const TRANSITION_MS = 10500;

master.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 0 } },
    { selector: "#scene1", duration: 500 }
  ),
  TRANSITION_MS
);
master.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 1 } },
    { selector: "#scene2", duration: 500 }
  ),
  TRANSITION_MS
);

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 2 — Dynamic addCustomEntity demo (primitives) as CAsI
// ═══════════════════════════════════════════════════════════════════════════
const SCENE2_START = TRANSITION_MS + 600;

const scene2Clip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [{ antialias: true }],
      settings: {
        setClearColor: ["#1a1a2e"],
      },
    },
    scenes: {},
    lights: [
      {
        id: "ambient2",
        type: "AmbientLight",
        parameters: ["#404060", 0.6],
      },
      {
        id: "sun2",
        type: "DirectionalLight",
        parameters: ["#ffffff", 1.2],
        settings: { position: { x: 10, y: 15, z: 10 } },
      },
    ],
    cameras: {
      id: "cam2",
      settings: {
        position: { x: 8, y: 6, z: 8 },
        lookAt: [0, 1, 0],
        far: 1000,
      },
    },
    entities: [
      // Ground plane
      {
        id: "ground2",
        geometry: { type: "PlaneGeometry", parameters: [20, 20] },
        material: {
          type: "MeshStandardMaterial",
          parameters: [{ color: "#2a2a4a", roughness: 0.8 }],
        },
        settings: {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        },
      },
    ],
  },
  {
    selector: "#scene2",
    containerParams: { width: "1920px", height: "1080px" },
  }
);

master.addIncident(scene2Clip, SCENE2_START);

// ─── Dynamically add shapes via addCustomEntity ────────────────────────────
const shapes = [
  {
    id: "red_box",
    def: {
      geometry: "BoxGeometry",
      params: [2, 2, 2],
      material: { color: "#e76f51" },
      position: [-3, 1, 0],
    },
  },
  {
    id: "teal_sphere",
    def: {
      geometry: "SphereGeometry",
      params: [1.2, 32, 32],
      material: { color: "#2a9d8f" },
      position: [0, 1.2, 0],
    },
  },
  {
    id: "yellow_cyl",
    def: {
      geometry: "CylinderGeometry",
      params: [0.8, 0.8, 3, 32],
      material: { color: "#e9c46a" },
      position: [3, 1.5, 0],
    },
  },
  {
    id: "orange_torus",
    def: {
      geometry: "TorusGeometry",
      params: [1, 0.4, 16, 48],
      material: { color: "#f4a261" },
      position: [0, 3.5, 0],
      rotation: [Math.PI / 4, 0, 0],
    },
  },
  {
    id: "dark_cone",
    def: {
      geometry: "ConeGeometry",
      params: [1, 2.5, 32],
      material: { color: "#264653" },
      position: [-3, 4.5, 0],
    },
  },
];

for (const s of shapes) {
  scene2Clip.addCustomEntity(s.def, s.id, ["shapes"], true);
}

// Reveal each shape by scaling from 0→1 (staggered)
// First set scale to 0 on each (they're hidden via visible:false, but we need scale 0 for animation)
// We do this after the clip is added to master so the copy exists
const initScale = () => {
  const real = scene2Clip.realClip;
  if (!real) return;
  for (const s of shapes) {
    const ent = real.context.getElements(`!#${s.id}`)?.[0];
    if (ent?.entity?.object) {
      ent.entity.object.visible = true;
      ent.entity.object.scale.set(0.001, 0.001, 0.001);
    }
  }
  // Also do it on copies
  if (real._copyClips) {
    for (const copyId in real._copyClips) {
      const copy = real._copyClips[copyId];
      for (const s of shapes) {
        const ent = copy.context.getElements(`!#${s.id}`)?.[0];
        if (ent?.entity?.object) {
          ent.entity.object.visible = true;
          ent.entity.object.scale.set(0.001, 0.001, 0.001);
        }
      }
    }
  }
};

// Run after a tick to ensure CAsI copy is created
setTimeout(initScale, 100);

// Staggered scale-up reveals
shapes.forEach((s, i) => {
  scene2Clip.addIncident(
    new threejs.ObjectAnimation(
      { animatedAttrs: { scale: { x: 1, y: 1, z: 1 } } },
      { selector: `!#${s.id}`, duration: 800 }
    ),
    500 + i * 1000
  );
});

// Spin the box
scene2Clip.addIncident(
  new threejs.ObjectAnimation(
    { animatedAttrs: { rotation: { x: Math.PI * 2, y: Math.PI * 2, z: 0 } } },
    { selector: "!#red_box", duration: 10000 }
  ),
  500
);

// Camera orbit in scene 2
scene2Clip.addIncident(
  new threejs.ObjectAnimation(
    {
      animatedAttrs: {
        position: { x: -8, y: 4, z: 8 },
        targetEntity: "!#teal_sphere",
      },
    },
    { selector: "!#cam2", duration: 6000 }
  ),
  0
);

scene2Clip.addIncident(
  new threejs.ObjectAnimation(
    {
      animatedAttrs: {
        position: { x: 0, y: 8, z: 12 },
        targetEntity: "!#teal_sphere",
      },
    },
    { selector: "!#cam2", duration: 4000 }
  ),
  6000
);

// ─── Player ────────────────────────────────────────────────────────────────
new Player({ clip: master });
