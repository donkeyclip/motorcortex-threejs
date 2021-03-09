import MC from "@kissmybutton/motorcortex";
import { AnimationMixer } from "three";

export default class MAE extends MC.Effect {
  onGetContext() {
    this.mixer = new AnimationMixer(this.element.entity.object);
    if (this.element.entity.object.animations) {
      console.log("in context - has animations");
      const theAnimation = this.element.entity.object.animations.filter(
        (animation) => animation.name == this.attrs.attrs.animationName
      )[0];

      this.mixer
        .clipAction(theAnimation)
        .setDuration(this.attrs.attrs.singleLoopDuration / 1000)
        .play();

      window.mixer = this.mixer;
    }
  }

  getScratchValue() {
    console.log("scratch");

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
    this.mixer.update(delta / 1000);
  }
}
