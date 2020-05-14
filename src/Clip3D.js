import MC from "@kissmybutton/motorcortex";
import ThreejsContextHandler from "./ThreejsContextHandler";
const ExtendableClip = MC.API.ExtendableClip;
export default class Clip3D extends ExtendableClip {
  /**
   * @param {object} props - an object that should contain all of the
   * following keys:
   * - html (the html template to render)
   * - css (the css template of the isolated tree)
   * - initParams (optional / the initialisation parameters that will be
   * passed both on the css and the html templates in order to render)
   * - host (an Element object that will host the isolated tree)
   * - containerParams (an object that holds parameters to affect the
   * container of the isolated tree, e.g. width, height etc)
   */

  constructor(attrs = {}, props = {}) {
    super(attrs, props);
    const initialAttrs = JSON.parse(JSON.stringify(this.attrs));
    const initialProps = JSON.parse(JSON.stringify(this.props));
    this.initialAttrs = initialAttrs;
    this.initialProps = initialProps;
    const checks = this.runChecks(this.attrs, this.props);

    if (!checks) {
      return false;
    }
    //initialize renders
    const contextHanlder = new ThreejsContextHandler(this.attrs, this.props, {
      _thisClip: this
    });

    this.ownContext = contextHanlder.context;
    this.isTheClip = true;

    this.init(this.attrs, this.props);
    this.ownContext.window.addEventListener("resize", () => {
      for (const i in this.ownContext.elements.cameras) {
        this.ownContext.elements.cameras[i].object.aspect =
          this.context.rootElement.offsetWidth /
          this.context.rootElement.offsetHeight;

        this.ownContext.elements.cameras[i].object.updateProjectionMatrix();
      }
      for (const i in this.ownContext.elements.renderers) {
        this.ownContext.elements.renderers[i].object.setSize(
          this.context.rootElement.offsetWidth,
          this.context.rootElement.offsetHeight
        );
      }
      // render the scene
      for (const i in this.attrs.renders) {
        this.attrs.renders[i].scene =
          this.attrs.renders[i].scene ||
          "#" + this.ownContext.elements.scenes[0].id;

        this.attrs.renders[i].camera =
          this.attrs.renders[i].camera ||
          "#" + this.ownContext.elements.cameras[0].id;

        this.attrs.renders[i].renderer =
          this.attrs.renders[i].renderer ||
          "#" + this.ownContext.elements.renderers[0].id;
        this.ownContext
          .getElements(this.attrs.renders[i].renderer)[0]
          .object.render(
            this.ownContext.getElements(this.attrs.renders[i].scene)[0].object,
            this.ownContext.getElements(this.attrs.renders[i].camera)[0].object
          );
      }
    });
  }

  async init() {
    this.render();
  }
  exportConstructionArguments() {
    return {
      attrs: JSON.parse(JSON.stringify(this.initialAttrs)),
      props: JSON.parse(
        JSON.stringify({ ...this.initialProps, host: undefined })
      )
    };
  }
  render() {
    for (const i in this.ownContext.elements.renderers) {
      this.ownContext.rootElement.appendChild(
        this.ownContext.elements.renderers[i].object.domElement
      );
      this.ownContext.elements.renderers[i].object.domElement.style.zIndex = i;
      this.ownContext.elements.renderers[i].object.domElement.style.top = 0;
      this.ownContext.elements.renderers[i].object.domElement.style.position =
        "absolute";
    }

    for (const i in this.attrs.renders) {
      this.attrs.renders[i].scene =
        this.attrs.renders[i].scene ||
        "#" + this.ownContext.elements.scenes[0].id;

      this.attrs.renders[i].camera =
        this.attrs.renders[i].camera ||
        "#" + this.ownContext.elements.cameras[0].id;
      this.attrs.renders[i].renderer =
        this.attrs.renders[i].renderer ||
        "#" + this.ownContext.elements.renderers[0].id;
      this.ownContext
        .getElements(this.attrs.renders[i].renderer)[0]
        .object.render(
          this.ownContext.getElements(this.attrs.renders[i].scene)[0].object,
          this.ownContext.getElements(this.attrs.renders[i].camera)[0].object
        );
    }
  }

  runChecks(attrs, props) {
    if (typeof props !== "object") {
      console.error(`Self Contained Incident expects an object on its \
                second argument on the constructor. ${typeof props} passed`);
      return false;
    }

    if (!props.hasOwnProperty("id")) {
      console.error(`Self Contained Incident expects the 'id' key on its \
                constructor properties which is missing`);
      return false;
    }

    if (!props.hasOwnProperty("host")) {
      console.error(`Self Contained Incident expects the 'host' key on its\
             constructor properties which is missing`);
      return false;
    }

    if (!props.hasOwnProperty("containerParams")) {
      console.error(`Self Contained Incident expects the 'containerParams'\
             key on its constructor properties which is missing`);
      return false;
    }

    if (
      (attrs.scenes || {}).constructor !== Object.prototype.constructor &&
      !(attrs.scenes instanceof Array)
    ) {
      console.error(`Self Contained Incident expects the 'scenes' key on\
             its constructor attributes to be an Array or an Object`);
      return false;
    }
    if (
      (attrs.lights || {}).constructor !== Object.prototype.constructor &&
      !(attrs.lights instanceof Array)
    ) {
      console.error(`Self Contained Incident expects the 'lights' key on\
             its constructor attributes to be an Array or an Object`);
      return false;
    }

    if (
      (attrs.cameras || {}).constructor !== Object.prototype.constructor &&
      !(attrs.cameras instanceof Array)
    ) {
      console.error(`Self Contained Incident expects the 'cameras' key on\
             its constructor attributes to be an Array or an Object`);
      return false;
    }

    if (
      (attrs.renderers || {}).constructor !== Object.prototype.constructor &&
      !(attrs.renderers instanceof Array)
    ) {
      console.error(`Self Contained Incident expects the 'renderers' key on\
             its constructor attributes to be an Array or an Object`);
      return false;
    }

    if (
      (attrs.renders || {}).constructor !== Object.prototype.constructor &&
      !(attrs.renders instanceof Array)
    ) {
      console.error(`Self Contained Incident expects the 'renders' key on\
             its constructor attributes to be an Array or an Object`);
      return false;
    }
    return true;
  }

  lastWish() {
    this.ownContext.unmount();
  }
}
