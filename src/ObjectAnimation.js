import { Effect } from "@donkeyclip/motorcortex";
import { Raycaster, Vector3, Object3D } from "three";
const matrixObject = new Object3D();

export default class ObjectAnimation extends Effect {
  getScratchValue() {
    const element = this.element.entity.object;
    if (!this.element.settings && !element) {
      return 0;
    }
    this.element.settings = this.element.settings || {};
    if (this.attributeKey === "rotation") {
      return {
        x: (this.element.settings.rotation || {}).x || element.rotation.x || 0,
        y: (this.element.settings.rotation || {}).y || element.rotation.y || 0,
        z: (this.element.settings.rotation || {}).z || element.rotation.z || 0,
        lookAt: this.element.settings.lookAt,
      };
    } else if (this.attributeKey === "instance") {
      return this.element.entity.settings.instance;
    } else {
      return (
        this.element.settings[this.attributeKey] ||
        element[this.attributeKey] ||
        0
      );
    }
  }
  applyValue(element, prop, fraction) {
    return (element[this.attributeKey][prop] =
      Number(
        ((this.targetValue[prop] - this.initialValue[prop]) * fraction).toFixed(
          5
        )
      ) + this.initialValue[prop]);
  }

  onProgress(fraction) {
    const element = this.element.entity.object;

    if (typeof this.targetValue.lookAt !== "undefined") {
      const target = new Vector3(...this.targetValue.lookAt);
      element.children[0].lookAt(target);
    }

    if (this.attributeKey == "rotationSetY")
      element.rotation.y = this.targetValue;

    if (typeof this.targetValue.x !== "undefined")
      this.applyValue(element, "x", fraction);

    if (
      typeof this.targetValue.y !== "undefined" &&
      typeof this.targetValue.y !== "string"
    )
      this.applyValue(element, "y", fraction);

    if (typeof this.targetValue.z !== "undefined")
      this.applyValue(element, "z", fraction);

    if (typeof this.targetValue.y === "string") {
      const origin = new Vector3(
        element.position.x,
        element.position.y + 10,
        element.position.z
      );
      const raycaster = new Raycaster(origin, new Vector3(0, -1, 0));
      const intersects = raycaster.intersectObjects(
        this.context.getElements(this.targetValue.y)[0].entity.object.children,
        true
      );
      element.position.y = ((intersects[0] || {}).point || {}).y;
    }

    if (this.attributeKey === "targetEntity") {
      element.lookAt(
        this.context.getElements(this.targetValue)[0].entity.object.position
      );
    }

    if (this.attributeKey === "followEntity") {
      const { offsetX, offsetY, offsetZ, entity } =
        this.attrs.animatedAttrs.followEntity;
      let { x, y, z } =
        this.context.getElements(entity)[0].entity.object.position;
      if (offsetX) x += offsetX;
      if (offsetY) y += offsetY;
      if (offsetZ) z += offsetZ;
      element.position.x = x;
      element.position.y = y;
      element.position.z = z;
    }
    // instances
    if (this.attributeKey === "instance") {
      for (const i in this.targetValue) {
        if (this.targetValue[i][1]) {
          matrixObject.position.set(
            Number(
              (
                (this.targetValue[i][1][0] - this.initialValue[i][1][0]) *
                fraction
              ).toFixed(4)
            ) + this.initialValue[i][1][0],
            Number(
              (
                (this.targetValue[i][1][1] - this.initialValue[i][1][1]) *
                fraction
              ).toFixed(4)
            ) + this.initialValue[i][1][1],
            Number(
              (
                (this.targetValue[i][1][2] - this.initialValue[i][1][2]) *
                fraction
              ).toFixed(4)
            ) + this.initialValue[i][1][2]
          );
        }
        if (this.targetValue[i][2]) {
          matrixObject.rotation.set(
            Number(
              (
                (this.targetValue[i][2][0] - this.initialValue[i][2][0]) *
                fraction
              ).toFixed(4)
            ) + this.initialValue[i][2][0],
            Number(
              (
                (this.targetValue[i][2][1] - this.initialValue[i][2][1]) *
                fraction
              ).toFixed(4)
            ) + this.initialValue[i][2][1],
            Number(
              (
                (this.targetValue[i][2][2] - this.initialValue[i][2][2]) *
                fraction
              ).toFixed(4)
            ) + this.initialValue[i][2][2]
          );
        }
        matrixObject.updateMatrix();
        element.setMatrixAt(this.targetValue[i][0], matrixObject.matrix);
        element.instanceMatrix.needsUpdate = true;
      }
    }
  }
}
