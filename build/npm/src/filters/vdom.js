"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = undefined;

var _fairmontMultimethods = require("fairmont-multimethods");

var define, filter, isNotFiltered;

({ define } = _fairmontMultimethods.Method);

// TODO: implement before, after, and wrap for generics
// This is a hack, where we use a flag on the argument
// to ensure we don't hit an infinite loop
isNotFiltered = function (unit) {
  // TODO: biscotti files don't have javascript defined!
  return unit.javascript != null && unit.filter == null;
};

exports.filter = filter = function (engine) {
  var clear, get, run, sandbox;
  ({ get, clear, sandbox } = engine);
  ({ run } = sandbox);
  return define(run, isNotFiltered, function (unit) {
    unit.filter = function () {
      var result;
      result = Array.from(get());
      clear();
      return result;
    };
    run(unit);
    return unit.filter();
  });
};

exports.filter = filter;