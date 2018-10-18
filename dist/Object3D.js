"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MC = require("@kissmybutton/motorcortex");

// const helper = new MC.Helper();
var TimedIncident = MC.TimedIncident;

var Object3D = function (_TimedIncident) {
  _inherits(Object3D, _TimedIncident);

  function Object3D() {
    _classCallCheck(this, Object3D);

    return _possibleConstructorReturn(this, (Object3D.__proto__ || Object.getPrototypeOf(Object3D)).apply(this, arguments));
  }

  _createClass(Object3D, [{
    key: "onGetContext",

    // onInitialise(attrs, incidentProps) {}

    value: function onGetContext() {}
  }, {
    key: "getScratchValue",
    value: function getScratchValue(mcid, attribute) {
      if (!this.element.settings && !this.element.object) {
        return 0;
      }
      this.element.settings = this.element.settings || {};
      if (attribute === "rotation") {
        return {
          x: (this.element.settings.rotation || {}).x || this.element.object.rotation.x || 0,
          y: (this.element.settings.rotation || {}).y || this.element.object.rotation.y || 0,
          z: (this.element.settings.rotation || {}).z || this.element.object.rotation.z || 0,
          lookAt: this.element.settings.lookAt
        };
      } else {
        return this.element.settings[attribute] || this.element.object[attribute] || 0;
      }
    }
  }, {
    key: "onProgress",
    value: function onProgress(progress /*, millisecond*/) {
      var selector = this.props.selector;
      for (var key in this.attrs.animatedAttrs) {
        if ((this.context.elements.controls[0] || {}).object === this.element.object && (((this.context.elements.controls[0] || {}).domElement || {}).style || {}).pointerEvents !== "none") {
          continue;
        }

        var initialValue = this.getInitialValue(key);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.context.getElements(selector)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var element = _step.value;

            if (key === "rotation") {
              var _element$object;

              var animatedAttr = this.attrs.animatedAttrs.rotation;
              if (!element.object) {
                continue;
              }

              typeof animatedAttr.lookAt !== "undefined" ? (_element$object = element.object).lookAt.apply(_element$object, _toConsumableArray(animatedAttr.lookAt)) : null;

              typeof animatedAttr.x !== "undefined" ? element.object.rotation.x = (animatedAttr.x - initialValue.x) * progress + initialValue.x : null;

              typeof animatedAttr.y !== "undefined" ? element.object.rotation.y = (animatedAttr.y - initialValue.y) * progress + initialValue.y : null;

              typeof animatedAttr.z !== "undefined" ? element.object.rotation.z = (animatedAttr.z - initialValue.z) * progress + initialValue.z : null;
              // element.object.lookAt(new THREE.Vector3(0, -50, 10))
            } else if (key === "position") {
              var _animatedAttr = this.attrs.animatedAttrs.position;
              if (!element.object) {
                continue;
              }
              typeof _animatedAttr.x !== "undefined" ? element.object.position.x = (_animatedAttr.x - initialValue.x) * progress + initialValue.x : null;

              typeof _animatedAttr.y !== "undefined" ? element.object.position.y = (_animatedAttr.y - initialValue.y) * progress + initialValue.y : null;

              typeof _animatedAttr.z !== "undefined" ? element.object.position.z = (_animatedAttr.z - initialValue.z) * progress + initialValue.z : null;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      for (var i in (this.context.elements || {}).renders) {
        this.context.getElements(this.context.elements.renders[i].renderer)[0].object.render(this.context.getElements(this.context.elements.renders[i].scene)[0].object, this.context.getElements(this.context.elements.renders[i].camera)[0].object);
      }
      if ((((this.context.elements.controls[0] || {}).domElement || {}).style || {}).pointerEvents !== "none" && typeof this.context.elements.controls[0] !== "undefined") {
        this.context.elements.controls[0].update();
      }
    }
  }]);

  return Object3D;
}(TimedIncident);

module.exports = Object3D;