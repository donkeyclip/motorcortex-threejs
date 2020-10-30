import MC from "@kissmybutton/motorcortex";
import { AnimationMixer } from "three";

export default class MAE extends MC.API.MonoIncident {
  onGetContext() {
    this.mixer = new AnimationMixer(this.element.entity.object);
    console.log(this.element.entity.object.animations);
    this.mixer
      .clipAction(
        this.element.entity.object.animations.filter(
          animation => animation.name == this.attrs.attrs.animationName
        )[0]
      )
      .setDuration(this.attrs.attrs.singleLoopDuration / 1000)
      .play();
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
    this.mixer.update(delta / 1000);
  }
}
