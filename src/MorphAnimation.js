import { Effect } from "@kissmybutton/motorcortex";
import { AnimationMixer } from "three";

export default class MorphAnimation extends Effect {
  onGetContext({ unblock } = {}) {
    if (this.element.entity.object.animations) {
      this.mixer = new AnimationMixer(this.element.entity.object);
      const theAnimation = this.element.entity.object.animations.filter(
        (animation) => animation.name == this.attrs.attrs.animationName
      )[0];

      this.mixer
        .clipAction(theAnimation)
        .setDuration(this.attrs.attrs.singleLoopDuration / 1000)
        .play();
      if (unblock) {
        this.unblock();
      }
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
    if (!this.mixer) {
      this.setBlock();
      this.onGetContext({ unblock: true });
      return;
    }
    const key = this.attributeKey;
    const initialValue = this.initialValue;
    const animatedAttr = this.attrs.animatedAttrs[key];
    const time = Math.floor(animatedAttr * progress) + initialValue;
    const prevTime =
      this.element.entity.object.animations[key + "_previous"] || 0;
    const delta = time - prevTime;
    this.element.entity.object.animations[key + "_previous"] = time;
    if (progress === 0) {
      this.mixer.setTime(0);
    } else if (progress === 1) {
      this.mixer.setTime((animatedAttr - 1) / 1000);
    } else {
      this.mixer.update(delta / 1000);
    }
  }
}
