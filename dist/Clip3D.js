"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MC = require("@kissmybutton/motorcortex");
global.THREE = require("three");
require("three/examples/js/renderers/CSS3DRenderer");
require("three/examples/js/controls/OrbitControls");

// const Helper = MC.Helper;
var helper = new MC.Helper();
var ExtendableClip = MC.ExtendableClip;
var conf = MC.conf;
var Iframe3DContextHandler = require("./Iframe3DContextHandler");
var promise = Promise;

var Clip3D = function (_ExtendableClip) {
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
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Clip3D);

    var _this = _possibleConstructorReturn(this, (Clip3D.__proto__ || Object.getPrototypeOf(Clip3D)).call(this, attrs, props));

    _this.props = props;
    _this.props.selector = "";
    _this.props.css = "";

    var checks = _this.runChecks(attrs, props);

    if (!checks) {
      var _ret;

      return _ret = false, _possibleConstructorReturn(_this, _ret);
    }

    var ContextHanlder = null;
    if (conf.selfContainedContextHandler === "iframe") {
      ContextHanlder = Iframe3DContextHandler;
    }

    var contextHanlder = new ContextHanlder(props);

    _this.ownContext = contextHanlder.context;
    _this.isTheClip = true;

    _this.attrs = JSON.parse(JSON.stringify(attrs));

    _this.ownContext.elements = {
      lights: [],
      cameras: [],
      scenes: [],
      renderers: [],
      models: [],
      meshes: [],
      css3d_objects: [],
      loaders: [],
      renders: _this.attrs.renders,
      mixers: [],
      controls: [],
      rn: Math.random().toFixed(2)
    };

    _this.init(attrs, props);
    _this.ownContext.window.addEventListener("resize", function () {
      for (var i in _this.ownContext.elements.cameras) {
        _this.ownContext.elements.cameras[i].object.aspect = _this.ownContext.window.innerWidth / _this.ownContext.window.innerHeight;

        _this.ownContext.elements.cameras[i].object.updateProjectionMatrix();
      }
      for (var _i in _this.ownContext.elements.renderers) {
        _this.ownContext.elements.renderers[_i].object.setSize(_this.ownContext.window.innerWidth, _this.ownContext.window.innerHeight);
      }
      // render the scene
      for (var _i2 in _this.attrs.renders) {
        _this.ownContext.getElements(_this.attrs.renders[_i2].renderer)[0].object.render(_this.ownContext.getElements(_this.attrs.renders[_i2].scene)[0].object, _this.ownContext.getElements(_this.attrs.renders[_i2].camera)[0].object);
      }
    });
    return _this;
  }

  _createClass(Clip3D, [{
    key: "init",
    value: async function init(attrs, props) {
      var _this2 = this;

      /*
          * CAMERAS
          */

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = attrs.cameras[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var camera = _step.value;

          if (this.context.getElements("#" + camera.id)[0]) {
            throw "This id " + camera.id + " is already in use.";
          }
          this.initializeCamera(camera);
          var type = camera.settings.type;

          this.ownContext.elements.cameras.push({
            id: camera.id,
            // mcid: camera.id,
            groups: camera.groups,
            settings: camera.settings,
            object: new (Function.prototype.bind.apply(THREE[type], [null].concat(_toConsumableArray(camera.parameters))))()
          });

          var length = this.ownContext.elements.cameras.length - 1;
          var cameraObj = this.ownContext.elements.cameras[length].object;

          this.applySettingsToObjects(camera.settings, cameraObj);
          cameraObj.updateProjectionMatrix();
        }

        /*
            * SCENES
            */
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = attrs.scenes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var scene = _step2.value;

          if (this.context.getElements("#" + scene.id)[0]) {
            throw "This id " + scene.id + " is already in use.";
          }
          this.ownContext.elements.scenes.push({
            id: scene.id,
            // mcid: scene.id,
            groups: scene.groups,
            object: new THREE.Scene()
          });

          var _length = this.ownContext.elements.scenes.length - 1;
          var sceneObj = this.ownContext.elements.scenes[_length].object;
          if (scene.settings.fog) {
            sceneObj.fog = scene.settings.fog;
          }
        }

        /*
            * RENDERERS
            */
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = attrs.renderers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var renderer = _step3.value;

          if (this.context.getElements("#" + renderer.id)[0]) {
            throw "This id " + renderer.id + " is already in use.";
          }
          this.initializeRenderer(renderer);
          var type = renderer.settings.type;

          this.ownContext.elements.renderers.push({
            id: renderer.id,
            // mcid: renderer.id,
            groups: renderer.groups,
            object: new (Function.prototype.bind.apply(THREE[type], [null].concat(_toConsumableArray(renderer.parameters))))()
          });

          var _length2 = this.ownContext.elements.renderers.length - 1;
          var rendererObj = this.ownContext.elements.renderers[_length2].object;
          this.applySettingsToObjects(renderer.settings, rendererObj);
        }

        /*
            * LIGHTS
            */
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = attrs.lights[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var light = _step4.value;

          if (this.context.getElements("#" + light.id)[0]) {
            throw "This id " + light.id + " is already in use.";
          }
          this.initializeLight(light);

          this.ownContext.elements.lights.push({
            id: light.id,
            // mcid: light.id,
            groups: light.groups,
            object: new (Function.prototype.bind.apply(THREE[light.settings.type], [null].concat(_toConsumableArray(light.parameters))))()
          });

          var _length3 = this.ownContext.elements.lights.length - 1;

          var lightObj = this.ownContext.elements.lights[_length3].object;

          this.applySettingsToObjects(light.settings, lightObj);

          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = this.ownContext.getElements(light.applyToSelector)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var _scene = _step9.value;

              _scene.object.add(lightObj);
            }
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }
        }

        /*
            * MESHES
            */
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = attrs.meshes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var mesh = _step5.value;

          if (this.context.getElements("#" + mesh.id)[0]) {
            throw "This id " + mesh.id + " is already in use.";
          }
          this.initializeMesh(mesh);
          // mesh.mcid = mesh.id;
          var geometry = new (Function.prototype.bind.apply(THREE[mesh.geometry.type], [null].concat(_toConsumableArray(mesh.geometry.parameters))))();
          var material = new (Function.prototype.bind.apply(THREE[mesh.material.type], [null].concat(_toConsumableArray(mesh.material.parameters))))();
          mesh.object = new THREE.Mesh(geometry, material);

          this.ownContext.elements.meshes.push(mesh);

          this.applySettingsToObjects(mesh.settings, mesh.object);

          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = this.ownContext.getElements(mesh.scenes)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var _scene2 = _step10.value;

              _scene2.object.add(mesh.object);
            }
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10.return) {
                _iterator10.return();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }
        }

        /*
            * CSS3DOBJECTS
            */
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = attrs.css3d_objects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var css3d = _step6.value;

          if (this.context.getElements("#" + css3d.id)[0]) {
            throw "This id " + css3d.id + " is already in use.";
          }
          this.initializeMesh(css3d);
          // css3d.mcid = css3d.id;
          var elements = this.ownContext.document.querySelectorAll(css3d.selector);
          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = elements[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
              var element = _step11.value;

              css3d.object = new THREE.CSS3DObject(element);
              this.ownContext.elements.css3d_objects.push(css3d);

              this.applySettingsToObjects(css3d.settings, css3d.object);

              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = this.ownContext.getElements(css3d.scenes)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var _scene3 = _step12.value;

                  _scene3.object.add(css3d.object);
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
              }
            } finally {
              if (_didIteratorError11) {
                throw _iteratorError11;
              }
            }
          }
        }

        /*
            * LOADERS
            */
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = attrs.loaders[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var loader = _step7.value;

          if (this.context.getElements("#" + loader.id)[0]) {
            throw "This id " + loader.id + " is already in use.";
          }
          this.initializeLoader(loader);
          // loader.mcid = loader.id;
          if (!THREE[loader.type]) {
            try {
              require("three/examples/js/loaders/" + loader.type);
            } catch (e) {
              throw e;
            }
          }

          loader.object = new THREE[loader.type]();
          this.ownContext.elements.loaders.push(loader);
        }

        /*
            * MODELS
            */
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        var _loop = async function _loop() {
          var model = _step8.value;

          if (_this2.context.getElements("#" + model.id)[0]) {
            throw "This id " + model.id + " is already in use.";
          }
          _this2.initializeModel(model);
          // model.mcid = model.id
          var loader = _this2.ownContext.getElements(model.loader)[0];

          var loadGeometry = function loadGeometry() {
            return new promise(function (resolve) {
              var _loader$object;

              loader.parameters[0] = model.file;
              loader.parameters[1] = resolve;

              (_loader$object = loader.object).load.apply(_loader$object, _toConsumableArray(loader.parameters));
            });
          };

          try {
            var _geometry = await loadGeometry();
            var _material = new (Function.prototype.bind.apply(THREE[model.material.type], [null].concat(_toConsumableArray(model.material.parameters))))();
            var _mesh = new THREE.Mesh(_geometry, _material);

            model.object = _mesh;
            _this2.applySettingsToObjects(model.settings, model.object);
            _this2.ownContext.elements.models.push(model);

            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
              for (var _iterator13 = _this2.ownContext.getElements(model.scenes)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                var _scene4 = _step13.value;

                _scene4.object.add(model.object);
              }
            } catch (err) {
              _didIteratorError13 = true;
              _iteratorError13 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion13 && _iterator13.return) {
                  _iterator13.return();
                }
              } finally {
                if (_didIteratorError13) {
                  throw _iteratorError13;
                }
              }
            }

            _this2.flashDOM();
          } catch (e) {
            throw e;
          }
        };

        for (var _iterator8 = attrs.models[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          await _loop();
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      if (attrs.controls && !props.isPreviewClip) {
        var applyElement = void 0;
        if (attrs.controls.applyToPlayer) {
          applyElement = this.props.host.getElementsByClassName("pointer-event-panel")[0];
        } else if (attrs.controls.appplyTo) {
          applyElement = attrs.controls.applyTo;
        } else {
          applyElement = this.props.host;
        }
        this.ownContext.elements.controls[0] = new THREE.OrbitControls(this.ownContext.getElements(attrs.controls.cameraId)[0].object, applyElement);
        this.ownContext.elements.controls[0].enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.ownContext.elements.controls[0].dampingFactor = 0.5;
        this.ownContext.elements.controls[0].screenSpacePanning = false;
        this.ownContext.elements.controls[0].minDistance = 1;
        this.ownContext.elements.controls[0].maxDistance = 1000;
        this.ownContext.elements.controls[0].maxPolarAngle = Math.PI / 2;

        var render = function render() {
          if ((((_this2.context.elements.controls[0] || {}).domElement || {}).style || {}).pointerEvents === "none") {
            return;
          }

          for (var i in _this2.attrs.renders) {
            _this2.ownContext.getElements(_this2.attrs.renders[i].renderer)[0].object.render(_this2.ownContext.getElements(_this2.attrs.renders[i].scene)[0].object, _this2.ownContext.getElements(_this2.attrs.renders[i].camera)[0].object);
          }
        };
        var animate = function animate() {
          requestAnimationFrame(animate);
          _this2.ownContext.elements.controls[0].update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
          render();
        };
        animate();
      }

      this.render();
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
  }, {
    key: "_getChannel",
    value: function _getChannel(channelId) {
      if (!this.instantiatedChannels.hasOwnProperty(channelId)) {
        return null;
      } else {
        return this.instantiatedChannels[channelId];
      }
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
    key: "initializeCamera",
    value: function initializeCamera(camera) {
      camera.settings = camera.settings || {};
      camera.settings.type = camera.settings.type || "PerspectiveCamera";
      camera.parameters = camera.parameters || {};
      if (camera.settings.type === "PerspectiveCamera") {
        var fov = 45;
        var aspect = this.ownContext.window.innerWidth / this.ownContext.window.innerHeight;
        var near = 1;
        var far = 1000;
        camera.parameters = [fov, aspect, near, far];
      } else {
        var left = this.ownContext.window.innerWidth / -2;
        var right = this.ownContext.window.innerWidth / 2;
        var top = this.ownContext.window.innerHeight / 2;
        var bottom = this.ownContext.window.innerHeight / -2;
        var _near = 1;
        var _far = 1000;
        camera.parameters = [left, right, top, bottom, _near, _far];
      }
      camera.settings.position = camera.settings.position || {};
      camera.settings.position.x = camera.settings.position.x || 0;
      camera.settings.position.y = camera.settings.position.y || 0;
      camera.settings.position.z = camera.settings.position.z || 1000;
      // if (!camera.settings.lookAt) {
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
        renderer.settings.setPixelRatio = renderer.settings.setPixelRatio || [this.ownContext.window.devicePixelRatio];
      }

      renderer.settings.setSize = renderer.settings.setSize || [this.ownContext.window.innerWidth, this.ownContext.window.innerHeight];
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
        loader.parameters.push(null, null, function () /*xhr*/{
          // console.log((xhr.loaded / xhr.total) * 100 + "%loaded");
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
    key: "runChecks",
    value: function runChecks(attrs, props) {
      if (!helper.isObject(props)) {
        helper.error("Self Contained Incident expects an object on its                 second argument on the constructor. " + (typeof props === "undefined" ? "undefined" : _typeof(props)) + " passed");
        return false;
      }

      if (!props.hasOwnProperty("id")) {
        helper.error("Self Contained Incident expects the 'id' key on its                 constructor properties which is missing");
        return false;
      }

      if (!props.hasOwnProperty("host")) {
        helper.error("Self Contained Incident expects the 'host' key on its             constructor properties which is missing");
        return false;
      }

      if (!props.hasOwnProperty("containerParams")) {
        helper.error("Self Contained Incident expects the 'containerParams'             key on its constructor properties which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("scenes")) {
        helper.error("Self Contained Incident expects the 'scenes' key on             its constructor attributes which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("lights")) {
        helper.error("Self Contained Incident expects the 'lights' key on                 its constructor attributes which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("cameras")) {
        helper.error("Self Contained Incident expects the 'cameras' key on                 its constructor attributes which is missing");
        return false;
      }

      if (!attrs.hasOwnProperty("renderers")) {
        helper.error("Self Contained Incident expects the 'renderers' key                 on its constructor attributes which is missing");
        return false;
      }
      return true;
    }
  }, {
    key: "lastWish",
    value: function lastWish() {
      this.ownContext.unmount();
    }
  }]);

  return Clip3D;
}(ExtendableClip);

module.exports = Clip3D;