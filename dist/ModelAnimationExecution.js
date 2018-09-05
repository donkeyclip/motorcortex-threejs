"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
var TimedIncident = MC.TimedIncident;
// const prevTime = Date.now();

var MAE = function (_TimedIncident) {
  _inherits(MAE, _TimedIncident);

  function MAE() {
    _classCallCheck(this, MAE);

    return _possibleConstructorReturn(this, (MAE.__proto__ || Object.getPrototypeOf(MAE)).apply(this, arguments));
  }

  _createClass(MAE, [{
    key: "onGetContext",

    // onInitialise(attrs, incidentProps) {}

    value: function onGetContext() {
      if (this.animationInitialised) {
        return;
      }

      var selector = this.props.selector;

      selector = selector.substring(1, selector.length);

      var _attrs$attrs = this.attrs.attrs,
          animationName = _attrs$attrs.animationName,
          animationFrames = _attrs$attrs.animationFrames,
          singleLoopDuration = _attrs$attrs.singleLoopDuration;


      var mixerSelector = "#" + selector + "_" + animationName;

      if (this.context.getElements(mixerSelector)[0]) {
        return;
      }

      this.context.elements.mixers.push({
        id: selector + "_" + animationName,
        object: new THREE.AnimationMixer(this.element.object),
        clip: THREE.AnimationClip.CreateFromMorphTargetSequence(animationName, this.element.object.geometry.morphTargets, animationFrames)
      });

      var length = this.context.elements.mixers.length - 1;
      var mixer = this.context.elements.mixers[length].object;
      var clip = this.context.elements.mixers[length].clip;
      mixer.clipAction(clip).setDuration(singleLoopDuration / 1000).play();
    }
  }, {
    key: "getScratchValue",
    value: function getScratchValue(mcid, attribute) {
      var attr = attribute;
      this.element.animations = this.element.animations || {};
      var animations = this.element.animations;

      animations[attr + "_previous"] = animations[attr + "_previous"] || 0;
      return animations[attr + "_previous"];
    }
  }, {
    key: "onProgress",
    value: function onProgress(progress /*,millisecond*/) {
      for (var key in this.attrs.animatedAttrs) {
        var initialValue = this.getInitialValue(key);
        var animatedAttr = this.attrs.animatedAttrs[key];

        var time = Math.floor(animatedAttr * progress) + initialValue;
        var prevTime = this.element.animations[key + "_previous"];
        var delta = time - prevTime;

        this.element.animations[key + "_previous"] = time;
        var selector = this.props.selector;
        var animationName = this.attrs.attrs.animationName;

        var mixerSelector = selector + "_" + animationName;
        var mixer = this.context.getElements(mixerSelector)[0].object;
        mixer.update(delta / 1000);

        for (var i in this.context.elements.renders) {
          var _context$elements$ren = this.context.elements.renders[i],
              rendererSelector = _context$elements$ren.renderer,
              sceneSelector = _context$elements$ren.scene,
              cameraSelector = _context$elements$ren.camera;


          this.context.getElements(rendererSelector)[0].object.render(this.context.getElements(sceneSelector)[0].object, this.context.getElements(cameraSelector)[0].object);
        }
      }
    }
  }]);

  return MAE;
}(TimedIncident);

module.exports = MAE;