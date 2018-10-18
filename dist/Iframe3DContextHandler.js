"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
iframe[seamless]{
    background-color: transparent;
    border: 0px none transparent;
    padding: 0px;
    overflow: hidden;
}

might need more work for IE. See here: https://stackoverflow.com/a/29209248
*/
var MC = require("@kissmybutton/motorcortex");
// const MC = require('../motorcortex');

// console.log(MC);

// const Helper = MC.Helper;
var helper = new MC.Helper();
// const Group = MC.Group;
// const conf = MC.conf;

var Iframe3DContextHandler = function () {
  /**
   * @param {object} props - an object that should contain all of the following keys:
   * - html (the html template to render)
   * - css (the css template of the isolated tree)
   * - initParams (optional / the initialisation parameteres that will be passed both on the css and the html templates in order to render)
   * - host (an Element object that will host the isolated tree)
   * - containerParams (an object that holds parameters to affect the container of the isolated tree, e.g. width, height etc)
   */
  function Iframe3DContextHandler() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Iframe3DContextHandler);

    if (!helper.isObject(props)) {
      helper.error("ContextHandler expects an object on its constructor. " + (typeof props === "undefined" ? "undefined" : _typeof(props)) + " passed");
      return false;
    }

    if (!props.hasOwnProperty("host")) {
      helper.error("ContextHandler expects the host key on its constructor properties which is missing");
      return false;
    }

    this.isDOM = false;

    var ownerDocument = props.host.ownerDocument;

    if (!ownerDocument.getElementById("@kissmybutton/motorcortex/iframeContextHandler/css")) {
      var seamlessCSS = "\n            iframe[seamless]{\n                background-color: transparent;\n                border: 0px none transparent;\n                padding: 0px;\n                overflow: hidden;\n            }\n            ";
      var iframesCSS = ownerDocument.createElement("style");
      iframesCSS.id = "@kissmybutton/motorcortex/iframeContextHandler/css";
      iframesCSS.type = "text/css";
      var Head = ownerDocument.head || ownerDocument.getElementsByTagName("head")[0];
      if (iframesCSS.styleSheet) {
        iframesCSS.styleSheet.cssText = seamlessCSS;
      } else {
        iframesCSS.appendChild(ownerDocument.createTextNode(seamlessCSS));
      }

      Head.appendChild(iframesCSS);
    }

    // Create an iframe:
    var iframe = ownerDocument.createElement("iframe");
    props.host.appendChild(iframe);
    iframe.setAttribute("seamless", "seamless");
    if (props.hasOwnProperty("containerParams")) {
      if (props.containerParams.hasOwnProperty("width")) {
        iframe.setAttribute("width", props.containerParams.width);
      }
      if (props.containerParams.hasOwnProperty("height")) {
        iframe.setAttribute("height", props.containerParams.height);
      }
    }

    // Initialise the iframe
    iframe.src = "";

    // Put it in the document (but hidden):
    var iframeDocument = iframe.contentWindow || iframe.contentDocument;
    if (iframeDocument.document) {
      iframeDocument = iframeDocument.document;
    }

    // console.log("asdfs",props.html)
    iframeDocument.write(props.html);

    var bodyFixCSS = "\n        html,body {\n            padding:0;\n            margin:0;\n        }\n        ";

    var styleTag = iframeDocument.createElement("style");
    styleTag.type = "text/css";
    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText = props.css + bodyFixCSS;
    } else {
      styleTag.appendChild(ownerDocument.createTextNode(props.css + bodyFixCSS));
    }
    var head = iframeDocument.head || iframeDocument.getElementsByTagName("head")[0];
    head.appendChild(styleTag);

    this.context = {
      document: iframeDocument,
      window: iframe.contentWindow || iframe,
      rootElement: iframeDocument.body,
      unmount: function unmount() {
        props.host.removeChild(iframe);
      },
      getElements: this.getElements.bind(this),
      getMCID: this.getMCID.bind(this),
      setMCID: this.setMCID.bind(this),
      getElementSelectorByMCID: this.getElementSelectorByMCID.bind(this)
    };

    iframeDocument.close();
  }

  _createClass(Iframe3DContextHandler, [{
    key: "getElements",
    value: function getElements(selector) {
      var elements = [];
      var key = "groups";

      // console.log("in context handler",selector)
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

      // console.log(elements)
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
    value: function setMCID(element /*, mcid*/) {
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
  }]);

  return Iframe3DContextHandler;
}();

module.exports = Iframe3DContextHandler;