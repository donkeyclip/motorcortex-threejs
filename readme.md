# MotorCortex-Threejs

**Table of Contents**

- [MotorCortex-Threejs](#motorcortex-threejs)
  - [Demo](#demo)
- [Intro / Features](#intro--features)
  - [Renderers](#renderers)
  - [Scenes](#scenes)
  - [Cameras](#cameras)
  - [Lights](#lights)
  - [Entities](#entities)
  - [Mesh](#mesh)
  - [Model](#model)
  - [Object](#object)
  - [Controls](#controls)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Importing and Loading](#importing-and-loading)
- [Creating Incidents](#creating-incidents)
  - [3D Clip](#3d-clip)
  - [ObjectAnimation Effect](#objectanimation-effect)
  - [MorphAnimation Effect](#morphanimation-effect)
  - [CameraFollow Effect](#camerafollow-effect)
  - [OrbitalMotion Effect](#orbitalmotion-effect)
  - [AppearanceChange Effect](#appearancechange-effect)
  - [MaterialEffect](#materialeffect)
- [Adding Incidents in your clip](#adding-incidents-in-your-clip)
- [Contributing](#contributing)
- [License](#license)
- [Sponsored by](#sponsored-by)

## Demo

[Check it out here](https://donkeyclip.github.io/motorcortex-threejs/demo/)

# Intro / Features

Can you become a 3d video creator with threejs? Well yes, you can! Motorcortex-threejs is a threejs plugin for motorcortex. It exposes most of threejs functionality in a descriptive format. It automates most of the basic stuff (scenes, lights, cameras) and focuses on the animation. With motorcortex-threejs a 3d environment mainly consists of five distinct parts

- renderers
- scenes
- cameras
- lights
- entities

Scenes, cameras and lights are self-explanatory. Entities refer to any object added in the 3d scene model or mesh geometry. The plugin exports a Clip method to initialize a new 3D Clip and several Effects. The ObjectAnimation Effect is from where you can animate any property of an object's tranformation matrix ( location, rotation, scale ) and with the MorphAnimation Effect you can play any animation that your model supports.

In order to support most of the features and possible updates of threejs out of the box the descriptive representation of a 3d scene has 3 concepts

| threejs              | motorcortex-threejs      |
| -------------------- | ------------------------ |
| any property         | is an object property    |
| any function call    | is a value type of array |
| any value assignment | is a primitive value     |

\*it will all make sense please continue reading :)

## Renderers

For example, if we want to create a new renderer with alpha enabled and run setClearColor with a value of "#999" and set physicallyCorrectLights to true with threejs we would do:

```javascript
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor("#999");
renderer.physicallyCorrectLights = true;
```

in our descriptive representation we would do:

```javascript
const renderer = {
  type: "WebGLRenderer",
  parameters: [{ alpha: true }],
  settings: {
    setClearColor: ["#999"], // any function call for threejs is an array for us
    physicallyCorrectLights: true, // any value assignment for threejs is a primitive value for us
  },
};
```

| Property   | Description                                    |
| ---------- | ---------------------------------------------- |
| id         | Assign an id for selecting purposes            |
| class      | Assign a class for selecting purposes          |
| type       | A valid renderer type                          |
| parameters | The arguments to pass in the renderer function |
| settings   | Any other setting related to the renderer      |

## Scenes

If we want to create a new scene with a fog of color "#999" near 1 and far 100 with threejs we would do:

```javascript
const scene = new THREE.Scene();
scene.fog = new THREE.Fog("#999", 1, 100);
```

in our descriptive representation we would do:

```javascript
const scene = {
  fog: ["#999", 1, 100],
};
```

| Property | Description                                               |
| -------- | --------------------------------------------------------- |
| id       | Assign an id for selecting purposes                       |
| class    | Assign a class for selecting purposes                     |
| fog      | An array with arguments to pass in the THREE.Fog function |

## Cameras

If we want to create a new PerspectiveCamera with specific position and rotation with threejs we would do:

```javascript
const camera = new THREE.PerspectiveCamera(45, 800 / 600, 1, 1000);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(20, 20, 20);
camera.far = 10000;
camera.near = 1;
```

in our descriptive representation we would do:

```javascript
const camera = {
  type: "PerspectiveCamera",
  parameters: [45, 800 / 600, 1, 1000],
  settings: {
    position: { x: 10, y: 10, z: 10 },
    lookAt: [20, 20, 20],
    far: 10000,
    near: 1,
  },
};
```

| Property   | Description                                  |
| ---------- | -------------------------------------------- |
| id         | Assign an id for selecting purposes          |
| class      | Assign a class for selecting purposes        |
| type       | A valid camera type                          |
| parameters | The arguments to pass in the camera function |
| settings   | Any other setting related to the camera      |

## Lights

If we want to create a new AmbientLight with threejs we would do:

```javascript
const light = new THREE.AmbientLight("#cacaca");
scene.add(light);
```

in our descriptive representation we would do:

```javascript
const light = {
  type: "AmbientLight",
  parameters: ["#cacaca"],
};

const Directional = {
  addHelper:true
  id: "DirectionalLight",
  type: "DirectionalLight",
  parameters: ["0xfff", 1],
  settings: {
    position: { x: 0, y: -2, z: 10 },
    target: "!#myObj",
  };

```

| Property   | Description                                 |
| ---------- | ------------------------------------------- |
| id         | Assign an id for selecting purposes         |
| class      | Assign a class for selecting purposes       |
| type       | A valid light type                          |
| parameters | The arguments to pass in the light function |
| settings   | Any other setting related to the light      |
| addHelper  | Add helper object to the light              |

## Entities

As we mentioned, entities are any threejs mesh or model.

## Mesh

If we want to create a new Box with threejs we would do:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#0f0" });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);
scene.add(cube);
```

in our descriptive representation we would do:

```javascript
const box = {
  geometry: { type: "BoxGeometry", parameters: [1, 1, 1] },
  material: {
    type: "MeshBasicMaterial",
    parameters: [{ color: "#0f0" }],
  },
  settings: { position: { set: [0, 0, 0] } },
};
```

| Property   | Description                                 |
| ---------- | ------------------------------------------- |
| id         | Assign an id for selecting purposes         |
| class      | Assign a class for selecting purposes       |
| type       | A valid light type                          |
| parameters | The arguments to pass in the light function |
| settings   | Any other setting related to the light      |

## Model

If we want to load a model with threejs we would do:

```javascript
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
loader.setDRACOLoader(dracoLoader);
const url = "path/to/our/model.glb";
loader.load(url, (glb) => {
  //here we have the glb scene model
  glb.position.set(10, 10, 10);
  glb.rotation.set(0, -Math.PI / 2, 0);
  glb.scale.set(2, 2, 2);
});
```

in our descriptive representation we would do:

```javascript
const glb = {
  id: "my-model",
  model: {
    loader: "GLTFLoader",
    file: "path/to/our/model.glb",
  },
  settings: {
    position: { x: 10, y: 10, z: 10 },
    rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
  },
  children: ["child_model_name"],
};
```

| Property   | Description                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id         | Assign an id for selecting purposes                                                                                                                                   |
| class      | Assign a class for selecting purposes                                                                                                                                 |
| type       | A valid light type                                                                                                                                                    |
| parameters | The arguments to pass in the light function                                                                                                                           |
| settings   | Any other setting related to the light                                                                                                                                |
| children   | The name of a child object that the model has and you want to use it in an effect. This will then be available to use with the selector `!#my-model.child_model_name` |

## Object

When you need to add a simple Object3D to your scene just to use it in any animation you can use this type of entity. This type of entity can be used as a target to any light that supports target simply by refering to its selector.

```javascript
const object = {
  id: "myObj",
  object: true,
  settings: {
    position: { x: 10, y: 10, z: 10 },
  },
};
```

## Dynamic Custom Entities (addCustomEntity)

You can dynamically add 3D primitives to a running scene using MotorCortex's `addCustomEntity` API. This is useful for building scenes programmatically — e.g. an AI agent creating shapes on the fly.

```javascript
clip.addCustomEntity(
  {
    geometry: "BoxGeometry",
    params: [2, 2, 2],
    material: { color: "#e76f51" },
    position: [0, 1, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
  },
  "my_box", // unique entity id
  ["shapes"], // classes
  true // hidden (starts invisible)
);
```

The entity is created and added to the default scene. When `hidden` is `true`, the object starts with `visible: false` — use an `AppearanceChange` incident to reveal it.

**Extended entity types:** In addition to standard Mesh entities, `addCustomEntity` supports:

- **Lines:** Set `entityType: "Line"` with `geometry: "BufferGeometry"` and `points: [[x,y,z], [x,y,z]]` for line geometry. Supports `LineDashedMaterial`.
- **Sprites:** Set `entityType: "Sprite"` with `text: "label text"` to create a billboard text label. Control size via `spriteScale` and color via `material.color`.

```javascript
// Dashed line between two points
clip.addCustomEntity(
  {
    geometry: "BufferGeometry",
    points: [
      [0, 0, 0],
      [5, 0, 5],
    ],
    entityType: "Line",
    edges: false,
    material: {
      type: "LineDashedMaterial",
      color: "#ffffff",
      dashSize: 0.3,
      gapSize: 0.15,
    },
  },
  "my_line",
  ["lines"]
);

// Text label sprite
clip.addCustomEntity(
  {
    geometry: "BufferGeometry",
    entityType: "Sprite",
    text: "1.52 AU",
    spriteScale: 2,
    position: [2.5, 1, 2.5],
    edges: false,
    material: { type: "SpriteMaterial", color: "#ffffff" },
  },
  "my_label",
  ["labels"]
);
```

**Supported geometry types:** Any Three.js geometry — `BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `ConeGeometry`, `PlaneGeometry`, `TorusGeometry`, `TorusKnotGeometry`, `RingGeometry`, `DodecahedronGeometry`, `BufferGeometry`, etc.

**Material shorthand:** `{ color: "#e76f51" }` defaults to `MeshStandardMaterial`. For other materials, specify `{ type: "MeshPhongMaterial", color: "#e76f51", shininess: 100 }`.

**Definition shape:**

| Property    | Type    | Description                                                |
| ----------- | ------- | ---------------------------------------------------------- |
| geometry    | string  | Three.js geometry class name (e.g. `"BoxGeometry"`)        |
| params      | array   | Constructor arguments for the geometry                     |
| points      | array   | Array of `[x,y,z]` for `BufferGeometry` line endpoints     |
| entityType  | string  | `"Mesh"` (default), `"Line"`, or `"Sprite"`                |
| text        | string  | Label text (Sprite only)                                   |
| spriteScale | number  | Scale factor for sprite labels                             |
| material    | object  | `{ color, type?, emissive?, roughness?, metalness?, ... }` |
| position    | [x,y,z] | World position                                             |
| rotation    | [x,y,z] | Euler rotation in radians                                  |
| scale       | [x,y,z] | Scale multiplier                                           |
| edges       | boolean | Add wireframe edges (default `true`, set `false` to skip)  |

## Controls

Controls will provide interactivity with your 3D Clip and will help you on creation time. To enable controls simply type

```javascript
const controls = { enable: true, enableEvents: true };
```

and add them to your clip. The property enableEvents will be triggered on each click inside the scene and will log the camera position and the 3d point of where you clicked if there is any intersection with any object in the scene.

# Getting Started

## Installation

```bash
$ npm install --save @donkeyclip/motorcortex-threejs
# OR
$ yarn add @donkeyclip/motorcortex-threejs
```

## Importing and Loading

```javascript
import { loadPlugin } from "@donkeyclip/motorcortex";
import threejsPlugin from "@donkeyclip/motorcortex-threejs";
const threejs = loadPlugin(threejsPlugin);
```

# Creating Incidents

## 3D Clip

With the Clip method you describe the initial state of your 3D Scene with a javascript object. All five main parts (renderers, scenes, cameras, lights, entities) are properties of this object and of type object or collection, containing information for each part accordingly.

```javascript
const clip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [{ alpha: true }],
      settings: {
        setClearColor: ["#999"],
        physicallyCorrectLights: true,
      },
    },
    scenes: {
      fog: ["#999", 1, 100],
    },
    lights: {
      type: "AmbientLight",
      parameters: ["#cacaca"],
    },
    cameras: {
      id: "camera_1",
      type: "PerspectiveCamera",
      parameters: [45, 800 / 600, 1, 1000],
      settings: {
        position: { x: 10, y: 10, z: 10 },
        lookAt: [20, 20, 20],
        far: 10000,
        near: 1,
      },
    },
    entities: [
      {
        id: "box_1",
        geometry: { type: "BoxGeometry", parameters: [1, 1, 1] },
        material: {
          type: "MeshBasicMaterial",
          parameters: [{ color: "#0f0" }],
        },
        settings: { position: { set: [0, 0, 0] } },
      },
    ],
    controls: { enable: true, enableEvents: true },
  },
  {
    host: document.getElementById("clip"),
    containerParams: { width: "800px", height: "600px" },
  }
);
```

## ObjectAnimation Effect

If you want to animate the tranformation matrix of any object (camera, scene, light or any entity) you can do it by using the ObjectAnimation Effect.

```javascript
const cameraAnimation = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      position: { x: 20, y: 20, z: 20 },
      targetEntity: "!#box_1",
    },
  },
  {
    selector: "!#camera_1",
    duration: 10000,
  }
);
clip.addIncident(cameraAnimation, 0);
```

| Animate Attribute | Value                                              | Description                           |
| ----------------- | -------------------------------------------------- | ------------------------------------- |
| targetEntity      | `"!#targetId"`, `"!.targetClass"`                  | A selector of the entity to lookAt    |
| followEntity      | `{entity:"!#targetId", offsetX, offsetY, offsetZ}` | Entity to follow with optional offset |
| position          | `{x, y, z}`                                        | New position of the object            |
| rotation          | `{x, y, z}`                                        | New rotation of the object            |
| scale             | `{x, y, z}`                                        | New scale of the object               |

## MorphAnimation Effect

If you want to play an animation that your model supports then MorphAnimation is what you are looking for.

```javascript
const manWalk = new threejs.MorphAnimation(
  {
    attrs: {
      singleLoopDuration: 1000,
      animationName: "walk",
    },
    animatedAttrs: {
      time: 15000,
    },
  },
  {
    selector: "!#man_1",
    duration: 15000,
  }
);
clip.addIncident(manWalk, 0);
```

## CameraFollow Effect

A magnetic-chase camera that tracks a target entity with configurable offset. The camera smoothly approaches the target using exponential decay — it moves fast when far and tracks precisely when close.

```javascript
const chase = new threejs.CameraFollow(
  {
    animatedAttrs: {
      follow: { offsetX: 5, offsetY: 3, offsetZ: 5 },
    },
    targetSelector: "!#earth",
    lookAtTarget: true,
  },
  {
    selector: "!#camera_1",
    duration: 5000,
  }
);
clip.addIncident(chase, 0);
```

| Attribute      | Type    | Description                                          |
| -------------- | ------- | ---------------------------------------------------- |
| follow         | object  | `{ offsetX, offsetY, offsetZ }` — offset from target |
| targetSelector | string  | Entity selector to chase (e.g. `"!#earth"`)          |
| lookAtTarget   | boolean | When `true`, camera always looks at the target       |

The camera uses spring-based interpolation, so consecutive CameraFollow incidents create smooth orbital paths when offsets change between segments.

## OrbitalMotion Effect

Moves an entity along a circular orbit. Used for planetary systems, moons, or any circular animation. Supports parent-relative orbits (e.g. moon orbiting a planet that itself orbits the sun).

```javascript
const orbit = new threejs.OrbitalMotion(
  {
    animatedAttrs: {
      orbit: {
        radius: 10,
        revolutions: 1,
        phase: 0,
        centerX: 0,
        centerZ: 0,
        parentSelector: null,
      },
    },
  },
  {
    selector: "!#earth",
    duration: 10000,
  }
);
clip.addIncident(orbit, 0);
```

| Attribute      | Type   | Description                                                     |
| -------------- | ------ | --------------------------------------------------------------- |
| radius         | number | Orbit radius                                                    |
| revolutions    | number | Number of full orbits during the incident                       |
| phase          | number | Starting angle in radians                                       |
| centerX        | number | Orbit center X (default 0)                                      |
| centerZ        | number | Orbit center Z (default 0)                                      |
| parentSelector | string | Parent entity selector for relative orbits (e.g. `"!#jupiter"`) |

## AppearanceChange Effect

Toggles visibility of a three.js object on the timeline. Used to show/hide entities at specific points in time.

```javascript
// Show entity
clip.addIncident(
  new threejs.AppearanceChange(
    { animatedAttrs: { visible: true } },
    { selector: "!#my_entity", duration: 2 }
  ),
  1000
);

// Hide entity
clip.addIncident(
  new threejs.AppearanceChange(
    { animatedAttrs: { visible: false } },
    { selector: "!#my_entity", duration: 2 }
  ),
  5000
);
```

The Effect sets `object.visible` to the target value when MC calls `onProgress`. Use short durations (1-2ms) for instant toggles.

## MaterialEffect

Animate any material property on a three.js object. Uses the `material` composite attribute to pass all properties as a single object.

**Supported property types:**

- **Numeric** (`opacity`, `roughness`, `metalness`, `emissiveIntensity`) — smoothly interpolated
- **Color** (`color`, `emissive`, `specular`) — interpolated via `THREE.Color.lerp`
- **Clipping planes** (`clippingPlanes`) — array of `[nx, ny, nz, constant]`; constants are interpolated for animated cutaway effects
- **Boolean** (`transparent`, `depthWrite`, `wireframe`) — toggled when the incident is active

### Color animation

```javascript
clip.addIncident(
  new threejs.MaterialEffect(
    {
      animatedAttrs: { material: { color: "#2a9d8f" } },
      initialValues: { material: { color: "#e76f51" } },
    },
    { selector: "!#my_box", duration: 3000 }
  ),
  0
);
```

### Opacity fade

```javascript
clip.addIncident(
  new threejs.MaterialEffect(
    {
      animatedAttrs: { material: { opacity: 0, transparent: true } },
      initialValues: { material: { opacity: 1 } },
    },
    { selector: "!#my_sphere", duration: 2000 }
  ),
  0
);
```

### Animated cutaway (clipping planes)

Clipping planes slice away geometry at render time — the geometry is untouched and the effect is fully reversible. Each plane is `[nx, ny, nz, constant]` where the normal `(nx, ny, nz)` defines the clip direction and `constant` controls how deep the cut goes. Animate the constant from outside the object (no cut) to the center (full cut).

```javascript
const R = 1.2; // sphere radius

// Animate open: planes slide from outside to center
clip.addIncident(
  new threejs.MaterialEffect(
    {
      animatedAttrs: {
        material: {
          clippingPlanes: [
            [1, 0, 0, 0], // target: cut through center on X
            [0, 0, 1, 0], // target: cut through center on Z
          ],
        },
      },
      initialValues: {
        material: {
          clippingPlanes: [
            [1, 0, 0, R], // initial: outside sphere (no cut)
            [0, 0, 1, R],
          ],
        },
      },
    },
    { selector: "!#my_sphere", duration: 2000, easing: "easeInOutCubic" }
  ),
  0
);

// Animate close: reverse the constants
clip.addIncident(
  new threejs.MaterialEffect(
    {
      animatedAttrs: {
        material: {
          clippingPlanes: [
            [1, 0, 0, R],
            [0, 0, 1, R],
          ],
        },
      },
      initialValues: {
        material: {
          clippingPlanes: [
            [1, 0, 0, 0],
            [0, 0, 1, 0],
          ],
        },
      },
    },
    { selector: "!#my_sphere", duration: 2000, easing: "easeInOutCubic" }
  ),
  5000
);
```

This works on any geometry — spheres, boxes, models. For planet cross-sections, place concentric spheres inside and clip all of them with the same planes to reveal inner layers.

### All material properties

| Property          | Type    | Interpolation | Description                       |
| ----------------- | ------- | ------------- | --------------------------------- |
| color             | string  | Color.lerp    | Diffuse color                     |
| emissive          | string  | Color.lerp    | Emissive (glow) color             |
| specular          | string  | Color.lerp    | Specular highlight color          |
| opacity           | number  | linear        | 0 (transparent) to 1 (opaque)     |
| roughness         | number  | linear        | 0 (glossy) to 1 (rough)           |
| metalness         | number  | linear        | 0 (non-metal) to 1 (metal)        |
| emissiveIntensity | number  | linear        | Emissive light intensity          |
| transparent       | boolean | toggle        | Enable transparency               |
| depthWrite        | boolean | toggle        | Write to depth buffer             |
| wireframe         | boolean | toggle        | Render as wireframe               |
| clippingPlanes    | array   | constant lerp | Array of `[nx, ny, nz, constant]` |

# Adding Incidents in your clip

```javascript
clipName.addIncident(incidentName, startTime);
```

# Contributing

In general, we follow the "fork-and-pull" Git workflow, so if you want to submit patches and additions you should follow the next steps:

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

# License

[MIT License](https://opensource.org/licenses/MIT)

# Sponsored by

[<img src="https://presskit.donkeyclip.com/logos/donkey%20clip%20logo.svg" width=250></img>](https://donkeyclip.com)
