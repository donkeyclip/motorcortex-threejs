import { Effect } from "@donkeyclip/motorcortex";

/**
 * CameraFollow Effect — positions the camera relative to a target entity
 * and looks at it (or another entity) every frame.
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
 *   targetSelector: string,    // MC selector for the entity to follow (position)
 *   lookAtTarget: boolean,     // if true, camera.lookAt(target) each frame (default true)
 *   lookAtSelector: string,    // if set, camera looks at this entity instead of the target
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

    // Resolve lookAt target: explicit lookAtSelector, or fall back to target
    const lookAtSelector = this.attrs.lookAtSelector;
    if (lookAtSelector) {
      const elements = this.context.getElements(lookAtSelector);
      if (elements && elements.length > 0) {
        this._lookAtObject = elements[0].entity.object;
      }
    }

    this._lookAt = this.attrs.lookAtTarget !== false;
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

    // Interpolate offset
    const ox =
      this.initialValue.offsetX +
      fraction * (this.targetValue.offsetX - this.initialValue.offsetX);
    const oy =
      this.initialValue.offsetY +
      fraction * (this.targetValue.offsetY - this.initialValue.offsetY);
    const oz =
      this.initialValue.offsetZ +
      fraction * (this.targetValue.offsetZ - this.initialValue.offsetZ);

    // Position camera at target + offset
    camera.position.x = this._targetObject.position.x + ox;
    camera.position.y = this._targetObject.position.y + oy;
    camera.position.z = this._targetObject.position.z + oz;

    // Look at target or explicit lookAt entity
    if (this._lookAt) {
      const lookAt = this._lookAtObject || this._targetObject;
      camera.lookAt(lookAt.position);
    }
  }
}
