import { Effect } from "@donkeyclip/motorcortex";

/**
 * CameraFollow Effect — camera follows a target entity with spring/chase
 * behavior.  When close to the desired position the camera tracks exactly;
 * when far (e.g. after a zoomToObject) it chases with exponential decay,
 * producing a natural dolly-in that decelerates smoothly.
 *
 * animatedAttrs: {
 *   follow: {
 *     offsetX: number,   // camera offset from target (animatable)
 *     offsetY: number,
 *     offsetZ: number,
 *   }
 * }
 *
 * attrs: {
 *   targetSelector: string,    // MC selector for the entity to follow
 *   lookAtTarget: boolean,     // camera.lookAt(target) each frame (default true)
 *   lookAtSelector: string,    // look at a different entity than the target
 *   chaseTime: number,         // characteristic time in seconds (default 0.3)
 *   followThreshold: number,   // error below which camera snaps exactly (default 0.05)
 * }
 */
export default class CameraFollow extends Effect {
  onGetContext() {
    this._targetObject = null;
    this._lookAtObject = null;

    const selector = this.attrs.targetSelector;
    if (selector) {
      const elements = this.context.getElements(selector);
      if (elements && elements.length > 0) {
        this._targetObject = elements[0].entity.object;
      }
    }

    const lookAtSelector = this.attrs.lookAtSelector;
    if (lookAtSelector) {
      const elements = this.context.getElements(lookAtSelector);
      if (elements && elements.length > 0) {
        this._lookAtObject = elements[0].entity.object;
      }
    }

    this._lookAt = this.attrs.lookAtTarget !== false;
    this._chaseTime = this.attrs.chaseTime || 0.3;
    this._followThreshold = this.attrs.followThreshold || 0.05;

    // Track last timeline ms for deterministic dt computation.
    this._lastMs = null;
  }

  getScratchValue() {
    return {
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
    };
  }

  onProgress(millisecond) {
    const fraction = this.getFraction(millisecond);
    const camera = this.element.entity.object;
    if (!camera || !this._targetObject) return;

    // Interpolate offset from initialValue to targetValue.
    const ox =
      this.initialValue.offsetX +
      fraction * (this.targetValue.offsetX - this.initialValue.offsetX);
    const oy =
      this.initialValue.offsetY +
      fraction * (this.targetValue.offsetY - this.initialValue.offsetY);
    const oz =
      this.initialValue.offsetZ +
      fraction * (this.targetValue.offsetZ - this.initialValue.offsetZ);

    // Desired position = target + offset.
    const desiredX = this._targetObject.position.x + ox;
    const desiredY = this._targetObject.position.y + oy;
    const desiredZ = this._targetObject.position.z + oz;

    // Error: distance from current camera position to desired.
    const errX = camera.position.x - desiredX;
    const errY = camera.position.y - desiredY;
    const errZ = camera.position.z - desiredZ;
    const errDist = Math.sqrt(errX * errX + errY * errY + errZ * errZ);

    if (errDist < this._followThreshold) {
      // FOLLOW mode — snap to desired position (no drift).
      camera.position.x = desiredX;
      camera.position.y = desiredY;
      camera.position.z = desiredZ;
    } else {
      // CHASE mode — exponential decay of error.
      // dt from MC timeline (deterministic, frame-rate independent).
      const currentMs = millisecond;
      const dt =
        this._lastMs !== null ? (currentMs - this._lastMs) / 1000 : 1 / 60;

      // decay = e^(-dt / T)  where T = chaseTime.
      // camera = desired + error * decay
      const decay = Math.exp(-dt / this._chaseTime);
      camera.position.x = desiredX + errX * decay;
      camera.position.y = desiredY + errY * decay;
      camera.position.z = desiredZ + errZ * decay;
    }

    this._lastMs = millisecond;

    // Look at target or explicit lookAt entity.
    if (this._lookAt) {
      const lookAt = this._lookAtObject || this._targetObject;
      camera.lookAt(lookAt.position);
    }
  }
}
