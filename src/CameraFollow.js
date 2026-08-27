import { Effect } from "@donkeyclip/motorcortex";
import { Vector3 } from "three";

/**
 * CameraFollow Effect — camera follows a target entity with spring/chase
 * behavior for both position AND lookAt direction.
 *
 * During playback: when close, tracks exactly; when far, chases with
 * exponential decay (magnetic approach).
 * During seek (or backward): snaps directly.
 *
 * animatedAttrs: {
 *   follow: { offsetX, offsetY, offsetZ }
 * }
 *
 * attrs: {
 *   targetSelector: string,
 *   lookAtTarget: boolean (default true),
 *   lookAtSelector: string,
 *   chaseTime: number (default 0.3),
 *   followThreshold: number (default 0.05),
 * }
 */

const SEEK_THRESHOLD = 0.1;

// Reusable vector to avoid per-frame allocation.
const _lookAtVec = new Vector3();

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

    // Tracked lookAt point for magnetic interpolation.
    this._currentLookAt = null;
    this._lastMs = null;
  }

  getScratchValue() {
    return { offsetX: 0, offsetY: 0, offsetZ: 0 };
  }

  onProgress(millisecond) {
    const fraction = this.getFraction(millisecond);
    const camera = this.element.entity.object;
    if (!camera || !this._targetObject) return;

    // Interpolate offset.
    const ox =
      this.initialValue.offsetX +
      fraction * (this.targetValue.offsetX - this.initialValue.offsetX);
    const oy =
      this.initialValue.offsetY +
      fraction * (this.targetValue.offsetY - this.initialValue.offsetY);
    const oz =
      this.initialValue.offsetZ +
      fraction * (this.targetValue.offsetZ - this.initialValue.offsetZ);

    // Desired camera position = target + offset.
    const desiredX = this._targetObject.position.x + ox;
    const desiredY = this._targetObject.position.y + oy;
    const desiredZ = this._targetObject.position.z + oz;

    // Desired lookAt point.
    const lookAtEntity = this._lookAtObject || this._targetObject;
    const desiredLookX = lookAtEntity.position.x;
    const desiredLookY = lookAtEntity.position.y;
    const desiredLookZ = lookAtEntity.position.z;

    // dt for seek detection.
    // Reset _lastMs when the Effect re-activates after a replay/seek-backward
    // so the magnetic chase starts fresh instead of snapping.
    if (this._lastMs !== null && millisecond < this._lastMs - 50) {
      this._lastMs = null;
      this._currentLookAt = null;
    }
    const dt =
      this._lastMs !== null ? (millisecond - this._lastMs) / 1000 : 1 / 60;
    this._lastMs = millisecond;

    const isSeek = dt < 0 || dt > SEEK_THRESHOLD;

    // Initialize lookAt tracker on first frame.
    if (!this._currentLookAt) {
      // Start from wherever the camera is currently looking.
      // Extract from camera's current world direction.
      const dir = new Vector3();
      camera.getWorldDirection(dir);
      const dist = camera.position.distanceTo(lookAtEntity.position) || 50;
      this._currentLookAt = {
        x: camera.position.x + dir.x * dist,
        y: camera.position.y + dir.y * dist,
        z: camera.position.z + dir.z * dist,
      };
    }

    if (isSeek) {
      // SNAP both position and lookAt.
      camera.position.x = desiredX;
      camera.position.y = desiredY;
      camera.position.z = desiredZ;
      this._currentLookAt.x = desiredLookX;
      this._currentLookAt.y = desiredLookY;
      this._currentLookAt.z = desiredLookZ;
    } else {
      // POSITION chase.
      const errX = camera.position.x - desiredX;
      const errY = camera.position.y - desiredY;
      const errZ = camera.position.z - desiredZ;
      const errDist = Math.sqrt(errX * errX + errY * errY + errZ * errZ);

      if (errDist < this._followThreshold) {
        camera.position.x = desiredX;
        camera.position.y = desiredY;
        camera.position.z = desiredZ;
      } else {
        const decay = Math.exp(-dt / this._chaseTime);
        camera.position.x = desiredX + errX * decay;
        camera.position.y = desiredY + errY * decay;
        camera.position.z = desiredZ + errZ * decay;
      }

      // LOOKAT chase — same magnetic behavior.
      const lookErrX = this._currentLookAt.x - desiredLookX;
      const lookErrY = this._currentLookAt.y - desiredLookY;
      const lookErrZ = this._currentLookAt.z - desiredLookZ;
      const lookErrDist = Math.sqrt(
        lookErrX * lookErrX + lookErrY * lookErrY + lookErrZ * lookErrZ
      );

      if (lookErrDist < this._followThreshold) {
        this._currentLookAt.x = desiredLookX;
        this._currentLookAt.y = desiredLookY;
        this._currentLookAt.z = desiredLookZ;
      } else {
        const decay = Math.exp(-dt / this._chaseTime);
        this._currentLookAt.x = desiredLookX + lookErrX * decay;
        this._currentLookAt.y = desiredLookY + lookErrY * decay;
        this._currentLookAt.z = desiredLookZ + lookErrZ * decay;
      }
    }

    // Apply lookAt from the tracked (chased) point.
    if (this._lookAt) {
      _lookAtVec.set(
        this._currentLookAt.x,
        this._currentLookAt.y,
        this._currentLookAt.z
      );
      camera.lookAt(_lookAtVec);
    }
  }
}
