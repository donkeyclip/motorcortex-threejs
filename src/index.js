import Clip3D from "./Clip";
import ObjectAnimation from "./ObjectAnimation";
import MorphAnimation from "./MorphAnimation";
import OrbitalMotion from "./OrbitalMotion";
import CameraFollow from "./CameraFollow";
import AppearanceChange from "./AppearanceChange";
import MaterialEffect from "./MaterialEffect";
import LiveDistance from "./LiveDistance";
import compositeAttributes from "./compoAttrs";
import pkg from "../package.json";
export default {
  npm_name: pkg.name,
  version: pkg.version,
  incidents: [
    {
      exportable: ObjectAnimation,
      name: "ObjectAnimation",
    },
    {
      exportable: MorphAnimation,
      name: "MorphAnimation",
    },
    {
      exportable: OrbitalMotion,
      name: "OrbitalMotion",
    },
    {
      exportable: CameraFollow,
      name: "CameraFollow",
    },
    {
      exportable: AppearanceChange,
      name: "AppearanceChange",
    },
    {
      exportable: MaterialEffect,
      name: "MaterialEffect",
    },
    {
      exportable: LiveDistance,
      name: "LiveDistance",
    },
  ],
  Clip: {
    exportable: Clip3D,
    attributesValidationRules: {},
  },
  helpers: {},
  compositeAttributes,
};
