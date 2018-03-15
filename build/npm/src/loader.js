"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _unit = require("./unit");

var _unit2 = _interopRequireDefault(_unit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loader, create, trim;

trim = function (s) {
  return s.trim();
};

create = function ({ candidates, encoding = "utf8" }) {
  return function (path) {
    var unit;
    return unit = function (_path) {
      var content, i, language, len, paths, ref;
      ref = candidates(_path);
      for (language in ref) {
        paths = ref[language];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          try {
            content = trim(_fs2.default.readFileSync(path, encoding));
            return _unit2.default.create({ path, encoding, language, content });
          } catch (error) {}
        }
      }
      throw `biscotti: [${_path}] not found`;
    }(path);
  };
};

exports.default = Loader = { create };

exports.default = Loader;