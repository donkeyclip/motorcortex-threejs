import { Effect } from "@kissmybutton/motorcortex";
import * as THREE from "three";

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

  onProgress(fraction /*, millisecond*/) {
    const element = this.element.entity.object;

    if (typeof this.targetValue.lookAt !== "undefined") {
      const target = new THREE.Vector3(...this.targetValue.lookAt);
      element.children[0].lookAt(target);
    }

    if (this.attributeKey == "rotationSetY")
      element.rotation.y = this.targetValue;

    if (this.attributeKey == "rotationSetY")
      element.rotation.y = this.targetValue;

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

    // if (typeof this.targetValue.y === "string") {
    //   const origin = new THREE.Vector3(
    //     element.position.x,
    //     element.position.y + 10,
    //     element.position.z
    //   );
    //   const raycaster = new THREE.Raycaster(
    //     origin,
    //     new THREE.Vector3(0, -1, 0)
    //   );
    //   const intersects = raycaster.intersectObjects(
    //     this.context.getElements(this.targetValue.y)[0].entity.object.children,
    //     true
    //   );
    //   element.position.y = ((intersects[0] || {}).point || {}).y;
    // }

    if (this.attributeKey === "targetEntity") {
      element.lookAt(
        this.context.getElements(this.targetValue)[0].entity.object.position
      );
    }
  }
}
