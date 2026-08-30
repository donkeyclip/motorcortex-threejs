import { Effect } from "@donkeyclip/motorcortex";
import * as THREE from "three";

/**
 * LiveDistance Effect — draws a live dashed line between two moving entities
 * and optionally displays a static label sprite at the midpoint.
 *
 * attrs: {
 *   targetSelector:  string,  // first entity selector (e.g. "!#earth")
 *   targetSelector2: string,  // second entity selector (e.g. "!#mars")
 *   label:           string,  // optional text to display at midpoint
 *   color:           string,  // line/label color (default "#ffffff")
 *   opacity:         number,  // line opacity (default 0.7)
 *   dashSize:        number,  // dash length (default auto from distance)
 *   gapSize:         number,  // gap length (default auto from distance)
 * }
 *
 * animatedAttrs: {
 *   liveDistance: number       // progress 0→1 (used for MC timeline only)
 * }
 */
export default class LiveDistance extends Effect {
  onGetContext() {
    this._targetA = null;
    this._targetB = null;
    this._line = null;
    this._label = null;
    this._scene = null;

    const selA = this.attrs.targetSelector;
    const selB = this.attrs.targetSelector2;

    if (selA) {
      const els = this.context.getElements(selA);
      if (els && els.length > 0) {
        this._targetA = els[0].entity.object;
      }
    }
    if (selB) {
      const els = this.context.getElements(selB);
      if (els && els.length > 0) {
        this._targetB = els[0].entity.object;
      }
    }

    // Find the scene to add our line + label to
    if (this._targetA) {
      this._scene = this._findScene(this._targetA);
    } else if (this._targetB) {
      this._scene = this._findScene(this._targetB);
    }

    this._color = this.attrs.color || "#ffffff";
    this._opacity = this.attrs.opacity != null ? this.attrs.opacity : 0.7;

    this._createLine();
    this._createLabel();
  }

  _findScene(obj) {
    let current = obj;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  _createLine() {
    if (!this._scene) return;

    const geometry = new THREE.BufferGeometry();
    // eslint-disable-next-line no-undef
    const positions = new Float32Array(6); // 2 points × 3 components
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineDashedMaterial({
      color: this._color,
      opacity: this._opacity,
      transparent: true,
      dashSize: this.attrs.dashSize || 1,
      gapSize: this.attrs.gapSize || 0.5,
      depthTest: false,
    });

    this._line = new THREE.Line(geometry, material);
    this._line.renderOrder = 999;
    this._line.visible = false;
    this._scene.add(this._line);
  }

  _createLabel() {
    const labelText = this.attrs.label;
    if (!labelText || !this._scene) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const fontSize = 36;
    const font = `${fontSize}px monospace`;
    ctx.font = font;
    const textWidth = ctx.measureText(labelText).width;
    canvas.width = Math.ceil(textWidth) + 24;
    canvas.height = fontSize + 16;

    // Redraw with final dimensions
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Semi-transparent background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    const r = 6;
    const w = canvas.width;
    const h = canvas.height;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.fillStyle = this._color;
    ctx.fillText(labelText, w / 2, h / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    this._label = new THREE.Sprite(spriteMat);
    this._labelAspect = canvas.width / canvas.height;
    // Scale is set dynamically in onProgress based on entity distance
    this._label.scale.set(1, 1, 1);
    this._label.renderOrder = 1000;
    this._label.visible = false;
    this._scene.add(this._label);
  }

  getScratchValue() {
    return 0;
  }

  onProgress(millisecond) {
    if (!this._targetA || !this._targetB) return;

    const fraction = this.getFraction(millisecond);

    // Hide everything when the effect finishes or hasn't started.
    if (fraction >= 1 || fraction <= 0) {
      if (this._line) this._line.visible = false;
      if (this._label) this._label.visible = false;
      return;
    }

    const posA = this._targetA.position;
    const posB = this._targetB.position;

    // Update line geometry
    if (this._line) {
      const positions = this._line.geometry.attributes.position.array;
      positions[0] = posA.x;
      positions[1] = posA.y;
      positions[2] = posA.z;
      positions[3] = posB.x;
      positions[4] = posB.y;
      positions[5] = posB.z;
      this._line.geometry.attributes.position.needsUpdate = true;

      // Recompute dashes based on current distance
      this._line.computeLineDistances();

      // Auto-size dashes from distance if not explicitly set
      if (!this.attrs.dashSize) {
        const dist = posA.distanceTo(posB);
        this._line.material.dashSize = Math.max(dist * 0.02, 0.3);
        this._line.material.gapSize = Math.max(dist * 0.01, 0.15);
      }

      this._line.visible = true;
    }

    // Update label position at midpoint, slightly above
    if (this._label) {
      const dist = posA.distanceTo(posB);
      const spriteScale = Math.max(dist * 0.03, 0.5);
      this._label.scale.set(spriteScale * this._labelAspect, spriteScale, 1);
      this._label.position.set(
        (posA.x + posB.x) / 2,
        Math.max(dist * 0.05, 0.5),
        (posA.z + posB.z) / 2
      );
      this._label.visible = true;
    }
  }

  onRemove() {
    if (this._line && this._scene) {
      this._scene.remove(this._line);
      this._line.geometry.dispose();
      this._line.material.dispose();
      this._line = null;
    }
    if (this._label && this._scene) {
      this._scene.remove(this._label);
      this._label.material.map.dispose();
      this._label.material.dispose();
      this._label = null;
    }
  }
}
