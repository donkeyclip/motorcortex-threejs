# MotorCortex-Threejs
**Table of Contents**

1. [ Key Concepts / Features ](#key-concepts--features)
    1. [ Renderers ](#renderers)
    2. [ Cameras ](#cameras)
    3. [ Lights ](#lights)
    4. [ Entities ](#entities)
        1. [ Mesh ](#mesh)
        2. [ Model ](#model)
    6. [ Controls ](#controls)
2. [ Usage ](#usage)
    1. [ Install ](#install)
    2. [ Import ](#import)
    3. [ Create a 3D Clip ](#create-a-3d-clip)
    4. [ Create an ObjectAnimation Effect ](#create-an-objectanimation-effect)
    5. [ Create a MorphAnimation Effect ](#create-a-morphanimation-effect)

### Demo
https://kissmybutton.github.io/motorcortex-threejs/demo/

# Key Concepts / Features

Can you become a 3d video creator with threejs? Well yes you can! Motorcortex-threejs is a threejs plugin for motorcortex. It exposes most of threejs functionality in a descriptive format. It automates most of the basic stuff (scenes, lights, cameras) and focuses on the animation. With motorcortex-threejs a 3d environment mainly consists of five distinct parts
- renderers
- scenes
- cameras
- lights
- entities

Scenes, cameras and lights are self-explanatory. Entities refer to any object added in the 3d scene model or mesh geometry. The plugin exports a Clip method to initialize a new 3D Clip and two Effects.  The ObjectAnimation Effect is from where you can animate any property of an object's tranformation matrix ( location, rotation, scale ) and with the MorphAnimation Effect you can play any animation that your model supports.

In order to support most of the features and possible updates of threejs out of the box the descriptive representation of a 3d scene has 3 concepts

|threejs|motorcortex-threejs|
|-|-|
|any property | is an object property|
|any function call | is a value type of array|
|any value assignment| is a primitive value

*it will all make sense please continue reading :)

## Renderers
For example, if we want to create a new renderer with alpha enabled and run setClearColor with a value of "#999" and set physicallyCorrectLights to true with threejs we would do:

```javascript
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setClearColor("#999")
renderer.physicallyCorrectLights = true
```
in our descriptive representation we would do:
```javascript
const renderer = {
	type: "WebGLRenderer", 
    parameters: [{ alpha: true }],
    settings: { 
        setClearColor: ["#999"],  // any function call for threejs is an array for us
        physicallyCorrectLights: true, // any value assignment for threejs is a primitive value for us
    }
}
```
|Property|Description|
|-|-|
|id| Assign an id for selecting purposes|
|class| Assign a class for selecting purposes|
|type| A valid renderer type|
|parameters| The arguments to pass in the renderer function|
|settings| Any other setting related to the renderer|

## Scenes
If we want to create a new scene with a fog of color "#999" near 1 and far 100 with threejs we would do:

```javascript
const scene = new THREE.Scene()
scene.fog = new THREE.Fog("#999",1,100)
```
in our descriptive representation we would do:
```javascript
const scene = {
	fog: ["#999", 1, 100]
}
```
|Property|Description|
|-|-|
|id| Assign an id for selecting purposes|
|class| Assign a class for selecting purposes|
|fog| An array with arguments to pass in the THREE.Fog function|

## Cameras
If we want to create a new PerspectiveCamera with specific position and rotation with threejs we would do:

```javascript
const camera = new THREE.PerspectiveCamera(45, 800 / 600, 1, 1000)
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(20,20,20)

```
in our descriptive representation we would do:
```javascript
const camera = {
	type: "PerspectiveCamera", 
	parameters:[45, 800 / 600, 1, 1000],
    settings: { 
        position: { x: 10, y: 10, z:10 },
		lookAt: [20, 20, 20]
    }
}
```
|Property|Description|
|-|-|
|id| Assign an id for selecting purposes|
|class| Assign a class for selecting purposes|
|type| A valid camera type|
|parameters| The arguments to pass in the camera function|
|settings| Any other setting related to the camera|

## Lights
If we want to create a new AmbientLight with threejs we would do:

```javascript
const light = new THREE.AmbientLight( "#cacaca"); 
scene.add( light );

```
in our descriptive representation we would do:
```javascript
const light = {
	type: "AmbientLight", 
	parameters:[ "#cacaca"],
}
```
|Property|Description|
|-|-|
|id| Assign an id for selecting purposes|
|class| Assign a class for selecting purposes|
|type| A valid light type|
|parameters| The arguments to pass in the light function|
|settings| Any other setting related to the light|

## Entities
As we mentioned, entities are any threejs mesh or model.
## Mesh
If we want to create a new Box with threejs we would do:

```javascript
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: "#0f0"} );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(0,0,0);
scene.add( cube );
```
in our descriptive representation we would do:
```javascript
 const box = {
   geometry: { type: "BoxGeometry", parameters: [1, 1, 1] },
   material: {
     type: "MeshBasicMaterial",
     parameters: [{ color: "#0f0" }]
   },
   settings: { position: { set:[ 0, 0, 0] }}
 };
```
|Property|Description|
|-|-|
|id| Assign an id for selecting purposes|
|class| Assign a class for selecting purposes|
|type| A valid light type|
|parameters| The arguments to pass in the light function|
|settings| Any other setting related to the light|

## Model
If we want to load a model with threejs we would do:

```javascript
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
loader.setDRACOLoader(dracoLoader);
const url = "path/to/our/model.glb"
loader.load(url, (glb) => {
	//here we have the glb scene model
	glb.position.set(10,10,10);
	glb.rotation.set(0,-Math.PI/2,0);
	glb.scale.set(2,2,2);
});
```
in our descriptive representation we would do:
```javascript
const glb = {
  model: {
    loader: "GLTFLoader",
    file: "path/to/our/model.glb",
  },
  settings: {
    position: { x: 10, y: 10, z: 10},
	rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
  }
};
```
|Property|Description|
|-|-|
|id| Assign an id for selecting purposes|
|class| Assign a class for selecting purposes|
|type| A valid light type|
|parameters| The arguments to pass in the light function|
|settings| Any other setting related to the light|

## Controls
Controls will provide interactivity with your 3D Clip and will help you on creation time. To enable controls simply type
```javascript
const controls = { enable: true, enableEvents: true }
```
and add them to your clip. The property enableEvents will be triggered on each click inside the scene and will log the camera position and the 3d point of where you clicked if there is any  intersection with any object in the scene.

# Usage
## Install
```bash
npm install @kissmybutton/motorcortex-threejs
```
## Import
```javascript
import { loadPlugin } from "@kissmybutton/motorcortex";
import threejsPlugin from "@kissmybutton/motorcortex-threejs"; 
const threejs = loadPlugin(threejs);
```

## Create a 3D Clip
With the Clip method you describe the initial state of your 3D Scene with a javascript object. All five main parts (renderers, scenes, cameras, lights, entities) are properties of this object and of type object or collection, containing information for each part accordingly.
```javascript
const clip = new threejs.Clip(
  {
    renderers: {
		type: "WebGLRenderer", 
		parameters: [{ alpha: true }],
		settings: { 
			setClearColor: ["#999"],
			physicallyCorrectLights: true
		}
	},
    scenes: {
		fog: ["#999", 1, 100]
	},
    lights: {
		type: "AmbientLight", 
		parameters:[ "#cacaca"],
	},
    cameras: {
		id:"camera_1",
		type: "PerspectiveCamera", 
		parameters:[45, 800 / 600, 1, 1000],
		settings: { 
			position: { x: 10, y: 10, z:10 },
			lookAt: [20, 20, 20]
		}
	},
    entities: [
		{
			id:"box_1",
		   geometry: { type: "BoxGeometry", parameters: [1, 1, 1] },
		   material: {
			 type: "MeshBasicMaterial",
			 parameters: [{ color: "#0f0" }]
		   },
		   settings: { position: { set:[ 0, 0, 0] }}
		},
		{
			id:"man_1"
			model: {
				loader: "GLTFLoader",
				file: "path/to/our/model.glb",
			},
			settings: {
				position: { x: 10, y: 10, z: 10},
				rotation: { x: 0, y: -Math.PI / 2, z: 0 },
				scale: { x: 2, y: 2, z: 2 },
			}
		}
	],
    controls: { enable: true, enableEvents: true },
  },
  {
    host: document.getElementById("clip"),
    containerParams: { width: "800px", height: "600px" },
  }
```

## Create an ObjectAnimation Effect
If what you want is to animate the tranformation matrix of any object (camera,scene,light or any entity) you can do so by using the ObjectAnimation Effect. The example below will animate the camera's position to 20,20,20 and will continuously looking at box_1 position. 
Note that for targetEntity and selector we are using the ids as they were set in the clip definition.

```javascript
const cameraAnimation = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      targetEntity: "!#box_1",
      position: { x: 20, y: 20, z: 20 },
    },
  },
  {
    selector: "!#camera_1",
    duration: 10000,
  }
);
clip.addIncident(cameraAnimation,0);
```
|Animate Attribute|value|Description|
|-|-|-|
|targetEntity|"!#targetId", "!.targetClass"| the id of the entity to lookAt |
|position| {x:number,y:number or "!#targetId",z:number}|the new position of the object. If set to targeting the id of an other entity it's value will be calculated by intersection points below the object. This came in handy when animating in a terrain is what you want|
|rotation|{x:number,y:number,z:number}| the new rotation of the object|
|scale| {x:number,y:number,z:number}| the new scale of the object|
|rotationSetX| number|the new rotation y of the object. This will set statically an will not animate through time|
|rotationSetY| number| the new rotation y of the object. This will set statically an will not animate through time|
|rotationSetZ| number|the new rotation z of the object. This will set statically an will not animate through time|

## Create a MorphAnimation Effect
If what you want is to play an animation that your model support then MorphAnimation is what you want.

```javascript
const manWalk = new threejsPlugin.MorphAnimation(
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
clip.addIncident(manWalk,0);
```
|Attribute|Value|Description|
|-|-|-|
|singleLoopDuration| number| The duration of a single loop|
|animationName|string| the name of the animation to be played|

|Animated Attribute|Value|Description|
|-|-|-|
|time (+any string)| number| The duration of the animation. If you want to play multiple animation in the same time you can add different time property in each incident. For example one incident may animate the property "time_1", another incident may animate the propery "time_2" and so on |


## License
[MIT License](https://opensource.org/licenses/MIT)


  
  
[![Kiss My Button](https://presskit.kissmybutton.gr/logos/kissmybutton-logo-small.png)](https://kissmybutton.gr)

