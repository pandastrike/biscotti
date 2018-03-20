"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buffer;

exports.buffer = buffer = function (engine) {
  var _buffer, append, clear;
  _buffer = [];
  append = function (value) {
    return _buffer.push(value);
  };
  clear = function () {
    return _buffer = [];
  };
  Object.assign(engine, {
    buffer: _buffer,
    append,
    clear
  });
  Object.assign(engine.sandbox, {
    buffer: _buffer,
    append,
    // TODO: possibly make these part of a separate mixin?
    $: function (f) {
      return function () {
        return append(f(...arguments));
      };
    },
    $$: append,
    clear
  });
  return engine;
};

exports.buffer = buffer;