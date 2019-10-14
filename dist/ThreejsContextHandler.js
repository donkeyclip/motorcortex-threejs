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

var ThreejsContextHandler =
/*#__PURE__*/
function () {
  function ThreejsContextHandler(attrs, props, _thisClip) {
    _classCallCheck(this, ThreejsContextHandler);

    // initialisation of the final audio resources colleciton
    this.props = JSON.parse(JSON.stringify(props));
    this.attrs = JSON.parse(JSON.stringify(attrs));
    this._thisClip = _thisClip;
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
    this.init(attrs, props);
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
      var key = "groups"; // console.log("in context handler",selector)

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
      } // console.log(elements)


      return elements;
    }
  }, {
    key: "getMCID",
    value: function getMCID(element) {
      // console.log("in getElement", element)
      return element.id;
    }
  }, {
    key: "setMCID",
    value: function setMCID(element
    /*, mcid*/
    ) {
      // console.log("in set element", element, mcid)
      element.mcid = element.id;
    }
  }, {
    key: "getElementSelectorByMCID",
    value: function getElementSelectorByMCID(mcid) {
      // console.log("in get selector",mcid)
      for (var prop in this.context.elements) {
        for (var element in this.context.elements[prop]) {
          // console.log(this.context.elements[prop][element])
          if (this.context.elements[prop][element].id === mcid) {
            // console.log(mcid)
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
      regeneratorRuntime.mark(function _callee(attrs, props) {
        var _this = this;

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, camera, type, length, cameraObj, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, scene, _length, sceneObj, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, renderer, _length2, rendererObj, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, light, _length3, lightObj, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _scene, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, mesh, geometry, material, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _scene2, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, css3d, elements, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, element, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, _scene3, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, loader, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _loop, _iterator8, _step8;

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
                _iterator = attrs.cameras[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 19;
                  break;
                }

                camera = _step.value;

                if (!this.context.getElements("#" + camera.id)[0]) {
                  _context.next = 9;
                  break;
                }

                throw "This id " + camera.id + " is already in use.";

              case 9:
                this.initializeCamera(camera);
                type = camera.settings.type;
                this.context.elements.cameras.push({
                  id: camera.id,
                  // mcid: camera.id,
                  groups: camera.groups,
                  settings: camera.settings,
                  object: _construct(THREE[type], _toConsumableArray(camera.parameters))
                });
                length = this.context.elements.cameras.length - 1;
                cameraObj = this.context.elements.cameras[length].object;
                this.applySettingsToObjects(camera.settings, cameraObj);
                cameraObj.updateProjectionMatrix();

              case 16:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 25:
                _context.prev = 25;
                _context.prev = 26;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 28:
                _context.prev = 28;

                if (!_didIteratorError) {
                  _context.next = 31;
                  break;
                }

                throw _iteratorError;

              case 31:
                return _context.finish(28);

              case 32:
                return _context.finish(25);

              case 33:
                /*
                    * SCENES
                    */
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 36;
                _iterator2 = attrs.scenes[Symbol.iterator]();

              case 38:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 49;
                  break;
                }

                scene = _step2.value;

                if (!this.context.getElements("#" + scene.id)[0]) {
                  _context.next = 42;
                  break;
                }

                throw "This id " + scene.id + " is already in use.";

              case 42:
                this.context.elements.scenes.push({
                  id: scene.id,
                  // mcid: scene.id,
                  groups: scene.groups,
                  object: new THREE.Scene()
                });
                _length = this.context.elements.scenes.length - 1;
                sceneObj = this.context.elements.scenes[_length].object;

                if (scene.settings.fog) {
                  sceneObj.fog = scene.settings.fog;
                }

              case 46:
                _iteratorNormalCompletion2 = true;
                _context.next = 38;
                break;

              case 49:
                _context.next = 55;
                break;

              case 51:
                _context.prev = 51;
                _context.t1 = _context["catch"](36);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t1;

              case 55:
                _context.prev = 55;
                _context.prev = 56;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 58:
                _context.prev = 58;

                if (!_didIteratorError2) {
                  _context.next = 61;
                  break;
                }

                throw _iteratorError2;

              case 61:
                return _context.finish(58);

              case 62:
                return _context.finish(55);

              case 63:
                /*
                    * RENDERERS
                    */
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context.prev = 66;
                _iterator3 = attrs.renderers[Symbol.iterator]();

              case 68:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context.next = 81;
                  break;
                }

                renderer = _step3.value;

                if (!this.context.getElements("#" + renderer.id)[0]) {
                  _context.next = 72;
                  break;
                }

                throw "This id " + renderer.id + " is already in use.";

              case 72:
                this.initializeRenderer(renderer);
                type = renderer.settings.type;
                this.context.elements.renderers.push({
                  id: renderer.id,
                  // mcid: renderer.id,
                  groups: renderer.groups,
                  object: _construct(THREE[type], _toConsumableArray(renderer.parameters))
                });
                _length2 = this.context.elements.renderers.length - 1;
                rendererObj = this.context.elements.renderers[_length2].object;
                this.applySettingsToObjects(renderer.settings, rendererObj);

              case 78:
                _iteratorNormalCompletion3 = true;
                _context.next = 68;
                break;

              case 81:
                _context.next = 87;
                break;

              case 83:
                _context.prev = 83;
                _context.t2 = _context["catch"](66);
                _didIteratorError3 = true;
                _iteratorError3 = _context.t2;

              case 87:
                _context.prev = 87;
                _context.prev = 88;

                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }

              case 90:
                _context.prev = 90;

                if (!_didIteratorError3) {
                  _context.next = 93;
                  break;
                }

                throw _iteratorError3;

              case 93:
                return _context.finish(90);

              case 94:
                return _context.finish(87);

              case 95:
                /*
                    * LIGHTS
                    */
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context.prev = 98;
                _iterator4 = attrs.lights[Symbol.iterator]();

              case 100:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context.next = 131;
                  break;
                }

                light = _step4.value;

                if (!this.context.getElements("#" + light.id)[0]) {
                  _context.next = 104;
                  break;
                }

                throw "This id " + light.id + " is already in use.";

              case 104:
                this.initializeLight(light);
                this.context.elements.lights.push({
                  id: light.id,
                  // mcid: light.id,
                  groups: light.groups,
                  object: _construct(THREE[light.settings.type], _toConsumableArray(light.parameters))
                });
                _length3 = this.context.elements.lights.length - 1;
                lightObj = this.context.elements.lights[_length3].object;
                this.applySettingsToObjects(light.settings, lightObj);
                _iteratorNormalCompletion9 = true;
                _didIteratorError9 = false;
                _iteratorError9 = undefined;
                _context.prev = 112;

                for (_iterator9 = this.context.getElements(light.applyToSelector)[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  _scene = _step9.value;

                  _scene.object.add(lightObj);
                }

                _context.next = 120;
                break;

              case 116:
                _context.prev = 116;
                _context.t3 = _context["catch"](112);
                _didIteratorError9 = true;
                _iteratorError9 = _context.t3;

              case 120:
                _context.prev = 120;
                _context.prev = 121;

                if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                  _iterator9.return();
                }

              case 123:
                _context.prev = 123;

                if (!_didIteratorError9) {
                  _context.next = 126;
                  break;
                }

                throw _iteratorError9;

              case 126:
                return _context.finish(123);

              case 127:
                return _context.finish(120);

              case 128:
                _iteratorNormalCompletion4 = true;
                _context.next = 100;
                break;

              case 131:
                _context.next = 137;
                break;

              case 133:
                _context.prev = 133;
                _context.t4 = _context["catch"](98);
                _didIteratorError4 = true;
                _iteratorError4 = _context.t4;

              case 137:
                _context.prev = 137;
                _context.prev = 138;

                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }

              case 140:
                _context.prev = 140;

                if (!_didIteratorError4) {
                  _context.next = 143;
                  break;
                }

                throw _iteratorError4;

              case 143:
                return _context.finish(140);

              case 144:
                return _context.finish(137);

              case 145:
                /*
                    * MESHES
                    */
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context.prev = 148;
                _iterator5 = attrs.meshes[Symbol.iterator]();

              case 150:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context.next = 182;
                  break;
                }

                mesh = _step5.value;

                if (!this.context.getElements("#" + mesh.id)[0]) {
                  _context.next = 154;
                  break;
                }

                throw "This id " + mesh.id + " is already in use.";

              case 154:
                this.initializeMesh(mesh); // mesh.mcid = mesh.id;

                geometry = _construct(THREE[mesh.geometry.type], _toConsumableArray(mesh.geometry.parameters));
                material = _construct(THREE[mesh.material.type], _toConsumableArray(mesh.material.parameters));
                mesh.object = new THREE.Mesh(geometry, material);
                this.context.elements.meshes.push(mesh);
                this.applySettingsToObjects(mesh.settings, mesh.object);
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context.prev = 163;

                for (_iterator10 = this.context.getElements(mesh.scenes)[Symbol.iterator](); !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                  _scene2 = _step10.value;

                  _scene2.object.add(mesh.object);
                }

                _context.next = 171;
                break;

              case 167:
                _context.prev = 167;
                _context.t5 = _context["catch"](163);
                _didIteratorError10 = true;
                _iteratorError10 = _context.t5;

              case 171:
                _context.prev = 171;
                _context.prev = 172;

                if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
                  _iterator10.return();
                }

              case 174:
                _context.prev = 174;

                if (!_didIteratorError10) {
                  _context.next = 177;
                  break;
                }

                throw _iteratorError10;

              case 177:
                return _context.finish(174);

              case 178:
                return _context.finish(171);

              case 179:
                _iteratorNormalCompletion5 = true;
                _context.next = 150;
                break;

              case 182:
                _context.next = 188;
                break;

              case 184:
                _context.prev = 184;
                _context.t6 = _context["catch"](148);
                _didIteratorError5 = true;
                _iteratorError5 = _context.t6;

              case 188:
                _context.prev = 188;
                _context.prev = 189;

                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }

              case 191:
                _context.prev = 191;

                if (!_didIteratorError5) {
                  _context.next = 194;
                  break;
                }

                throw _iteratorError5;

              case 194:
                return _context.finish(191);

              case 195:
                return _context.finish(188);

              case 196:
                /*
                    * CSS3DOBJECTS
                    */
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context.prev = 199;
                _iterator6 = attrs.css3d_objects[Symbol.iterator]();

              case 201:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context.next = 256;
                  break;
                }

                css3d = _step6.value;

                if (!this.context.getElements("#" + css3d.id)[0]) {
                  _context.next = 205;
                  break;
                }

                throw "This id " + css3d.id + " is already in use.";

              case 205:
                this.initializeMesh(css3d); // css3d.mcid = css3d.id;

                elements = this.context.rootElement.querySelectorAll(css3d.selector);
                _iteratorNormalCompletion11 = true;
                _didIteratorError11 = false;
                _iteratorError11 = undefined;
                _context.prev = 210;
                _iterator11 = elements[Symbol.iterator]();

              case 212:
                if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                  _context.next = 239;
                  break;
                }

                element = _step11.value;
                css3d.object = new THREE.CSS3DObject(element);
                this.context.elements.css3d_objects.push(css3d);
                this.applySettingsToObjects(css3d.settings, css3d.object);
                _iteratorNormalCompletion12 = true;
                _didIteratorError12 = false;
                _iteratorError12 = undefined;
                _context.prev = 220;

                for (_iterator12 = this.context.getElements(css3d.scenes)[Symbol.iterator](); !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  _scene3 = _step12.value;

                  _scene3.object.add(css3d.object);
                }

                _context.next = 228;
                break;

              case 224:
                _context.prev = 224;
                _context.t7 = _context["catch"](220);
                _didIteratorError12 = true;
                _iteratorError12 = _context.t7;

              case 228:
                _context.prev = 228;
                _context.prev = 229;

                if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
                  _iterator12.return();
                }

              case 231:
                _context.prev = 231;

                if (!_didIteratorError12) {
                  _context.next = 234;
                  break;
                }

                throw _iteratorError12;

              case 234:
                return _context.finish(231);

              case 235:
                return _context.finish(228);

              case 236:
                _iteratorNormalCompletion11 = true;
                _context.next = 212;
                break;

              case 239:
                _context.next = 245;
                break;

              case 241:
                _context.prev = 241;
                _context.t8 = _context["catch"](210);
                _didIteratorError11 = true;
                _iteratorError11 = _context.t8;

              case 245:
                _context.prev = 245;
                _context.prev = 246;

                if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
                  _iterator11.return();
                }

              case 248:
                _context.prev = 248;

                if (!_didIteratorError11) {
                  _context.next = 251;
                  break;
                }

                throw _iteratorError11;

              case 251:
                return _context.finish(248);

              case 252:
                return _context.finish(245);

              case 253:
                _iteratorNormalCompletion6 = true;
                _context.next = 201;
                break;

              case 256:
                _context.next = 262;
                break;

              case 258:
                _context.prev = 258;
                _context.t9 = _context["catch"](199);
                _didIteratorError6 = true;
                _iteratorError6 = _context.t9;

              case 262:
                _context.prev = 262;
                _context.prev = 263;

                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }

              case 265:
                _context.prev = 265;

                if (!_didIteratorError6) {
                  _context.next = 268;
                  break;
                }

                throw _iteratorError6;

              case 268:
                return _context.finish(265);

              case 269:
                return _context.finish(262);

              case 270:
                /*
                    * LOADERS
                    */
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context.prev = 273;
                _iterator7 = attrs.loaders[Symbol.iterator]();

              case 275:
                if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                  _context.next = 294;
                  break;
                }

                loader = _step7.value;

                if (!this.context.getElements("#" + loader.id)[0]) {
                  _context.next = 279;
                  break;
                }

                throw "This id " + loader.id + " is already in use.";

              case 279:
                this.initializeLoader(loader); // loader.mcid = loader.id;

                if (THREE[loader.type]) {
                  _context.next = 289;
                  break;
                }

                _context.prev = 281;

                require("three/examples/js/loaders/" + loader.type);

                _context.next = 289;
                break;

              case 285:
                _context.prev = 285;
                _context.t10 = _context["catch"](281);
                console.log(_context.t10);
                throw _context.t10;

              case 289:
                loader.object = new THREE[loader.type]();
                this.context.elements.loaders.push(loader);

              case 291:
                _iteratorNormalCompletion7 = true;
                _context.next = 275;
                break;

              case 294:
                _context.next = 300;
                break;

              case 296:
                _context.prev = 296;
                _context.t11 = _context["catch"](273);
                _didIteratorError7 = true;
                _iteratorError7 = _context.t11;

              case 300:
                _context.prev = 300;
                _context.prev = 301;

                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }

              case 303:
                _context.prev = 303;

                if (!_didIteratorError7) {
                  _context.next = 306;
                  break;
                }

                throw _iteratorError7;

              case 306:
                return _context.finish(303);

              case 307:
                return _context.finish(300);

              case 308:
                /*
                    * MODELS
                    */
                _iteratorNormalCompletion8 = true;
                _didIteratorError8 = false;
                _iteratorError8 = undefined;
                _context.prev = 311;

                _loop = function _loop() {
                  var model = _step8.value;

                  if (_this.context.getElements("#" + model.id)[0]) {
                    throw "This id " + model.id + " is already in use.";
                  }

                  _this.initializeModel(model); // model.mcid = model.id


                  var loader = _this.context.getElements(model.loader)[0];

                  var loadGeometry = function loadGeometry() {
                    return new promise(function (resolve) {
                      var _loader$object;

                      loader.parameters[0] = model.file;
                      loader.parameters[1] = resolve;

                      (_loader$object = loader.object).load.apply(_loader$object, _toConsumableArray(loader.parameters));
                    });
                  };

                  try {
                    loadGeometry().then(function (g) {
                      var material = _construct(THREE[model.material.type], _toConsumableArray(model.material.parameters));

                      model.object = new THREE.Mesh(g, material);

                      _this.applySettingsToObjects(model.settings, model.object); // const theElement = this.context.getElements("#" + model.id)[0];
                      // console.log("asdf", theElement);
                      // theElement.object = mesh;


                      var _iteratorNormalCompletion13 = true;
                      var _didIteratorError13 = false;
                      var _iteratorError13 = undefined;

                      try {
                        for (var _iterator13 = _this.context.getElements(model.scenes)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                          var _scene4 = _step13.value;

                          var selectedObject = _scene4.object.getObjectByName(model.id); // scene.object.remove(model.object);


                          _scene4.object.add(model.object);
                        } // setTimeout(() => {

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

                      _this.context.loading.splice(0, 1);

                      if (_this.context.loading.length === 0) {
                        _this._thisClip.unblock();
                      } // }, 2000);

                    });

                    _this.context.loading.push(1); // create pseudo point as element


                    var _geometry = new THREE.BufferGeometry();

                    var _material = new THREE.PointsMaterial();

                    pseudoModel = new THREE.Points(_geometry, _material);
                    pseudoModel.name = model.id;
                    model.object = pseudoModel; //

                    _this.applySettingsToObjects(model.settings, model.object);

                    _this.context.elements.models.push(model); // for (const scene of this.context.getElements(model.scenes)) {
                    //   scene.object.add(model.object);
                    // }

                  } catch (e) {
                    console.log(e);
                    throw e;
                  }
                };

                for (_iterator8 = attrs.models[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  _loop();
                }
                /*
                    * CONTROLS
                    */
                // if (attrs.controls) {
                //   let applyElement;
                //   if (attrs.controls.applyToPlayer) {
                //     applyElement = this.props.host.getElementsByClassName(
                //       "pointer-event-panel"
                //     )[0];
                //   } else if (attrs.controls.appplyTo) {
                //     applyElement = attrs.controls.applyTo;
                //   } else {
                //     applyElement = this.props.host;
                //   }
                //   console.log("controls", this);
                //   this.context.elements.controls[0] = new THREE.OrbitControls(
                //     this.context.getElements(attrs.controls.cameraId)[0].object,
                //     applyElement
                //   );
                //   this.context.elements.controls[0].enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
                //   this.context.elements.controls[0].dampingFactor = 0.5;
                //   this.context.elements.controls[0].screenSpacePanning = false;
                //   this.context.elements.controls[0].minDistance = 1;
                //   this.context.elements.controls[0].maxDistance = 1000;
                //   this.context.elements.controls[0].maxPolarAngle = Math.PI / 2;
                //   const render = () => {
                //     if (
                //       (
                //         ((this.context.elements.controls[0] || {}).domElement || {})
                //           .style || {}
                //       ).pointerEvents === "none"
                //     ) {
                //       return;
                //     }
                //     for (const i in this.attrs.renders) {
                //       this.context
                //         .getElements(this.attrs.renders[i].renderer)[0]
                //         .object.render(
                //           this.context.getElements(this.attrs.renders[i].scene)[0].object,
                //           this.context.getElements(this.attrs.renders[i].camera)[0].object
                //         );
                //     }
                //   };
                //   const animate = () => {
                //     requestAnimationFrame(animate);
                //     this.context.elements.controls[0].update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
                //     render();
                //   };
                //   animate();
                // }


                _context.next = 320;
                break;

              case 316:
                _context.prev = 316;
                _context.t12 = _context["catch"](311);
                _didIteratorError8 = true;
                _iteratorError8 = _context.t12;

              case 320:
                _context.prev = 320;
                _context.prev = 321;

                if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                  _iterator8.return();
                }

              case 323:
                _context.prev = 323;

                if (!_didIteratorError8) {
                  _context.next = 326;
                  break;
                }

                throw _iteratorError8;

              case 326:
                return _context.finish(323);

              case 327:
                return _context.finish(320);

              case 328:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 21, 25, 33], [26,, 28, 32], [36, 51, 55, 63], [56,, 58, 62], [66, 83, 87, 95], [88,, 90, 94], [98, 133, 137, 145], [112, 116, 120, 128], [121,, 123, 127], [138,, 140, 144], [148, 184, 188, 196], [163, 167, 171, 179], [172,, 174, 178], [189,, 191, 195], [199, 258, 262, 270], [210, 241, 245, 253], [220, 224, 228, 236], [229,, 231, 235], [246,, 248, 252], [263,, 265, 269], [273, 296, 300, 308], [281, 285], [301,, 303, 307], [311, 316, 320, 328], [321,, 323, 327]]);
      }));

      function init(_x, _x2) {
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
      camera.settings.position.z = camera.settings.position.z || 1000; // if (!camera.settings.lookAt) {
      //     camera.settings.rotation = camera.settings.rotation || {};
      //     camera.settings.rotation.x = camera.settings.rotation.x || 0;
      //     camera.settings.rotation.y = camera.settings.rotation.y || 0;
      //     camera.settings.rotation.z = camera.settings.rotation.z || 0;
      // }

      camera.settings.lookAt = camera.settings.lookAt || [new THREE.Vector3()];
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
          // console.log(error);
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