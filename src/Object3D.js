const MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;

class Object3D extends TimedIncident {
  // onInitialise(attrs, incidentProps) {}

  onGetContext() {}

  getScratchValue(mcid, attribute) {
    if (!this.element.settings && !this.element.object) {
      return 0;
    }
    this.element.settings = this.element.settings || {};
    if (attribute === "rotation") {
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
        this.element.settings[attribute] || this.element.object[attribute] || 0
      );
    }
  }

  onProgress(progress /*, millisecond*/) {
    const selector = this.props.selector;
    for (const key in this.attrs.animatedAttrs) {
    if (
      (this.context.elements.controls[0] || {}).object === this.element.object &&
      (((this.context.elements.controls[0] || {}).domElement || {}).style || {} ).pointerEvents !== "none"
    ) {
      continue;
    }

      const initialValue = this.getInitialValue(key);
      for (const element of this.context.getElements(selector)) {
        if (key === "rotation") {
          const animatedAttr = this.attrs.animatedAttrs.rotation;
        
          if (!element.object) {
            continue;
          }

          typeof animatedAttr.lookAt !== "undefined"
            ? element.object.lookAt(...animatedAttr.lookAt)
            : null;

          typeof animatedAttr.x !== "undefined"
            ? (element.object.rotation.x =
                (animatedAttr.x - initialValue.x) * progress + initialValue.x)
            : null;

          typeof animatedAttr.y !== "undefined"
            ? (element.object.rotation.y =
                (animatedAttr.y - initialValue.y) * progress + initialValue.y)
            : null;

          typeof animatedAttr.z !== "undefined"
            ? (element.object.rotation.z =
                (animatedAttr.z - initialValue.z) * progress + initialValue.z)
            : null;
      } else if (key === "position") {
        const animatedAttr = this.attrs.animatedAttrs.position;
          if (!element.object) {
            continue;
          }
          typeof animatedAttr.x !== "undefined"
            ? (element.object.position.x =
                (animatedAttr.x - initialValue.x) * progress + initialValue.x)
            : null;

          typeof animatedAttr.y !== "undefined"
            ? (element.object.position.y =
                (animatedAttr.y - initialValue.y) * progress + initialValue.y)
            : null;

          typeof animatedAttr.z !== "undefined"
            ? (element.object.position.z =
                (animatedAttr.z - initialValue.z) * progress + initialValue.z)
            : null;
        }
      }
    }


    for (const i in (this.context.elements || {}).renders) {
      this.context
        .getElements(this.context.elements.renders[i].renderer)[0]
        .object.render(
          this.context.getElements(this.context.elements.renders[i].scene)[0]
            .object,
          this.context.getElements(this.context.elements.renders[i].camera)[0]
            .object
        );
    }
    if (this.context.elements.controls[0]) {
      this.context.elements.controls[0].update();
    }
    // this.context.elements.controls[0].update();
  }
}
module.exports = Object3D;
