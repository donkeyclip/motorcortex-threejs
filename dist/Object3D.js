"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MC = require("@kissmybutton/motorcortex"); // const helper = new MC.Helper();


var Incident = MC.API.MonoIncident;

var Object3D =
/*#__PURE__*/
function (_Incident) {
  _inherits(Object3D, _Incident);

  function Object3D() {
    _classCallCheck(this, Object3D);

    return _possibleConstructorReturn(this, _getPrototypeOf(Object3D).apply(this, arguments));
  }

  _createClass(Object3D, [{
    key: "onGetContext",
    value: function onGetContext() {}
  }, {
    key: "getScratchValue",
    value: function getScratchValue() {
      if (!this.element.settings && !this.element.object) {
        return 0;
      }

      this.element.settings = this.element.settings || {};

      if (this.attributeKey === "rotation") {
        return {
          x: (this.element.settings.rotation || {}).x || this.element.object.rotation.x || 0,
          y: (this.element.settings.rotation || {}).y || this.element.object.rotation.y || 0,
          z: (this.element.settings.rotation || {}).z || this.element.object.rotation.z || 0,
          lookAt: this.element.settings.lookAt
        };
      } else {
        return this.element.settings[this.attributeKey] || this.element.object[this.attributeKey] || 0;
      }
    }
  }, {
    key: "onProgress",
    value: function onProgress(fraction
    /*, millisecond*/
    ) {
      typeof this.targetValue.lookAt !== "undefined" ? this.element.object.lookAt(_construct(THREE.Vector3, _toConsumableArray(this.targetValue.lookAt))) : null;
      typeof this.targetValue.x !== "undefined" ? this.element.object[this.attributeKey].x = (this.targetValue.x - this.initialValue.x) * fraction + this.initialValue.x : null;
      typeof this.targetValue.y !== "undefined" ? this.element.object[this.attributeKey].y = (this.targetValue.y - this.initialValue.y) * fraction + this.initialValue.y : null;
      typeof this.targetValue.z !== "undefined" ? this.element.object[this.attributeKey].z = (this.targetValue.z - this.initialValue.z) * fraction + this.initialValue.z : null;

      if (this.attributeKey === "targetEntity") {
        var _this$element$object;

        (_this$element$object = this.element.object).lookAt.apply(_this$element$object, _toConsumableArray(Object.values(this.context.getElements(this.targetValue)[0].object.position)));

        this.element.object.up.set(0, 0, 1);
      }

      for (var i in this.context.elements.renders) {
        this.context.getElements(this.context.elements.renders[i].renderer)[0].object.render(this.context.getElements(this.context.elements.renders[i].scene)[0].object, this.context.getElements(this.context.elements.renders[i].camera)[0].object);
      } // if (
      //   (((this.context.elements.controls[0] || {}).domElement || {}).style || {})
      //     .pointerEvents !== "none" &&
      //   this.context.elements.controls.length !== 0
      // ) {
      //   this.context.elements.controls[0].update();
      // }

    }
  }]);

  return Object3D;
}(Incident);

module.exports = Object3D;