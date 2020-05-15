import MC from "@kissmybutton/motorcortex";
import * as THREE from "three";

export default class MAE extends MC.API.MonoIncident {
  onGetContext() {
    this.hasLoaded = true;
    let { selector } = this.props;
    selector = selector.slice(2);

    const {
      animationIndex,
      animationName,
      animationFrames,
      singleLoopDuration
    } = this.attrs.attrs;

    this.element.entity.object.animations =
      this.element.entity.object.animations || {};

    const mixer = new THREE.AnimationMixer(this.element.entity.object);

    if (animationIndex) {
      mixer
        .clipAction(this.element.entity.object.animations[animationIndex])
        .setDuration(singleLoopDuration / 1000)
        .play();
      //push the mixer in the onprogress
      this.setCustomEntity(
        `${selector}_${animationIndex}`,
        {
          object: mixer
        },
        ["mixers"]
      );
    } else {
      const clip = THREE.AnimationClip.CreateFromMorphTargetSequence(
        animationName,
        this.element.entity.object.geometry.morphTargets,
        animationFrames
      );
      mixer
        .clipAction(clip)
        .setDuration(singleLoopDuration / 1000)
        .play();
      this.setCustomEntity(
        `${selector}_${animationName}`,
        {
          object: mixer,
          clip
        },
        ["mixers"]
      );
    }
  }

  getScratchValue() {
    this.element.entity.object.animations =
      this.element.entity.object.animations || {};
    const attr = this.attributeKey;
    const { animations } = this.element.entity.object;
    animations[attr + "_previous"] = animations[attr + "_previous"] || 0;
    return animations[attr + "_previous"];
  }

  onProgress(progress /*,millisecond*/) {
    const key = this.attributeKey;
    const initialValue = this.initialValue;
    const animatedAttr = this.attrs.animatedAttrs[key];

    const time = Math.floor(animatedAttr * progress) + initialValue;
    const prevTime =
      this.element.entity.object.animations[key + "_previous"] || 0;
    const delta = time - prevTime;

    this.element.entity.object.animations[key + "_previous"] = time;
    const { selector } = this.props;
    const { animationName } = this.attrs.attrs;
    const mixerSelector = `!${selector}_${animationName}`;
    const mixer = this.context.getElements(mixerSelector)[0].entity.object;
    mixer.update(delta / 1000);

    // for (const i in this.attrs.elements.renders) {
    //   const {
    //     renderer: rendererSelector,
    //     scene: sceneSelector,
    //     camera: cameraSelector
    //   } = this.context.elements.renders[i];

    //   this.context
    //     .getElements(rendererSelector)[0]
    //     .object.render(
    //       this.context.getElements(sceneSelector)[0].object,
    //       this.context.getElements(cameraSelector)[0].object
    //     );
    // }
  }
}
