import { Effect } from "@donkeyclip/motorcortex";

/**
 * OrbitalMotion Effect — computes circular orbit position per-frame.
 *
 * animatedAttrs: {
 *   orbit: {
 *     radius: number,          // orbit distance from center
 *     revolutions: number,     // full orbits over the incident duration
 *     phase: number,           // starting angle in radians (default 0)
 *     centerX: number,         // fixed center X (default 0)
 *     centerZ: number,         // fixed center Z (default 0)
 *     parentSelector: string,  // OR follow a moving parent entity
 *   }
 * }
 */
export default class OrbitalMotion extends Effect {
  onGetContext() {
    const orbit = this.targetValue;
    this._radius = orbit.radius || 10;
    this._revolutions = orbit.revolutions || 1;
    this._phase = orbit.phase || 0;
    this._fixedCenterX = orbit.centerX || 0;
    this._fixedCenterZ = orbit.centerZ || 0;

    // Resolve parent entity for moons orbiting a moving planet
    this._parentObject = null;
    if (orbit.parentSelector) {
      const parentElements = this.context.getElements(orbit.parentSelector);
      if (parentElements && parentElements.length > 0) {
        this._parentObject = parentElements[0].entity.object;
      }
    }
  }

  getScratchValue() {
    return {
      radius: 10,
      revolutions: 1,
      phase: 0,
      centerX: 0,
      centerZ: 0,
      parentSelector: null,
    };
  }

  onProgress(millisecond) {
    const fraction = this.getFraction(millisecond);
    const object = this.element.entity.object;
    if (!object) return;

    const angle = this._phase + fraction * this._revolutions * Math.PI * 2;

    let cx = this._fixedCenterX;
    let cz = this._fixedCenterZ;
    if (this._parentObject) {
      cx = this._parentObject.position.x;
      cz = this._parentObject.position.z;
    }

    object.position.x = cx + this._radius * Math.cos(angle);
    object.position.z = cz + this._radius * Math.sin(angle);
  }
}
