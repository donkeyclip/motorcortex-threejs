import MC from "@kissmybutton/motorcortex";

export default class Object3D extends MC.API.MonoIncident {
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
        lookAt: this.element.settings.lookAt
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
      (this.targetValue[prop] - this.initialValue[prop]) * fraction +
      this.initialValue[prop]);
  }

  onProgress(fraction /*, millisecond*/) {
    const element = this.element.entity.object;

    typeof this.targetValue.lookAt !== "undefined"
      ? element.lookAt(new THREE.Vector3(...this.targetValue.lookAt))
      : null;

    typeof this.targetValue.x !== "undefined"
      ? this.applyValue(element, "x", fraction)
      : null;

    typeof this.targetValue.y !== "undefined"
      ? this.applyValue(element, "y", fraction)
      : null;

    typeof this.targetValue.z !== "undefined"
      ? this.applyValue(element, "z", fraction)
      : null;

    if (this.attributeKey === "targetEntity") {
      element.lookAt(
        ...Object.values(
          this.context.getElements(this.targetValue)[0].object.position
        )
      );
      element.up.set(0, 0, 1);
    }
  }
}
