const MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
const Incident = MC.API.MonoIncident;
// const prevTime = Date.now();
class MAE extends Incident {
  onInitialise() {
    this.loaded = false;
  }
  onGetContext() {
    if (this.context.loading.length > 0 || this.loaded) {
      return;
    }

    let { selector } = this.props;
    selector = selector.substring(1, selector.length);

    const {
      animationName,
      animationFrames,
      singleLoopDuration
    } = this.attrs.attrs;

    const mixerSelector = `#${selector}_${animationName}`;

    if (this.context.getElements(mixerSelector)[0]) {
      this.loaded = true;
      return;
    }

    //push the mixer in the onprogress
    this.context.pushMixer({
      id: `${selector}_${animationName}`,
      object: new THREE.AnimationMixer(this.element.object),
      clip: THREE.AnimationClip.CreateFromMorphTargetSequence(
        animationName,
        this.element.object.geometry.morphTargets,
        animationFrames
      )
    });

    const length = this.context.elements.mixers.length - 1;
    const mixer = this.context.elements.mixers[length].object;
    const clip = this.context.elements.mixers[length].clip;
    mixer
      .clipAction(clip)
      .setDuration(singleLoopDuration / 1000)
      .play();

    this.loaded = true;
  }

  getScratchValue() {
    const attr = this.attributeKey;
    this.element.animations = this.element.animations || {};
    const { animations } = this.element;
    animations[attr + "_previous"] = animations[attr + "_previous"] || 0;
    return animations[attr + "_previous"];
  }

  onProgress(progress /*,millisecond*/) {
    if (!this.loaded) {
      return this.onGetContext();
    }
    const key = this.attributeKey;
    const initialValue = this.initialValue;
    const animatedAttr = this.attrs.animatedAttrs[key];

    const time = Math.floor(animatedAttr * progress) + initialValue;
    const prevTime = this.element.animations[key + "_previous"];
    const delta = time - prevTime;

    this.element.animations[key + "_previous"] = time;
    const { selector } = this.props;
    const { animationName } = this.attrs.attrs;
    const mixerSelector = `${selector}_${animationName}`;
    const mixer = this.context.getElements(mixerSelector)[0].object;
    mixer.update(delta / 1000);

    for (const i in this.context.elements.renders) {
      const {
        renderer: rendererSelector,
        scene: sceneSelector,
        camera: cameraSelector
      } = this.context.elements.renders[i];

      this.context
        .getElements(rendererSelector)[0]
        .object.render(
          this.context.getElements(sceneSelector)[0].object,
          this.context.getElements(cameraSelector)[0].object
        );
    }
  }
}
module.exports = MAE;
