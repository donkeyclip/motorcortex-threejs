import { Effect } from "@donkeyclip/motorcortex";
import { Color, Plane, Vector3 } from "three";

/**
 * MaterialEffect — animate material properties on a three.js object.
 *
 * Uses a "material" composite attribute so MC passes the full object through:
 *   animatedAttrs: { material: { opacity: 0.5, color: "#ff0000", clippingPlanes: [...] } }
 *
 * Supported property types:
 * - Numeric (opacity, roughness, metalness, emissiveIntensity) — interpolated
 * - Color (color, emissive, specular) — interpolated via Color.lerp
 * - clippingPlanes — array of [nx, ny, nz, constant]; constants interpolated from initialValues
 * - Boolean (transparent, depthWrite, wireframe) — toggled at fraction > 0
 */

const COLOR_KEYS = { color: 1, emissive: 1, specular: 1 };

export default class MaterialEffect extends Effect {
  getScratchValue() {
    const mat = this._getMaterial();
    if (!mat) return {};

    const result = {};
    for (const key of Object.keys(this.targetValue)) {
      if (key === "clippingPlanes") {
        result[key] = [];
      } else if (COLOR_KEYS[key]) {
        result[key] = mat[key]?.isColor
          ? "#" + mat[key].getHexString()
          : "#000000";
      } else {
        result[key] = mat[key] ?? 0;
      }
    }
    return result;
  }

  onProgress(millisecond) {
    const mat = this._getMaterial();
    if (!mat) return;

    const fraction = this.getFraction(millisecond);

    for (const key of Object.keys(this.targetValue)) {
      const target = this.targetValue[key];
      const initial = this.initialValue[key];

      if (key === "clippingPlanes") {
        if (!Array.isArray(target) || target.length === 0) {
          mat.clippingPlanes = [];
          mat.needsUpdate = true;
          continue;
        }
        // Interpolate each plane's constant from initial to target
        const initialPlanes = Array.isArray(initial) ? initial : [];
        mat.clippingPlanes = target.map((tp, i) => {
          const ip = initialPlanes[i] || [tp[0], tp[1], tp[2], tp[3] || 0];
          const fromConst = ip[3] ?? 0;
          const toConst = tp[3] ?? 0;
          const c = fromConst + (toConst - fromConst) * fraction;
          return new Plane(new Vector3(tp[0], tp[1], tp[2]), c);
        });
        mat.clipShadows = true;
        mat.needsUpdate = true;
        continue;
      }

      if (COLOR_KEYS[key]) {
        const from = new Color(initial || "#000000");
        const to = new Color(target);
        const lerped = from.clone().lerp(to, fraction);
        if (mat[key]?.isColor) {
          mat[key].copy(lerped);
        } else {
          mat[key] = lerped;
        }
        continue;
      }

      if (typeof target === "boolean") {
        mat[key] = fraction > 0 ? target : initial ?? !target;
        mat.needsUpdate = true;
        continue;
      }

      if (typeof target === "number") {
        const from = typeof initial === "number" ? initial : mat[key] ?? 0;
        mat[key] = from + (target - from) * fraction;
        continue;
      }
    }
  }

  _getMaterial() {
    const obj = this.element?.entity?.object;
    return obj?.material || null;
  }
}
