const MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
const Incident = MC.API.MonoIncident;

class Object3D extends Incident {
  onGetContext() {}

  getScratchValue() {
    if (!this.element.settings && !this.element.object) {
      return 0;
    }
    this.element.settings = this.element.settings || {};
    if (this.attributeKey === "rotation") {
      return {
        x:
          (this.element.settings.rotation || {}).x ||
          this.element.object.rotation.x ||
          0,
        y:
          (this.element.settings.rotation || {}).y ||
          this.element.object.rotation.y ||
          0,
        z:
          (this.element.settings.rotation || {}).z ||
          this.element.object.rotation.z ||
          0,
        lookAt: this.element.settings.lookAt
      };
    } else {
      return (
        this.element.settings[this.attributeKey] ||
        this.element.object[this.attributeKey] ||
        0
      );
    }
  }

  onProgress(fraction /*, millisecond*/) {
    typeof this.targetValue.lookAt !== "undefined"
      ? this.element.object.lookAt(
          new THREE.Vector3(...this.targetValue.lookAt)
        )
      : null;
    typeof this.targetValue.x !== "undefined"
      ? (this.element.object[this.attributeKey].x =
          (this.targetValue.x - this.initialValue.x) * fraction +
          this.initialValue.x)
      : null;
    typeof this.targetValue.y !== "undefined"
      ? (this.element.object[this.attributeKey].y =
          (this.targetValue.y - this.initialValue.y) * fraction +
          this.initialValue.y)
      : null;
    typeof this.targetValue.z !== "undefined"
      ? (this.element.object[this.attributeKey].z =
          (this.targetValue.z - this.initialValue.z) * fraction +
          this.initialValue.z)
      : null;

    if (this.attributeKey === "targetEntity") {
      this.element.object.lookAt(
        ...Object.values(
          this.context.getElements(this.targetValue)[0].object.position
        )
      );
      this.element.object.up.set(0, 0, 1);
    }
    for (const i in this.context.elements.renders) {
      this.context
        .getElements(this.context.elements.renders[i].renderer)[0]
        .object.render(
          this.context.getElements(this.context.elements.renders[i].scene)[0]
            .object,
          this.context.getElements(this.context.elements.renders[i].camera)[0]
            .object
        );
    }

    // if (
    //   (((this.context.elements.controls[0] || {}).domElement || {}).style || {})
    //     .pointerEvents !== "none" &&
    //   this.context.elements.controls.length !== 0
    // ) {
    //   this.context.elements.controls[0].update();
    // }
  }
}
module.exports = Object3D;
