"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _loader = require("./loader");

var _fallback = require("./fallback");

var _buffer = require("./buffer");

var _include = require("./include");

var _vdom = require("./filters/vdom");

var _sandbox = require("./sandbox");

var _engine = require("./engine");

var _pandaVdom = require("panda-vdom");

var vdom;

exports.default = vdom = function () {
  var globals;
  globals = Object.assign({}, { require }, _pandaVdom.HTML);
  return (0, _engine.engine)([{
    sandbox: (0, _sandbox.sandbox)(globals)
  }, (0, _loader.loader)({
    coffeescript: {
      index: true,
      extensions: [".vdom"]
    }
  }), (0, _fallback.fallback)(), (0, _include.include)({
    isBuffered: false
  }), _buffer.buffer, _vdom.filter]);
}();

exports.default = vdom;