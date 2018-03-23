"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buffer;

exports.buffer = buffer = function (engine) {
  var _buffer, append, clear, get, restore;
  _buffer = [];
  get = function () {
    return _buffer;
  };
  append = function (value) {
    return _buffer.push(value);
  };
  clear = function () {
    return _buffer = [];
  };
  restore = function (buffer) {
    return _buffer = buffer;
  };
  Object.assign(engine, { get, append, clear, restore });
  Object.assign(engine.sandbox, {
    get,
    append,
    // TODO: possibly make these part of a separate mixin?
    $: function (f) {
      return function () {
        return append(f(...arguments));
      };
    },
    $$: append,
    clear,
    restore
  });
  return engine;
};

exports.buffer = buffer;