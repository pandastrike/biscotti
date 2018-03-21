"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _loader = require("./loader");

var _fallback = require("./fallback");

var _buffer = require("./buffer");

var _include = require("./include");

var _string = require("./filters/string");

var _sandbox = require("./sandbox");

var _engine = require("./engine");

var renderer;

exports.default = renderer = function ({ globals = { require } }) {
  return (0, _engine.engine)([{
    sandbox: (0, _sandbox.sandbox)(globals)
  }, (0, _loader.loader)({
    coffeescript: {
      index: true,
      extensions: [".biscotti"]
    }
  }), (0, _fallback.fallback)(), _include.include, _buffer.buffer, _string.filter]);
};

exports.default = renderer;