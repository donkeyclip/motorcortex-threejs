const MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
const TimedIncident = MC.TimedIncident;
// const prevTime = Date.now();
class MAE extends TimedIncident {
  // onInitialise(attrs, incidentProps) {}

  onGetContext() {
    if (this.animationInitialised) {
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
      return;
    }

    this.context.elements.mixers.push({
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
  }

  getScratchValue(mcid, attribute) {
    const attr = attribute;
    this.element.animations = this.element.animations || {};
    const { animations } = this.element;
    animations[attr + "_previous"] = animations[attr + "_previous"] || 0;
    return animations[attr + "_previous"];
  }

  onProgress(progress /*,millisecond*/) {
    for (const key in this.attrs.animatedAttrs) {
      const initialValue = this.getInitialValue(key);
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
}
module.exports = MAE;
