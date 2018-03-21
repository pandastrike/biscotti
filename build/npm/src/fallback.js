"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fallback = undefined;

var _fairmontMultimethods = require("fairmont-multimethods");

var defaults, define, fallback, isUnknown;

({ define } = _fairmontMultimethods.Method);

isUnknown = function (unit) {
  return unit.content != null && unit.path == null && unit.language == null;
};

defaults = {
  path: "* eval *",
  language: "coffeescript"
};

exports.fallback = fallback = function (description = {}) {
  var language;
  description = Object.assign({}, defaults, description);
  ({ language } = description);
  return function (engine) {
    var run;
    ({ run } = engine.sandbox);
    return define(run, isUnknown, function (unit) {
      Object.assign(unit, description);
      if (unit[language] == null) {
        unit[language] = unit.content;
      }
      return run(unit);
    });
  };
};

exports.fallback = fallback;