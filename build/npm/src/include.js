"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.include = undefined;

var _path = require("path");

var include;

exports.include = include = function (cwd) {
  return function (engine) {
    var _include, run;
    ({ run } = engine.sandbox);
    _include = function (path) {
      var result, saved;
      if (cwd == null) {
        cwd = engine.cwd;
      }
      path = path[0] === "/" ? path : (0, _path.resolve)(cwd, path);
      saved = cwd;
      cwd = (0, _path.dirname)(path);
      result = run({
        path,
        include: true
      });
      cwd = saved;
      return result;
    };
    return engine.sandbox.include = _include;
  };
}(void 0);

exports.include = include;