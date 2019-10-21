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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var promise = Promise;

var uuidv1 = require("uuid/v4");

var ThreejsContextHandler =
/*#__PURE__*/
function () {
  function ThreejsContextHandler(attrs, props, _thisClip) {
    _classCallCheck(this, ThreejsContextHandler);

    this.props = props;
    this.attrs = attrs;
    this._thisClip = _thisClip;
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
      loading: [],
      elements: {
        lights: [],
        cameras: [],
        scenes: [],
        renderers: [],
        models: [],
        meshes: [],
        css3d_objects: [],
        loaders: [],
        renders: this.attrs.renders,
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

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, camera, type, length, cameraObj, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, scene, _length, sceneObj, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, renderer, _length2, rendererObj, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, light, _length3, lightObj, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _scene, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, mesh, geometry, material, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _scene2, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, css3d, elements, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, element, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, _scene3, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, loader, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _loop, _iterator8, _step8, applyElement, render, animate;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                /*
                * CAMERAS
                */
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 3;
                _iterator = this.attrs.cameras[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 20;
                  break;
                }

                camera = _step.value;
                camera.id = camera.id || uuidv1();

                if (!this.context.getElements("#" + camera.id)[0]) {
                  _context.next = 10;
                  break;
                }

                throw "This id '".concat(camera.id, "' is already in use.");

              case 10:
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

              case 17:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 20:
                _context.next = 26;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 26:
                _context.prev = 26;
                _context.prev = 27;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 29:
                _context.prev = 29;

                if (!_didIteratorError) {
                  _context.next = 32;
                  break;
                }

                throw _iteratorError;

              case 32:
                return _context.finish(29);

              case 33:
                return _context.finish(26);

              case 34:
                /*
                * SCENES
                */
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 37;
                _iterator2 = this.attrs.scenes[Symbol.iterator]();

              case 39:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 51;
                  break;
                }

                scene = _step2.value;
                scene.id = scene.id || uuidv1();

                if (!this.context.getElements("#" + scene.id)[0]) {
                  _context.next = 44;
                  break;
                }

                throw "This id ".concat(scene.id, " is already in use.");

              case 44:
                this.context.elements.scenes.push({
                  id: scene.id,
                  groups: scene.groups,
                  object: new THREE.Scene()
                });
                _length = this.context.elements.scenes.length - 1;
                sceneObj = this.context.elements.scenes[_length].object;

                if (scene.settings.fog) {
                  sceneObj.fog = scene.settings.fog;
                }

              case 48:
                _iteratorNormalCompletion2 = true;
                _context.next = 39;
                break;

              case 51:
                _context.next = 57;
                break;

              case 53:
                _context.prev = 53;
                _context.t1 = _context["catch"](37);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t1;

              case 57:
                _context.prev = 57;
                _context.prev = 58;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 60:
                _context.prev = 60;

                if (!_didIteratorError2) {
                  _context.next = 63;
                  break;
                }

                throw _iteratorError2;

              case 63:
                return _context.finish(60);

              case 64:
                return _context.finish(57);

              case 65:
                /*
                * RENDERERS
                */
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context.prev = 68;
                _iterator3 = this.attrs.renderers[Symbol.iterator]();

              case 70:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context.next = 84;
                  break;
                }

                renderer = _step3.value;
                renderer.id = renderer.id || uuidv1();

                if (!this.context.getElements("#" + renderer.id)[0]) {
                  _context.next = 75;
                  break;
                }

                throw "This id ".concat(renderer.id, "is already in use.");

              case 75:
                this.initializeRenderer(renderer);
                type = renderer.settings.type;
                this.context.elements.renderers.push({
                  id: renderer.id,
                  groups: renderer.groups,
                  object: _construct(THREE[type], _toConsumableArray(renderer.parameters))
                });
                _length2 = this.context.elements.renderers.length - 1;
                rendererObj = this.context.elements.renderers[_length2].object;
                this.applySettingsToObjects(renderer.settings, rendererObj);

              case 81:
                _iteratorNormalCompletion3 = true;
                _context.next = 70;
                break;

              case 84:
                _context.next = 90;
                break;

              case 86:
                _context.prev = 86;
                _context.t2 = _context["catch"](68);
                _didIteratorError3 = true;
                _iteratorError3 = _context.t2;

              case 90:
                _context.prev = 90;
                _context.prev = 91;

                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }

              case 93:
                _context.prev = 93;

                if (!_didIteratorError3) {
                  _context.next = 96;
                  break;
                }

                throw _iteratorError3;

              case 96:
                return _context.finish(93);

              case 97:
                return _context.finish(90);

              case 98:
                /*
                * LIGHTS
                */
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context.prev = 101;
                _iterator4 = this.attrs.lights[Symbol.iterator]();

              case 103:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context.next = 135;
                  break;
                }

                light = _step4.value;
                light.id = light.id || uuidv1();

                if (!this.context.getElements("#" + light.id)[0]) {
                  _context.next = 108;
                  break;
                }

                throw "This id  ".concat(light.id, " is already in use.");

              case 108:
                this.initializeLight(light);
                this.context.elements.lights.push({
                  id: light.id,
                  groups: light.groups,
                  object: _construct(THREE[light.settings.type], _toConsumableArray(light.parameters))
                });
                _length3 = this.context.elements.lights.length - 1;
                lightObj = this.context.elements.lights[_length3].object;
                this.applySettingsToObjects(light.settings, lightObj);
                _iteratorNormalCompletion9 = true;
                _didIteratorError9 = false;
                _iteratorError9 = undefined;
                _context.prev = 116;

                for (_iterator9 = this.context.getElements(light.applyToSelector)[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  _scene = _step9.value;

                  _scene.object.add(lightObj);
                }

                _context.next = 124;
                break;

              case 120:
                _context.prev = 120;
                _context.t3 = _context["catch"](116);
                _didIteratorError9 = true;
                _iteratorError9 = _context.t3;

              case 124:
                _context.prev = 124;
                _context.prev = 125;

                if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                  _iterator9.return();
                }

              case 127:
                _context.prev = 127;

                if (!_didIteratorError9) {
                  _context.next = 130;
                  break;
                }

                throw _iteratorError9;

              case 130:
                return _context.finish(127);

              case 131:
                return _context.finish(124);

              case 132:
                _iteratorNormalCompletion4 = true;
                _context.next = 103;
                break;

              case 135:
                _context.next = 141;
                break;

              case 137:
                _context.prev = 137;
                _context.t4 = _context["catch"](101);
                _didIteratorError4 = true;
                _iteratorError4 = _context.t4;

              case 141:
                _context.prev = 141;
                _context.prev = 142;

                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }

              case 144:
                _context.prev = 144;

                if (!_didIteratorError4) {
                  _context.next = 147;
                  break;
                }

                throw _iteratorError4;

              case 147:
                return _context.finish(144);

              case 148:
                return _context.finish(141);

              case 149:
                /*
                * MESHES
                */
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context.prev = 152;
                _iterator5 = this.attrs.meshes[Symbol.iterator]();

              case 154:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context.next = 187;
                  break;
                }

                mesh = _step5.value;
                mesh.id = mesh.id || uuidv1();

                if (!this.context.getElements("#" + mesh.id)[0]) {
                  _context.next = 159;
                  break;
                }

                throw "This id ".concat(mesh.id, " is already in use.");

              case 159:
                this.initializeMesh(mesh);
                geometry = _construct(THREE[mesh.geometry.type], _toConsumableArray(mesh.geometry.parameters));
                material = _construct(THREE[mesh.material.type], _toConsumableArray(mesh.material.parameters));
                mesh.object = new THREE.Mesh(geometry, material);
                this.context.elements.meshes.push(mesh);
                this.applySettingsToObjects(mesh.settings, mesh.object);
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context.prev = 168;

                for (_iterator10 = this.context.getElements(mesh.scenes)[Symbol.iterator](); !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                  _scene2 = _step10.value;

                  _scene2.object.add(mesh.object);
                }

                _context.next = 176;
                break;

              case 172:
                _context.prev = 172;
                _context.t5 = _context["catch"](168);
                _didIteratorError10 = true;
                _iteratorError10 = _context.t5;

              case 176:
                _context.prev = 176;
                _context.prev = 177;

                if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
                  _iterator10.return();
                }

              case 179:
                _context.prev = 179;

                if (!_didIteratorError10) {
                  _context.next = 182;
                  break;
                }

                throw _iteratorError10;

              case 182:
                return _context.finish(179);

              case 183:
                return _context.finish(176);

              case 184:
                _iteratorNormalCompletion5 = true;
                _context.next = 154;
                break;

              case 187:
                _context.next = 193;
                break;

              case 189:
                _context.prev = 189;
                _context.t6 = _context["catch"](152);
                _didIteratorError5 = true;
                _iteratorError5 = _context.t6;

              case 193:
                _context.prev = 193;
                _context.prev = 194;

                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }

              case 196:
                _context.prev = 196;

                if (!_didIteratorError5) {
                  _context.next = 199;
                  break;
                }

                throw _iteratorError5;

              case 199:
                return _context.finish(196);

              case 200:
                return _context.finish(193);

              case 201:
                /*
                * CSS3DOBJECTS
                */
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context.prev = 204;
                _iterator6 = this.attrs.css3d_objects[Symbol.iterator]();

              case 206:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context.next = 262;
                  break;
                }

                css3d = _step6.value;
                css3d.id = css3d.id || uuidv1();

                if (!this.context.getElements("#" + css3d.id)[0]) {
                  _context.next = 211;
                  break;
                }

                throw "This id ".concat(css3d.id, " is already in use.");

              case 211:
                this.initializeMesh(css3d);
                elements = this.context.rootElement.querySelectorAll(css3d.selector);
                _iteratorNormalCompletion11 = true;
                _didIteratorError11 = false;
                _iteratorError11 = undefined;
                _context.prev = 216;
                _iterator11 = elements[Symbol.iterator]();

              case 218:
                if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                  _context.next = 245;
                  break;
                }

                element = _step11.value;
                css3d.object = new THREE.CSS3DObject(element);
                this.context.elements.css3d_objects.push(css3d);
                this.applySettingsToObjects(css3d.settings, css3d.object);
                _iteratorNormalCompletion12 = true;
                _didIteratorError12 = false;
                _iteratorError12 = undefined;
                _context.prev = 226;

                for (_iterator12 = this.context.getElements(css3d.scenes)[Symbol.iterator](); !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  _scene3 = _step12.value;

                  _scene3.object.add(css3d.object);
                }

                _context.next = 234;
                break;

              case 230:
                _context.prev = 230;
                _context.t7 = _context["catch"](226);
                _didIteratorError12 = true;
                _iteratorError12 = _context.t7;

              case 234:
                _context.prev = 234;
                _context.prev = 235;

                if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
                  _iterator12.return();
                }

              case 237:
                _context.prev = 237;

                if (!_didIteratorError12) {
                  _context.next = 240;
                  break;
                }

                throw _iteratorError12;

              case 240:
                return _context.finish(237);

              case 241:
                return _context.finish(234);

              case 242:
                _iteratorNormalCompletion11 = true;
                _context.next = 218;
                break;

              case 245:
                _context.next = 251;
                break;

              case 247:
                _context.prev = 247;
                _context.t8 = _context["catch"](216);
                _didIteratorError11 = true;
                _iteratorError11 = _context.t8;

              case 251:
                _context.prev = 251;
                _context.prev = 252;

                if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
                  _iterator11.return();
                }

              case 254:
                _context.prev = 254;

                if (!_didIteratorError11) {
                  _context.next = 257;
                  break;
                }

                throw _iteratorError11;

              case 257:
                return _context.finish(254);

              case 258:
                return _context.finish(251);

              case 259:
                _iteratorNormalCompletion6 = true;
                _context.next = 206;
                break;

              case 262:
                _context.next = 268;
                break;

              case 264:
                _context.prev = 264;
                _context.t9 = _context["catch"](204);
                _didIteratorError6 = true;
                _iteratorError6 = _context.t9;

              case 268:
                _context.prev = 268;
                _context.prev = 269;

                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }

              case 271:
                _context.prev = 271;

                if (!_didIteratorError6) {
                  _context.next = 274;
                  break;
                }

                throw _iteratorError6;

              case 274:
                return _context.finish(271);

              case 275:
                return _context.finish(268);

              case 276:
                /*
                * LOADERS
                */
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context.prev = 279;
                _iterator7 = this.attrs.loaders[Symbol.iterator]();

              case 281:
                if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                  _context.next = 300;
                  break;
                }

                loader = _step7.value;
                loader.id = loader.id || uuidv1();

                if (!this.context.getElements("#" + loader.id)[0]) {
                  _context.next = 286;
                  break;
                }

                throw "This id ".concat(loader.id, " is already in use.");

              case 286:
                this.initializeLoader(loader);

                if (THREE[loader.type]) {
                  _context.next = 295;
                  break;
                }

                _context.prev = 288;

                require("three/examples/js/loaders/" + loader.type);

                _context.next = 295;
                break;

              case 292:
                _context.prev = 292;
                _context.t10 = _context["catch"](288);
                throw _context.t10;

              case 295:
                loader.object = new THREE[loader.type]();
                this.context.elements.loaders.push(loader);

              case 297:
                _iteratorNormalCompletion7 = true;
                _context.next = 281;
                break;

              case 300:
                _context.next = 306;
                break;

              case 302:
                _context.prev = 302;
                _context.t11 = _context["catch"](279);
                _didIteratorError7 = true;
                _iteratorError7 = _context.t11;

              case 306:
                _context.prev = 306;
                _context.prev = 307;

                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }

              case 309:
                _context.prev = 309;

                if (!_didIteratorError7) {
                  _context.next = 312;
                  break;
                }

                throw _iteratorError7;

              case 312:
                return _context.finish(309);

              case 313:
                return _context.finish(306);

              case 314:
                /*
                * MODELS
                */
                _iteratorNormalCompletion8 = true;
                _didIteratorError8 = false;
                _iteratorError8 = undefined;
                _context.prev = 317;

                _loop = function _loop() {
                  var model = _step8.value;
                  model.id = model.id || uuidv1();

                  if (_this.context.getElements("#" + model.id)[0]) {
                    throw "This id ".concat(model.id, " is already in use.");
                  }

                  _this.initializeModel(model);

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
                    _this.hasLoaded = true;

                    var material = _construct(THREE[model.material.type], _toConsumableArray(model.material.parameters));

                    model.object = new THREE.Mesh(g, material);

                    _this.applySettingsToObjects(model.settings, model.object);

                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                      for (var _iterator13 = _this.context.getElements(model.scenes)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var _scene4 = _step13.value;

                        _scene4.object.add(model.object);
                      }
                    } catch (err) {
                      _didIteratorError13 = true;
                      _iteratorError13 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
                          _iterator13.return();
                        }
                      } finally {
                        if (_didIteratorError13) {
                          throw _iteratorError13;
                        }
                      }
                    }

                    setTimeout(function () {
                      _this.context.loading.splice(0, 1);

                      if (_this.context.loading.length === 0) {
                        _this._thisClip.contextLoaded();
                      }
                    }, 2000);
                  });

                  _this.context.loading.push(1);

                  if (_this.context.loading.length === 1 && !_this.hasLoaded) {
                    _this._thisClip.contextLoading();
                  } // create pseudo point as element


                  var geometry = new THREE.BufferGeometry();
                  var material = new THREE.PointsMaterial();
                  var pseudoModel = new THREE.Points(geometry, material);
                  pseudoModel.name = model.id;
                  model.object = pseudoModel; //

                  _this.applySettingsToObjects(model.settings, model.object);

                  _this.context.elements.models.push(model);
                };

                for (_iterator8 = this.attrs.models[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  _loop();
                }
                /*
                * CONTROLS
                */


                _context.next = 326;
                break;

              case 322:
                _context.prev = 322;
                _context.t12 = _context["catch"](317);
                _didIteratorError8 = true;
                _iteratorError8 = _context.t12;

              case 326:
                _context.prev = 326;
                _context.prev = 327;

                if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                  _iterator8.return();
                }

              case 329:
                _context.prev = 329;

                if (!_didIteratorError8) {
                  _context.next = 332;
                  break;
                }

                throw _iteratorError8;

              case 332:
                return _context.finish(329);

              case 333:
                return _context.finish(326);

              case 334:
                if (this.attrs.controls) {
                  if (this.attrs.controls.appplyTo) {
                    applyElement = this.attrs.controls.applyTo;
                  } else {
                    applyElement = this.context.rootElement;
                  }

                  this.context.elements.controls[0] = new THREE.OrbitControls(this.context.getElements(this.attrs.controls.cameraId)[0].object, applyElement);
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

              case 335:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 22, 26, 34], [27,, 29, 33], [37, 53, 57, 65], [58,, 60, 64], [68, 86, 90, 98], [91,, 93, 97], [101, 137, 141, 149], [116, 120, 124, 132], [125,, 127, 131], [142,, 144, 148], [152, 189, 193, 201], [168, 172, 176, 184], [177,, 179, 183], [194,, 196, 200], [204, 264, 268, 276], [216, 247, 251, 259], [226, 230, 234, 242], [235,, 237, 241], [252,, 254, 258], [269,, 271, 275], [279, 302, 306, 314], [288, 292], [307,, 309, 313], [317, 322, 326, 334], [327,, 329, 333]]);
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
        var far = 1000;
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
      camera.settings.position.z = camera.settings.position.z || 1000;
      camera.settings.lookAt = camera.settings.lookAt || [0, 0, 0];
    }
  }, {
    key: "initializeRenderer",
    value: function initializeRenderer(renderer) {
      renderer.settings = renderer.settings || {};
      renderer.settings.type = renderer.settings.type || "WebGLRenderer";
      renderer.parameters = renderer.parameters || [{}];

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

      if (light.settings.type === "SpotLight") {
        light.parameters = light.parameters || [0xffffff, 1];
        light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 700, 500));
        light.shadow.bias = 0.0001;
      } else if (light.settings.type === "DirectionalLight") {
        light.parameters = light.parameters || [0xffffff, 1, 100];
      } else if (light.setting.type === "PointLight") {
        light.parameters = light.parameters || [0xffffff, 1, 100];
      }
    }
  }, {
    key: "initializeMesh",
    value: function initializeMesh(mesh) {
      mesh.settings = mesh.settings || {};
      mesh.settings.position = mesh.settings.position || {};
      mesh.settings.position.x = mesh.settings.position.x || 0;
      mesh.settings.position.y = mesh.settings.position.y || 0;
      mesh.settings.position.z = mesh.settings.position.z || 0;
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