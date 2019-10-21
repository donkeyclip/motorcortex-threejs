"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MC = require("@kissmybutton/motorcortex");

global.THREE = require("three");

require("three/examples/js/renderers/CSS3DRenderer");

require("three/examples/js/controls/OrbitControls"); // const Helper = MC.Helper;


var ExtendableClip = MC.API.ExtendableClip; // const conf = MC.conf;

var ThreejsContextHandler = require("./ThreejsContextHandler");

var Clip3D =
/*#__PURE__*/
function (_ExtendableClip) {
  _inherits(Clip3D, _ExtendableClip);

  /**
   * @param {object} props - an object that should contain all of the
   * following keys:
   * - html (the html template to render)
   * - css (the css template of the isolated tree)
   * - initParams (optional / the initialisation parameters that will be
   * passed both on the css and the html templates in order to render)
   * - host (an Element object that will host the isolated tree)
   * - containerParams (an object that holds parameters to affect the
   * container of the isolated tree, e.g. width, height etc)
   */
  function Clip3D() {
    var _this;

    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Clip3D);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Clip3D).call(this, attrs, props));
    var initialAttrs = JSON.parse(JSON.stringify(_this.attrs));
    var initialProps = JSON.parse(JSON.stringify(_this.props));
    _this.initialAttrs = initialAttrs;
    _this.initialProps = initialProps;

    var checks = _this.runChecks(_this.attrs, _this.props);

    if (!checks) {
      return _possibleConstructorReturn(_this, false);
    }

    var contextHanlder = new ThreejsContextHandler(_this.attrs, _this.props, _assertThisInitialized(_this));
    _this.ownContext = _objectSpread({}, contextHanlder.context);
    _this.isTheClip = true;

    _this.init(_this.attrs, _this.props);

    _this.ownContext.window.addEventListener("resize", function () {
      for (var i in _this.ownContext.elements.cameras) {
        _this.ownContext.elements.cameras[i].object.aspect = _this.props.context.rootElement.offsetWidth / _this.props.context.rootElement.offsetHeight;

        _this.ownContext.elements.cameras[i].object.updateProjectionMatrix();
      }

      for (var _i in _this.ownContext.elements.renderers) {
        _this.ownContext.elements.renderers[_i].object.setSize(_this.props.context.rootElement.offsetWidth, _this.props.context.rootElement.offsetHeight);
      } // render the scene


      for (var _i2 in _this.attrs.renders) {
        _this.ownContext.getElements(_this.attrs.renders[_i2].renderer)[0].object.render(_this.ownContext.getElements(_this.attrs.renders[_i2].scene)[0].object, _this.ownContext.getElements(_this.attrs.renders[_i2].camera)[0].object);
      }
    });

    return _this;
  }

  _createClass(Clip3D, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.render();

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "exportConstructionArguments",
    value: function exportConstructionArguments() {
      return {
        attrs: JSON.parse(JSON.stringify(this.initialAttrs)),
        props: JSON.parse(JSON.stringify(_objectSpread({}, this.initialProps, {
          host: undefined
        })))
      };
    }
  }, {
    key: "render",
    value: function render() {
      for (var i in this.ownContext.elements.renderers) {
        this.ownContext.rootElement.appendChild(this.ownContext.elements.renderers[i].object.domElement);
        this.ownContext.elements.renderers[i].object.domElement.style.zIndex = i;
        this.ownContext.elements.renderers[i].object.domElement.style.top = 0;
        this.ownContext.elements.renderers[i].object.domElement.style.position = "absolute";
      }

      for (var _i3 in this.attrs.renders) {
        this.ownContext.getElements(this.attrs.renders[_i3].renderer)[0].object.render(this.ownContext.getElements(this.attrs.renders[_i3].scene)[0].object, this.ownContext.getElements(this.attrs.renders[_i3].camera)[0].object);
      }
    }
  }, {
    key: "runChecks",
    value: function runChecks(attrs, props) {
      if (_typeof(props) !== "object") {
        console.error("Self Contained Incident expects an object on its                 second argument on the constructor. ".concat(_typeof(props), " passed"));
        return false;
      }

      if (!props.hasOwnProperty("id")) {
        console.error("Self Contained Incident expects the 'id' key on its                 constructor properties which is missing");
        return false;
      }

      if (!props.hasOwnProperty("host")) {
        console.error("Self Contained Incident expects the 'host' key on its             constructor properties which is missing");
        return false;
      }

      if (!props.hasOwnProperty("containerParams")) {
        console.error("Self Contained Incident expects the 'containerParams'             key on its constructor properties which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("scenes")) {
        console.error("Self Contained Incident expects the 'scenes' key on             its constructor attributes which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("lights")) {
        console.error("Self Contained Incident expects the 'lights' key on                 its constructor attributes which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("cameras")) {
        console.error("Self Contained Incident expects the 'cameras' key on                 its constructor attributes which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("renderers")) {
        console.error("Self Contained Incident expects the 'renderers' key                 on its constructor attributes which is missing");
        return false;
      }

      return true;
    } // onProgress(fraction, milliseconds, contextId, forceReset = false) {
    //   if (this.context.loading.length > 0) {
    //     this.setBlock();
    //   } else {
    //     super.onProgress(fraction, milliseconds, contextId, forceReset);
    //   }
    // }

  }, {
    key: "lastWish",
    value: function lastWish() {
      this.ownContext.unmount();
    }
  }]);

  return Clip3D;
}(ExtendableClip);

module.exports = Clip3D;