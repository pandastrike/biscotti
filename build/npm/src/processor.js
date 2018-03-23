"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _loader = require("./loader");

var _buffer = require("./buffer");

var _fallback = require("./fallback");

var _include = require("./include");

var _string = require("./filters/string");

var _sandbox = require("./sandbox");

var _embedded = require("./embedded");

var _engine = require("./engine");

var processor;

exports.default = processor = function ({ globals = { require }, open = "::", close }) {
  return (0, _engine.engine)([{
    sandbox: (0, _sandbox.sandbox)(globals)
  }, (0, _loader.loader)({
    biscotti: {
      index: true,
      extensions: [".bpp"]
    }
  }), (0, _fallback.fallback)({
    language: "biscotti"
  }), (0, _include.include)(), _buffer.buffer, (0, _embedded.embedded)(open, close), _string.filter]);
};

exports.default = processor;