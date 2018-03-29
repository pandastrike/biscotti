"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loader = undefined;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _fairmontMultimethods = require("fairmont-multimethods");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var define, isNotLoaded, loader, trim;

({ define } = _fairmontMultimethods.Method);

trim = function (s) {
  return s.trim();
};

isNotLoaded = function (unit) {
  return unit.content == null;
};

exports.loader = loader = function (description) {
  var candidates, load;
  candidates = function (vpath) {
    var extension, extensions, i, index, language, len, result;
    result = {};
    for (language in description) {
      ({ index, extensions } = description[language]);
      result[language] = [vpath];
      for (i = 0, len = extensions.length; i < len; i++) {
        extension = extensions[i];
        result[language].push(vpath + extension);
        if (index != null) {
          result[language].push((0, _path.join)(vpath, "index" + extension));
        }
      }
    }
    return result;
  };
  load = function (unit) {
    var i, language, len, path, paths, ref;
    if (unit.path != null) {
      if (unit.encoding == null) {
        unit.encoding = "utf8";
      }
      ref = candidates(unit.path);
      for (language in ref) {
        paths = ref[language];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          try {
            unit.content = trim(_fs2.default.readFileSync(path, unit.encoding));
            unit[language] = unit.content;
            return unit;
          } catch (error) {}
        }
      }
      throw `[${unit.path}] not found`;
    }
  };
  return function (engine) {
    var run;
    engine.load = engine.sandbox.load = load;
    ({ run } = engine.sandbox);
    define(run, isNotLoaded, function (unit) {
      if (engine.cwd == null) {
        engine.cwd = (0, _path.dirname)(unit.path);
      }
      return run(load(unit));
    });
    return engine;
  };
};

exports.loader = loader;