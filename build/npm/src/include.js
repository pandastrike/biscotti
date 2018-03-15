"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _path = require("path");

var Include, create, mixin;

create = function ({ cwd, load, evaluate }) {
  return function (path) {
    var saved, unit;
    unit = load(path[0] === "/" ? path : (0, _path.resolve)(cwd, path));
    saved = cwd;
    cwd = (0, _path.dirname)(unit.path);
    evaluate(unit);
    cwd = saved;
    return unit;
  };
};

mixin = function ({ cwd, load, evaluate }) {
  return function (sandbox) {
    return sandbox.include = create({ cwd, load, evaluate });
  };
};

exports.default = Include = { create, mixin };

exports.default = Include;