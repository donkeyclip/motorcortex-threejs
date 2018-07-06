const MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;

class Object3D extends TimedIncident {
  // onInitialise(attrs, incidentProps) {}

  onGetContext() {}

  getScratchValue(mcid, attribute) {
    if (typeof this.element.settings[attribute] !== "undefined") {
      return this.element.settings[attribute];
    } else if (typeof this.element.object[attribute] !== "undefined") {
      return this.element.object[attribute];
    }
    return 0;
  }

  onProgress(progress /*, millisecond*/) {
    const selector = this.props.selector;

    for (const key in this.attrs.animatedAttrs) {
      const initialValue = this.getInitialValue(key);

      if (key === "rotation") {
        const animatedAttr = this.attrs.animatedAttrs.rotation;

        for (const element of this.context.getElements(selector)) {
          initialValue.x = initialValue.x || element.object.rotation.x;
          initialValue.y = initialValue.y || element.object.rotation.y;
          initialValue.z = initialValue.z || element.object.rotation.z;
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
        }
      } else if (key === "position") {
        const animatedAttr = this.attrs.animatedAttrs.position;

        // console.log("element",this.element);
        // console.log("animated",animatedAttr);
        // console.log("initial",initialValue)
        // console.log(progress)

        for (const element of this.context.getElements(selector)) {
          initialValue.x = initialValue.x || element.object.position.x;
          initialValue.y = initialValue.y || element.object.position.y;
          initialValue.z = initialValue.z || element.object.position.z;
          // console.log(typeof animatedAttr.x !== 'undefined',typeof animatedAttr.y !== 'undefined',typeof animatedAttr.z !== 'undefined')
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

    if ((this.attrs.attrs || {}).keepLookAt) {
      for (const element of this.context.getElements(selector)) {
        element.object.lookAt(...this.attrs.attrs.keepLookAt);
      }
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
  }
}
module.exports = Object3D;
