"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MC = require("@kissmybutton/motorcortex");

var Incident = MC.API.MonoIncident;

var MAE =
/*#__PURE__*/
function (_Incident) {
  _inherits(MAE, _Incident);

  function MAE() {
    _classCallCheck(this, MAE);

    return _possibleConstructorReturn(this, _getPrototypeOf(MAE).apply(this, arguments));
  }

  _createClass(MAE, [{
    key: "onInitialise",
    value: function onInitialise() {
      this.loaded = false;
    }
  }, {
    key: "onGetContext",
    value: function onGetContext() {
      if (this.context.loading.length > 0 || this.loaded[this.id]) {
        return;
      }

      var selector = this.props.selector;
      selector = selector.substring(1, selector.length);
      var _this$attrs$attrs = this.attrs.attrs,
          animationName = _this$attrs$attrs.animationName,
          animationFrames = _this$attrs$attrs.animationFrames,
          singleLoopDuration = _this$attrs$attrs.singleLoopDuration;
      var mixerSelector = "#".concat(selector, "_").concat(animationName);

      if (this.context.getElements(mixerSelector)[0]) {
        this.loaded = true;
        return;
      }

      this.element.animations = this.element.animations || {}; //push the mixer in the onprogress

      this.context.pushMixer({
        id: "".concat(selector, "_").concat(animationName),
        object: new THREE.AnimationMixer(this.element.object),
        clip: THREE.AnimationClip.CreateFromMorphTargetSequence(animationName, this.element.object.geometry.morphTargets, animationFrames)
      });
      var length = this.context.elements.mixers.length - 1;
      var mixer = this.context.elements.mixers[length].object;
      var clip = this.context.elements.mixers[length].clip;
      mixer.clipAction(clip).setDuration(singleLoopDuration / 1000).play();
      this.loaded = true;
    }
  }, {
    key: "getScratchValue",
    value: function getScratchValue() {
      this.element.animations = this.element.animations || {};
      var attr = this.attributeKey;
      var animations = this.element.animations;
      animations[attr + "_previous"] = animations[attr + "_previous"] || 0;
      return animations[attr + "_previous"];
    }
  }, {
    key: "onProgress",
    value: function onProgress(progress
    /*,millisecond*/
    ) {
      if (!this.loaded) {
        return this.onGetContext();
      }

      var key = this.attributeKey;
      var initialValue = this.initialValue;
      var animatedAttr = this.attrs.animatedAttrs[key];
      var time = Math.floor(animatedAttr * progress) + initialValue;
      var prevTime = this.element.animations[key + "_previous"] || 0;
      var delta = time - prevTime;
      this.element.animations[key + "_previous"] = time;
      var selector = this.props.selector;
      var animationName = this.attrs.attrs.animationName;
      var mixerSelector = "".concat(selector, "_").concat(animationName);
      var mixer = this.context.getElements(mixerSelector)[0].object;
      mixer.update(delta / 1000);

      for (var i in this.context.elements.renders) {
        var _this$context$element = this.context.elements.renders[i],
            rendererSelector = _this$context$element.renderer,
            sceneSelector = _this$context$element.scene,
            cameraSelector = _this$context$element.camera;
        this.context.getElements(rendererSelector)[0].object.render(this.context.getElements(sceneSelector)[0].object, this.context.getElements(cameraSelector)[0].object);
      }
    }
  }]);

  return MAE;
}(Incident);

module.exports = MAE;