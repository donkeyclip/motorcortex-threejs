import { Effect } from "@donkeyclip/motorcortex";

export default class AppearanceChange extends Effect {
  getScratchValue() {
    const obj = this.element.entity?.object;
    return obj ? obj.visible : false;
  }

  onProgress() {
    const obj = this.element.entity?.object;
    if (!obj) return;
    obj.visible = !!this.targetValue;
  }
}
