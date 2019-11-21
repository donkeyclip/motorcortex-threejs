"use strict";

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var promise = Promise;

var uuidv1 = require("uuid/v4");

var ThreejsContextHandler =
/*#__PURE__*/
function () {
  function ThreejsContextHandler(attrs, props, o) {
    _classCallCheck(this, ThreejsContextHandler);

    this.props = props;
    this.attrs = attrs;
    this.o = _objectSpread({}, o);
    this.hasLoaded = false;
    var shadow = props.host.attachShadow({
      mode: "closed"
    });
    var wrapper = document.createElement("div");

    if (Object.prototype.hasOwnProperty.call(props, "containerParams")) {
      if (Object.prototype.hasOwnProperty.call(props.containerParams, "width")) {
        wrapper.style.width = props.containerParams.width;
      }

      if (Object.prototype.hasOwnProperty.call(props.containerParams, "height")) {
        wrapper.style.height = props.containerParams.height;
      }
    }

    wrapper.innerHTML = props.html + "<slot></slot>";
    shadow.appendChild(wrapper);
    var styleTag = document.createElement("style");
    styleTag.type = "text/css";

    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText = props.css;
    } else {
      styleTag.appendChild(document.createTextNode(props.css));
    }

    shadow.appendChild(styleTag);

    if (Object.prototype.hasOwnProperty.call(props, "fonts")) {
      for (var i = 0; i < props.fonts.length; i++) {
        var theFont = props.fonts[i];

        if (theFont.type === "google-font") {
          var fontTag = document.createElement("link");
          fontTag.setAttribute("rel", "stylesheet");
          fontTag.setAttribute("src", theFont.src);
          shadow.appendChild(fontTag);
        }
      }
    }

    wrapper.style.overflow = "hidden";
    this.rootElement = wrapper;
    this.context = {
      clipId: uuidv1(),
      document: document,
      window: window,
      rootElement: this.rootElement,
      loading: false,
      loadingElements: [],
      loaders: [{
        id: "JSONLoader",
        groups: "loaders",
        type: "JSONLoader"
      }],
      elements: {
        lights: [],
        cameras: [],
        scenes: [],
        renderers: [],
        models: [],
        entities: [],
        css3d_objects: [],
        loaders: [],
        renders: [],
        mixers: [],
        controls: [],
        rn: Math.random().toFixed(2)
      },
      unmount: function unmount() {},
      getElements: this.getElements.bind(this),
      getMCID: this.getMCID.bind(this),
      setMCID: this.setMCID.bind(this),
      getElementSelectorByMCID: this.getElementSelectorByMCID.bind(this),
      getElementByMCID: this.getElementByMCID.bind(this),
      pushMixer: this.pushMixer.bind(this)
    };
    this.init();
  }

  _createClass(ThreejsContextHandler, [{
    key: "getElementByMCID",
    value: function getElementByMCID(mcid) {
      for (var prop in this.context.elements) {
        for (var element in this.context.elements[prop]) {
          if (this.context.elements[prop][element].id === mcid) {
            return this.context.elements[prop][element];
          }
        }
      }

      return null;
    }
  }, {
    key: "getElements",
    value: function getElements(selector) {
      var elements = [];
      var key = "groups";

      if (selector.substring(0, 1) === "#" || selector.substring(0, 1) !== ".") {
        key = "id";
      }

      selector = selector.substring(1, selector.length);

      for (var prop in this.context.elements) {
        for (var element in this.context.elements[prop]) {
          if (this.context.elements[prop][element][key] === selector) {
            elements.push(this.context.elements[prop][element]);
          }
        }
      }

      return elements;
    }
  }, {
    key: "getMCID",
    value: function getMCID(element) {
      return element.id;
    }
  }, {
    key: "setMCID",
    value: function setMCID(element
    /*, mcid*/
    ) {
      element.mcid = element.id;
    }
  }, {
    key: "getElementSelectorByMCID",
    value: function getElementSelectorByMCID(mcid) {
      for (var prop in this.context.elements) {
        for (var element in this.context.elements[prop]) {
          if (this.context.elements[prop][element].id === mcid) {
            return "#" + mcid;
          }
        }
      }

      return null;
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, camera, type, length, cameraObj, _camera, _cameraObj, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, scene, _length, sceneObj, _scene, _sceneObj, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, renderer, _type, _length2, rendererObj, _renderer, _type2, _rendererObj, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, light, _length3, lightObj, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _scene2, _light, _lightObj, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _scene3, helper, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, css3d, elements, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, element, _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, _scene4, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, loader, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _loop, _iterator9, _step9, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, entity, geometry, material, _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, _scene5, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, _render, applyElement, render, animate;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.attrs.cameras instanceof Array)) {
                  _context.next = 37;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 4;
                _iterator = this.attrs.cameras[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 21;
                  break;
                }

                camera = _step.value;
                camera.id = camera.id || uuidv1();

                if (!this.context.getElements("#" + camera.id)[0]) {
                  _context.next = 11;
                  break;
                }

                throw "This id '".concat(camera.id, "' is already in use.");

              case 11:
                this.initializeCamera(camera);
                type = camera.settings.type;
                this.context.elements.cameras.push({
                  id: camera.id,
                  groups: camera.groups,
                  settings: camera.settings,
                  object: _construct(THREE[type], _toConsumableArray(camera.parameters))
                });
                length = this.context.elements.cameras.length - 1;
                cameraObj = this.context.elements.cameras[length].object;
                this.applySettingsToObjects(camera.settings, cameraObj);
                cameraObj.updateProjectionMatrix();

              case 18:
                _iteratorNormalCompletion = true;
                _context.next = 6;
                break;

              case 21:
                _context.next = 27;
                break;

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 27:
                _context.prev = 27;
                _context.prev = 28;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 30:
                _context.prev = 30;

                if (!_didIteratorError) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(27);

              case 35:
                _context.next = 47;
                break;

              case 37:
                _camera = this.attrs.cameras || {};
                _camera.id = _camera.id || uuidv1();

                if (!this.context.getElements("#" + _camera.id)[0]) {
                  _context.next = 41;
                  break;
                }

                throw "This id '".concat(_camera.id, "' is already in use.");

              case 41:
                this.initializeCamera(_camera);
                type = _camera.settings.type;
                this.context.elements.cameras.push({
                  id: _camera.id,
                  groups: _camera.groups,
                  settings: _camera.settings,
                  object: _construct(THREE[type], _toConsumableArray(_camera.parameters))
                });
                _cameraObj = this.context.elements.cameras[0].object;
                this.applySettingsToObjects(_camera.settings, _cameraObj);

                _cameraObj.updateProjectionMatrix();

              case 47:
                if (!(this.attrs.scenes instanceof Array)) {
                  _context.next = 81;
                  break;
                }

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 51;
                _iterator2 = this.attrs.scenes[Symbol.iterator]();

              case 53:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 65;
                  break;
                }

                scene = _step2.value;
                scene.id = scene.id || uuidv1();

                if (!this.context.getElements("#" + scene.id)[0]) {
                  _context.next = 58;
                  break;
                }

                throw "This id ".concat(scene.id, " is already in use.");

              case 58:
                this.context.elements.scenes.push({
                  id: scene.id,
                  groups: scene.groups,
                  object: new THREE.Scene()
                });
                _length = this.context.elements.scenes.length - 1;
                sceneObj = this.context.elements.scenes[_length].object;

                if (scene.settings.fog) {
                  sceneObj.fog = _construct(THREE.Fog, _toConsumableArray(scene.settings.fog));
                }

              case 62:
                _iteratorNormalCompletion2 = true;
                _context.next = 53;
                break;

              case 65:
                _context.next = 71;
                break;

              case 67:
                _context.prev = 67;
                _context.t1 = _context["catch"](51);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t1;

              case 71:
                _context.prev = 71;
                _context.prev = 72;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 74:
                _context.prev = 74;

                if (!_didIteratorError2) {
                  _context.next = 77;
                  break;
                }

                throw _iteratorError2;

              case 77:
                return _context.finish(74);

              case 78:
                return _context.finish(71);

              case 79:
                _context.next = 86;
                break;

              case 81:
                _scene = {};
                _scene.id = (this.attrs.scenes || {}).id || uuidv1();
                this.context.elements.scenes.push({
                  id: _scene.id,
                  groups: _scene.groups,
                  object: new THREE.Scene()
                });
                _sceneObj = this.context.elements.scenes[0].object;

                if ((this.attrs.scenes || {}).fog) {
                  _sceneObj.fog = _construct(THREE.Fog, _toConsumableArray(this.attrs.scenes.fog));
                }

              case 86:
                if (!(this.attrs.renderers instanceof Array)) {
                  _context.next = 122;
                  break;
                }

                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context.prev = 90;
                _iterator3 = this.attrs.renderers[Symbol.iterator]();

              case 92:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context.next = 106;
                  break;
                }

                renderer = _step3.value;
                renderer.id = renderer.id || uuidv1();

                if (!this.context.getElements("#" + renderer.id)[0]) {
                  _context.next = 97;
                  break;
                }

                throw "This id ".concat(renderer.id, "is already in use.");

              case 97:
                this.initializeRenderer(renderer);
                _type = renderer.settings.type;
                this.context.elements.renderers.push({
                  id: renderer.id,
                  groups: renderer.groups,
                  object: _construct(THREE[_type], _toConsumableArray(renderer.parameters))
                });
                _length2 = this.context.elements.renderers.length - 1;
                rendererObj = this.context.elements.renderers[_length2].object;
                this.applySettingsToObjects(renderer.settings, rendererObj);

              case 103:
                _iteratorNormalCompletion3 = true;
                _context.next = 92;
                break;

              case 106:
                _context.next = 112;
                break;

              case 108:
                _context.prev = 108;
                _context.t2 = _context["catch"](90);
                _didIteratorError3 = true;
                _iteratorError3 = _context.t2;

              case 112:
                _context.prev = 112;
                _context.prev = 113;

                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }

              case 115:
                _context.prev = 115;

                if (!_didIteratorError3) {
                  _context.next = 118;
                  break;
                }

                throw _iteratorError3;

              case 118:
                return _context.finish(115);

              case 119:
                return _context.finish(112);

              case 120:
                _context.next = 131;
                break;

              case 122:
                _renderer = this.attrs.renderers || {};
                _renderer.id = _renderer.id || uuidv1();

                if (!this.context.getElements("#" + _renderer.id)[0]) {
                  _context.next = 126;
                  break;
                }

                throw "This id ".concat(_renderer.id, "is already in use.");

              case 126:
                this.initializeRenderer(_renderer);
                _type2 = _renderer.settings.type;
                this.context.elements.renderers.push({
                  id: _renderer.id,
                  groups: _renderer.groups,
                  object: _construct(THREE[_type2], _toConsumableArray(_renderer.parameters))
                });
                _rendererObj = this.context.elements.renderers[0].object;
                this.applySettingsToObjects(_renderer.settings, _rendererObj);

              case 131:
                if (!(this.attrs.lights instanceof Array)) {
                  _context.next = 186;
                  break;
                }

                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context.prev = 135;
                _iterator4 = this.attrs.lights[Symbol.iterator]();

              case 137:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context.next = 170;
                  break;
                }

                light = _step4.value;
                light.id = light.id || uuidv1();
                light.applyToSelector = light.applyToSelector || "#" + this.context.elements.scenes[0].id;

                if (!this.context.getElements("#" + light.id)[0]) {
                  _context.next = 143;
                  break;
                }

                throw "This id  ".concat(light.id, " is already in use.");

              case 143:
                this.initializeLight(light);
                this.context.elements.lights.push({
                  id: light.id,
                  groups: light.groups,
                  object: _construct(THREE[light.settings.type], _toConsumableArray(light.parameters))
                });
                _length3 = this.context.elements.lights.length - 1;
                lightObj = this.context.elements.lights[_length3].object;
                this.applySettingsToObjects(light.settings, lightObj);
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context.prev = 151;

                for (_iterator5 = this.context.getElements(light.applyToSelector)[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  _scene2 = _step5.value;

                  _scene2.object.add(lightObj);
                }

                _context.next = 159;
                break;

              case 155:
                _context.prev = 155;
                _context.t3 = _context["catch"](151);
                _didIteratorError5 = true;
                _iteratorError5 = _context.t3;

              case 159:
                _context.prev = 159;
                _context.prev = 160;

                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }

              case 162:
                _context.prev = 162;

                if (!_didIteratorError5) {
                  _context.next = 165;
                  break;
                }

                throw _iteratorError5;

              case 165:
                return _context.finish(162);

              case 166:
                return _context.finish(159);

              case 167:
                _iteratorNormalCompletion4 = true;
                _context.next = 137;
                break;

              case 170:
                _context.next = 176;
                break;

              case 172:
                _context.prev = 172;
                _context.t4 = _context["catch"](135);
                _didIteratorError4 = true;
                _iteratorError4 = _context.t4;

              case 176:
                _context.prev = 176;
                _context.prev = 177;

                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }

              case 179:
                _context.prev = 179;

                if (!_didIteratorError4) {
                  _context.next = 182;
                  break;
                }

                throw _iteratorError4;

              case 182:
                return _context.finish(179);

              case 183:
                return _context.finish(176);

              case 184:
                _context.next = 214;
                break;

              case 186:
                _light = this.attrs.lights || {};
                _light.id = _light.id || uuidv1();
                _light.applyToSelector = _light.applyToSelector || "#" + this.context.elements.scenes[0].id;

                if (!this.context.getElements("#" + _light.id)[0]) {
                  _context.next = 191;
                  break;
                }

                throw "This id  ".concat(_light.id, " is already in use.");

              case 191:
                this.initializeLight(_light);
                this.context.elements.lights.push({
                  id: _light.id,
                  groups: _light.groups,
                  object: _construct(THREE[_light.settings.type], _toConsumableArray(_light.parameters))
                });
                _lightObj = this.context.elements.lights[0].object;
                this.applySettingsToObjects(_light.settings, _lightObj);
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context.prev = 198;

                for (_iterator6 = this.context.getElements(_light.applyToSelector)[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  _scene3 = _step6.value;
                  _lightObj.castShadow = true;

                  _scene3.object.add(_lightObj);

                  helper = new THREE.CameraHelper(_lightObj.shadow.camera);

                  _scene3.object.add(helper);
                }

                _context.next = 206;
                break;

              case 202:
                _context.prev = 202;
                _context.t5 = _context["catch"](198);
                _didIteratorError6 = true;
                _iteratorError6 = _context.t5;

              case 206:
                _context.prev = 206;
                _context.prev = 207;

                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }

              case 209:
                _context.prev = 209;

                if (!_didIteratorError6) {
                  _context.next = 212;
                  break;
                }

                throw _iteratorError6;

              case 212:
                return _context.finish(209);

              case 213:
                return _context.finish(206);

              case 214:
                /*
                * CSS3DOBJECTS
                */
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context.prev = 217;
                _iterator7 = (this.attrs.css3d_objects || [])[Symbol.iterator]();

              case 219:
                if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                  _context.next = 276;
                  break;
                }

                css3d = _step7.value;
                css3d.scenes = css3d.scenes || "#" + this.context.elements.scenes[0].id;
                css3d.id = css3d.id || uuidv1();

                if (!this.context.getElements("#" + css3d.id)[0]) {
                  _context.next = 225;
                  break;
                }

                throw "This id ".concat(css3d.id, " is already in use.");

              case 225:
                this.initializeMesh(css3d);
                elements = this.context.rootElement.querySelectorAll(css3d.selector);
                _iteratorNormalCompletion12 = true;
                _didIteratorError12 = false;
                _iteratorError12 = undefined;
                _context.prev = 230;
                _iterator12 = elements[Symbol.iterator]();

              case 232:
                if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                  _context.next = 259;
                  break;
                }

                element = _step12.value;
                css3d.object = new THREE.CSS3DObject(element);
                this.context.elements.css3d_objects.push(css3d);
                this.applySettingsToObjects(css3d.settings, css3d.object);
                _iteratorNormalCompletion13 = true;
                _didIteratorError13 = false;
                _iteratorError13 = undefined;
                _context.prev = 240;

                for (_iterator13 = this.context.getElements(css3d.scenes)[Symbol.iterator](); !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                  _scene4 = _step13.value;

                  _scene4.object.add(css3d.object);
                }

                _context.next = 248;
                break;

              case 244:
                _context.prev = 244;
                _context.t6 = _context["catch"](240);
                _didIteratorError13 = true;
                _iteratorError13 = _context.t6;

              case 248:
                _context.prev = 248;
                _context.prev = 249;

                if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
                  _iterator13.return();
                }

              case 251:
                _context.prev = 251;

                if (!_didIteratorError13) {
                  _context.next = 254;
                  break;
                }

                throw _iteratorError13;

              case 254:
                return _context.finish(251);

              case 255:
                return _context.finish(248);

              case 256:
                _iteratorNormalCompletion12 = true;
                _context.next = 232;
                break;

              case 259:
                _context.next = 265;
                break;

              case 261:
                _context.prev = 261;
                _context.t7 = _context["catch"](230);
                _didIteratorError12 = true;
                _iteratorError12 = _context.t7;

              case 265:
                _context.prev = 265;
                _context.prev = 266;

                if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
                  _iterator12.return();
                }

              case 268:
                _context.prev = 268;

                if (!_didIteratorError12) {
                  _context.next = 271;
                  break;
                }

                throw _iteratorError12;

              case 271:
                return _context.finish(268);

              case 272:
                return _context.finish(265);

              case 273:
                _iteratorNormalCompletion7 = true;
                _context.next = 219;
                break;

              case 276:
                _context.next = 282;
                break;

              case 278:
                _context.prev = 278;
                _context.t8 = _context["catch"](217);
                _didIteratorError7 = true;
                _iteratorError7 = _context.t8;

              case 282:
                _context.prev = 282;
                _context.prev = 283;

                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }

              case 285:
                _context.prev = 285;

                if (!_didIteratorError7) {
                  _context.next = 288;
                  break;
                }

                throw _iteratorError7;

              case 288:
                return _context.finish(285);

              case 289:
                return _context.finish(282);

              case 290:
                /*
                * LOADERS
                */
                _iteratorNormalCompletion8 = true;
                _didIteratorError8 = false;
                _iteratorError8 = undefined;
                _context.prev = 293;
                _iterator8 = this.context.loaders[Symbol.iterator]();

              case 295:
                if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                  _context.next = 312;
                  break;
                }

                loader = _step8.value;
                loader.id = loader.id;
                this.initializeLoader(loader);

                if (THREE[loader.type]) {
                  _context.next = 307;
                  break;
                }

                _context.prev = 300;

                require("three/examples/js/loaders/" + loader.type);

                _context.next = 307;
                break;

              case 304:
                _context.prev = 304;
                _context.t9 = _context["catch"](300);
                throw _context.t9;

              case 307:
                loader.object = new THREE[loader.type]();
                this.context.elements.loaders.push(loader);

              case 309:
                _iteratorNormalCompletion8 = true;
                _context.next = 295;
                break;

              case 312:
                _context.next = 318;
                break;

              case 314:
                _context.prev = 314;
                _context.t10 = _context["catch"](293);
                _didIteratorError8 = true;
                _iteratorError8 = _context.t10;

              case 318:
                _context.prev = 318;
                _context.prev = 319;

                if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                  _iterator8.return();
                }

              case 321:
                _context.prev = 321;

                if (!_didIteratorError8) {
                  _context.next = 324;
                  break;
                }

                throw _iteratorError8;

              case 324:
                return _context.finish(321);

              case 325:
                return _context.finish(318);

              case 326:
                /*
                * MODELS
                */
                _iteratorNormalCompletion9 = true;
                _didIteratorError9 = false;
                _iteratorError9 = undefined;
                _context.prev = 329;

                _loop = function _loop() {
                  var model = _step9.value;
                  // model.scenes = model.scenes || "#" + this.context.elements.scenes[0].id;
                  model.id = model.id || uuidv1();

                  if (_this.context.getElements("#" + model.id)[0]) {
                    throw "This id ".concat(model.id, " is already in use.");
                  } // this.initializeModel(model);


                  var loader = _this.context.getElements(model.loader)[0];

                  var loadGeometry = function loadGeometry() {
                    return new promise(function (resolve) {
                      var _loader$object;

                      loader.parameters[0] = model.file;
                      loader.parameters[1] = resolve;

                      (_loader$object = loader.object).load.apply(_loader$object, _toConsumableArray(loader.parameters));
                    });
                  };

                  loadGeometry().then(function (g) {
                    _this.hasLoaded = true; // const material = new THREE[model.material.type](
                    //   ...model.material.parameters
                    // );
                    // model.object = new THREE.Mesh(g, material);
                    // this.applySettingsToObjects(model.settings, model.object);
                    // for (const scene of this.context.getElements(model.scenes)) {
                    //   scene.object.add(model.object);
                    // }

                    var that = _this;
                    that.context.loadingElements.splice(0, 1);

                    if (that.context.loadingElements.length === 0) {
                      that.context.loading = false;

                      that.o._thisClip.contextLoaded();
                    } // update all objects that use this geometry


                    for (var i in that.context.elements.entities) {
                      if (that.context.elements.entities[i].geometryFromModel) {
                        that.context.elements.entities[i].object.geometry = g;
                      }
                    } //rerender after the loading has been completed


                    _this.o._thisClip.render();
                  });
                  var that = _this;
                  that.context.loadingElements.push(1);

                  if (that.context.loadingElements.length === 1 && !that.hasLoaded) {
                    that.context.loading = true;

                    that.o._thisClip.contextLoading();
                  } // create pseudo point as element


                  var geometry = new THREE.BufferGeometry(); // const material = new THREE.PointsMaterial();
                  // const pseudoModel = new THREE.Points(geometry, material);
                  // pseudoModel.name = model.id;
                  // model.object = pseudoModel;

                  model.geometry = geometry; // this.applySettingsToObjects(model.settings, model.object);

                  _this.context.elements.models.push(model);
                };

                for (_iterator9 = this.attrs.models[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  _loop();
                }
                /*
                * entities
                */


                _context.next = 338;
                break;

              case 334:
                _context.prev = 334;
                _context.t11 = _context["catch"](329);
                _didIteratorError9 = true;
                _iteratorError9 = _context.t11;

              case 338:
                _context.prev = 338;
                _context.prev = 339;

                if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                  _iterator9.return();
                }

              case 341:
                _context.prev = 341;

                if (!_didIteratorError9) {
                  _context.next = 344;
                  break;
                }

                throw _iteratorError9;

              case 344:
                return _context.finish(341);

              case 345:
                return _context.finish(338);

              case 346:
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context.prev = 349;
                _iterator10 = this.attrs.entities[Symbol.iterator]();

              case 351:
                if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                  _context.next = 388;
                  break;
                }

                entity = _step10.value;
                entity.id = entity.id || uuidv1();
                entity.scenes = entity.scenes || "#" + this.context.elements.scenes[0].id;

                if (!this.context.getElements("#" + entity.id)[0]) {
                  _context.next = 357;
                  break;
                }

                throw "This id ".concat(entity.id, " is already in use.");

              case 357:
                this.initializeMesh(entity);
                geometry = entity.geometryFromModel ? this.context.getElements(entity.geometryFromModel)[0].geometry : _construct(THREE[entity.geometry.type], _toConsumableArray(entity.geometry.parameters));

                if (entity.material.parameters.side) {
                  entities.material.parameters.side = THREE[entities.material.parameters.side];
                }

                if (entity.material.parameters.vertexColors) {
                  entities.material.parameters.vertexColors = THREE[entities.material.parameters.vertexColors];
                }

                material = _construct(THREE[entity.material.type], _toConsumableArray(entity.material.parameters));
                entity.object = new THREE.Mesh(geometry, material);
                this.context.elements.entities.push(entity);
                this.applySettingsToObjects(entity.settings, entity.object);

                if (entity.callback) {
                  entity.callback(entity.object.geometry, entity.object.material, entity.object);
                }

                _iteratorNormalCompletion14 = true;
                _didIteratorError14 = false;
                _iteratorError14 = undefined;
                _context.prev = 369;

                for (_iterator14 = this.context.getElements(entity.scenes)[Symbol.iterator](); !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                  _scene5 = _step14.value;

                  _scene5.object.add(entity.object);
                }

                _context.next = 377;
                break;

              case 373:
                _context.prev = 373;
                _context.t12 = _context["catch"](369);
                _didIteratorError14 = true;
                _iteratorError14 = _context.t12;

              case 377:
                _context.prev = 377;
                _context.prev = 378;

                if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
                  _iterator14.return();
                }

              case 380:
                _context.prev = 380;

                if (!_didIteratorError14) {
                  _context.next = 383;
                  break;
                }

                throw _iteratorError14;

              case 383:
                return _context.finish(380);

              case 384:
                return _context.finish(377);

              case 385:
                _iteratorNormalCompletion10 = true;
                _context.next = 351;
                break;

              case 388:
                _context.next = 394;
                break;

              case 390:
                _context.prev = 390;
                _context.t13 = _context["catch"](349);
                _didIteratorError10 = true;
                _iteratorError10 = _context.t13;

              case 394:
                _context.prev = 394;
                _context.prev = 395;

                if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
                  _iterator10.return();
                }

              case 397:
                _context.prev = 397;

                if (!_didIteratorError10) {
                  _context.next = 400;
                  break;
                }

                throw _iteratorError10;

              case 400:
                return _context.finish(397);

              case 401:
                return _context.finish(394);

              case 402:
                /*
                * renders
                */
                this.attrs.renders = this.attrs.renders || [{}];
                _iteratorNormalCompletion11 = true;
                _didIteratorError11 = false;
                _iteratorError11 = undefined;
                _context.prev = 406;

                for (_iterator11 = this.attrs.renders[Symbol.iterator](); !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                  _render = _step11.value;
                  _render.scene = _render.scene || "#" + this.context.elements.scenes[0].id;
                  _render.camera = _render.camera || "#" + this.context.elements.cameras[0].id;
                  _render.renderer = _render.renderer || "#" + this.context.elements.renderers[0].id;
                  this.context.elements.renders.push(_render);
                }
                /*
                * CONTROLS
                */


                _context.next = 414;
                break;

              case 410:
                _context.prev = 410;
                _context.t14 = _context["catch"](406);
                _didIteratorError11 = true;
                _iteratorError11 = _context.t14;

              case 414:
                _context.prev = 414;
                _context.prev = 415;

                if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
                  _iterator11.return();
                }

              case 417:
                _context.prev = 417;

                if (!_didIteratorError11) {
                  _context.next = 420;
                  break;
                }

                throw _iteratorError11;

              case 420:
                return _context.finish(417);

              case 421:
                return _context.finish(414);

              case 422:
                if (this.attrs.controls) {
                  if (this.attrs.controls.appplyTo) {
                    applyElement = this.attrs.controls.applyTo;
                  } else {
                    applyElement = window.document.body;
                  }

                  this.context.elements.controls[0] = new THREE.TrackballControls(this.context.getElements(this.attrs.controls.cameraId)[0].object, applyElement);
                  this.context.elements.controls[0].enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled

                  this.context.elements.controls[0].dampingFactor = 0.5;
                  this.context.elements.controls[0].screenSpacePanning = false;
                  this.context.elements.controls[0].minDistance = 1;
                  this.context.elements.controls[0].maxDistance = 1000;
                  this.context.elements.controls[0].maxPolarAngle = Math.PI / 2;

                  render = function render() {
                    if ((((_this.context.elements.controls[0] || {}).domElement || {}).style || {}).pointerEvents === "none") {
                      return;
                    }

                    for (var i in _this.attrs.renders) {
                      _this.context.getElements(_this.attrs.renders[i].renderer)[0].object.render(_this.context.getElements(_this.attrs.renders[i].scene)[0].object, _this.context.getElements(_this.attrs.renders[i].camera)[0].object);
                    }
                  };

                  animate = function animate() {
                    requestAnimationFrame(animate);

                    _this.context.elements.controls[0].update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true


                    render();
                  };

                  animate();
                }

              case 423:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 23, 27, 35], [28,, 30, 34], [51, 67, 71, 79], [72,, 74, 78], [90, 108, 112, 120], [113,, 115, 119], [135, 172, 176, 184], [151, 155, 159, 167], [160,, 162, 166], [177,, 179, 183], [198, 202, 206, 214], [207,, 209, 213], [217, 278, 282, 290], [230, 261, 265, 273], [240, 244, 248, 256], [249,, 251, 255], [266,, 268, 272], [283,, 285, 289], [293, 314, 318, 326], [300, 304], [319,, 321, 325], [329, 334, 338, 346], [339,, 341, 345], [349, 390, 394, 402], [369, 373, 377, 385], [378,, 380, 384], [395,, 397, 401], [406, 410, 414, 422], [415,, 417, 421]]);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "pushMixer",
    value: function pushMixer(mixer) {
      this.context.elements.mixers.push(mixer);
    }
  }, {
    key: "initializeCamera",
    value: function initializeCamera(camera) {
      camera.settings = camera.settings || {};
      camera.settings.type = camera.settings.type || "PerspectiveCamera";
      camera.parameters = camera.parameters || {};

      if (camera.settings.type === "PerspectiveCamera") {
        var fov = 45;
        var aspect = this.context.rootElement.offsetWidth / this.context.rootElement.offsetHeight;
        var near = 1;
        var far = 10000;
        camera.parameters = [fov, aspect, near, far];
      } else {
        var left = this.context.rootElement.offsetWidth / -2;
        var right = this.context.rootElement.offsetWidth / 2;
        var top = this.context.rootElement.offsetHeight / 2;
        var bottom = this.context.rootElement.offsetHeight / -2;
        var _near = 1;
        var _far = 1000;
        camera.parameters = [left, right, top, bottom, _near, _far];
      }

      camera.settings.position = camera.settings.position || {};
      camera.settings.position.x = camera.settings.position.x || 0;
      camera.settings.position.y = camera.settings.position.y || 0;
      camera.settings.position.z = camera.settings.position.z || 10;
      camera.settings.lookAt = camera.settings.lookAt || [0, 0, 0];
    }
  }, {
    key: "initializeRenderer",
    value: function initializeRenderer(renderer) {
      renderer.settings = renderer.settings || {
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }
      };
      renderer.settings.setClearColor = renderer.settings.setClearColor || [0xf5f5f5], renderer.settings.type = renderer.settings.type || "WebGLRenderer";
      renderer.parameters = renderer.parameters || [{
        alpha: true,
        antialias: true
      }];

      if (renderer.settings.type === "WebGLRenderer") {
        renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [this.context.window.devicePixelRatio];
      }

      renderer.settings.setSize = renderer.settings.setSize || [this.context.rootElement.offsetWidth, this.context.rootElement.offsetHeight];
    }
  }, {
    key: "initializeLight",
    value: function initializeLight(light) {
      light.settings = light.settings || {};
      light.settings.type = light.settings.type || "DirectionalLight";
      light.settings.castShadow = light.settings.hasOwnProperty("castShadow") ? light.settings.castShadow : true;

      if (light.settings.type === "SpotLight") {
        light.settings.position = light.settings.position || {
          set: [0, 0, 20]
        };
        light.settings.penumbra = light.settings.penumbra || 0.8;
        light.parameters = light.parameters || [0xffffff, 2];
      } else if (light.settings.type === "DirectionalLight") {
        light.settings.shadow = {
          camera: {
            near: 0.5,
            far: 300,
            left: -50,
            bottom: -50,
            right: 50,
            top: 50
          },
          bias: 0.0001,
          mapSize: {
            x: 1024 * 8,
            y: 1024 * 8
          }
        };
        light.settings.position = light.settings.position || {
          set: [50, 50, 40]
        };
        light.parameters = light.parameters || [0xffffff, 1];
      } else if (light.settings.type === "PointLight") {
        light.parameters = light.parameters || [0xffffff, 1, 100];
        light.settings.position = light.settings.position || {
          set: [0, 100, 100]
        };
        light.settings.target = light.settings.target || {
          position: {
            x: 0,
            y: 0,
            z: 0
          }
        };
      }
    }
  }, {
    key: "initializeMesh",
    value: function initializeMesh(entity) {
      entity.settings = entity.settings || {};
      entity.settings.castShadow = true;
      entity.settings.receiveShadow = true;
      entity.settings.position = entity.settings.position || {};
      entity.settings.position.x = entity.settings.position.x || 0;
      entity.settings.position.y = entity.settings.position.y || 0;
      entity.settings.position.z = entity.settings.position.z || 0;
    }
  }, {
    key: "initializeCSS3DObject",
    value: function initializeCSS3DObject(css3d) {
      css3d.settings = css3d.settings || {};
      css3d.settings.position = css3d.settings.position || {};
      css3d.settings.position.x = css3d.settings.position.x || 0;
      css3d.settings.position.y = css3d.settings.position.y || 0;
      css3d.settings.position.z = css3d.settings.position.z || 0;
    }
  }, {
    key: "initializeLoader",
    value: function initializeLoader(loader) {
      loader.parameters = loader.parameters || [];

      if (loader.parameters.length < 2) {
        loader.parameters.push(null, null, function ()
        /*xhr*/
        {// console.log((xhr.loaded / xhr.total) * 100 + "%loaded");
        }, function (error) {
          throw error;
        });
      }
    }
  }, {
    key: "initializeModel",
    value: function initializeModel(model) {
      model.settings = model.settings || {};
      model.settings.position = model.settings.position || {};
      model.settings.position.x = model.settings.position.x || 0;
      model.settings.position.y = model.settings.position.y || 0;
      model.settings.position.z = model.settings.position.z || 0;
    }
  }, {
    key: "applySettingsToObjects",
    value: function applySettingsToObjects(settings, obj) {
      for (var key in settings) {
        if (settings[key] instanceof Array) {
          obj[key].apply(obj, _toConsumableArray(settings[key]));
          continue;
        } else if (settings[key] !== Object(settings[key])) {
          // is primitive
          obj[key] = settings[key];
          continue;
        }

        this.applySettingsToObjects(settings[key], obj[key]);
      }
    }
  }]);

  return ThreejsContextHandler;
}();

module.exports = ThreejsContextHandler;