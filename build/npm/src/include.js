"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.include = undefined;

var _path = require("path");

var include;

exports.include = include = function ({ cwd = void 0, isBuffered = true } = {}) {
  return function (engine) {
    var _include, run;
    ({ run } = engine.sandbox);
    _include = function (path) {
      var append, clear, get, restore, result, saved;
      ({ get, append, clear, restore } = engine);
      if (cwd == null) {
        cwd = engine.cwd;
      }
      path = path[0] === "/" ? path : (0, _path.resolve)(cwd, path);
      saved = {
        cwd,
        buffer: get()
      };
      cwd = (0, _path.dirname)(path);
      clear();
      result = run({
        path,
        include: true
      });
      restore(saved.buffer);
      cwd = saved.cwd;
      if (isBuffered) {
        append(result);
      }
      return result;
    };
    return engine.sandbox.include = _include;
  };
};

exports.include = include;