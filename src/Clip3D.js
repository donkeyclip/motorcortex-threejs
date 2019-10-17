const MC = require("@kissmybutton/motorcortex");
global.THREE = require("three");
require("three/examples/js/renderers/CSS3DRenderer");
require("three/examples/js/controls/OrbitControls");

// const Helper = MC.Helper;
const ExtendableClip = MC.API.ExtendableClip;
// const conf = MC.conf;
const ThreejsContextHandler = require("./ThreejsContextHandler");
class Clip3D extends ExtendableClip {
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

    const checks = this.runChecks(attrs, props);

    if (!checks) {
      return false;
    }

    const contextHanlder = new ThreejsContextHandler(
      this.attrs,
      this.props,
      this
    );
    this.ownContext = { ...contextHanlder.context };
    this.isTheClip = true;

    this.attrs = JSON.parse(JSON.stringify(attrs));

    this.init(attrs, props);
    this.ownContext.window.addEventListener("resize", () => {
      for (const i in this.ownContext.elements.cameras) {
        this.ownContext.elements.cameras[i].object.aspect =
          this.props.host.offsetWidth / this.props.host.offsetHeight;

        this.ownContext.elements.cameras[i].object.updateProjectionMatrix();
      }
      for (const i in this.ownContext.elements.renderers) {
        this.ownContext.elements.renderers[i].object.setSize(
          this.props.host.offsetWidth,
          this.props.host.offsetHeight
        );
      }
      // render the scene
      for (const i in this.attrs.renders) {
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

    if (!attrs.hasOwnProperty("scenes")) {
      console.error(`Self Contained Incident expects the 'scenes' key on\
             its constructor attributes which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("lights")) {
      console.error(`Self Contained Incident expects the 'lights' key on \
                its constructor attributes which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("cameras")) {
      console.error(`Self Contained Incident expects the 'cameras' key on \
                its constructor attributes which is missing`);
      return false;
    }

    if (!attrs.hasOwnProperty("renderers")) {
      console.error(`Self Contained Incident expects the 'renderers' key \
                on its constructor attributes which is missing`);
      return false;
    }
    return true;
  }

  onProgress(fraction, milliseconds, contextId, forceReset = false) {
    if (this.context.loading.length > 0) {
      this.setBlock();
    } else {
      super.onProgress(fraction, milliseconds, contextId, forceReset);
    }
  }

  lastWish() {
    this.ownContext.unmount();
  }
}
module.exports = Clip3D;
