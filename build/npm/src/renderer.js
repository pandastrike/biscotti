"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _loader = require("./loader");

var _loader2 = _interopRequireDefault(_loader);

var _include = require("./include");

var _include2 = _interopRequireDefault(_include);

var _buffer = require("./buffer");

var _buffer2 = _interopRequireDefault(_buffer);

var _unit = require("./unit");

var _unit2 = _interopRequireDefault(_unit);

var _sandbox = require("./sandbox");

var _sandbox2 = _interopRequireDefault(_sandbox);

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var renderer;

exports.default = renderer = function (globals = { require }) {
  var evaluate, filter, include, load, sandbox;
  sandbox = _sandbox2.default.create(globals);
  load = _loader2.default.create({
    candidates: function (path) {
      return {
        coffeescript: [path, `${path}.biscotti`, `${path}/index.biscotti`]
      };
    }
  });
  evaluate = function (unit) {
    return _sandbox2.default.run(sandbox, unit);
  };
  include = _include2.default.mixin({
    cwd: process.cwd(),
    load,
    evaluate
  });
  include(sandbox);
  _buffer2.default.mixin(sandbox);
  // package as a set of filters?
  filter = (() => {
    var _ref = _asyncToGenerator(function* (sandbox) {
      var result;
      result = "";
      while (sandbox.buffer.length > 0) {
        result += yield sandbox.buffer.shift();
      }
      return result;
    });

    return function filter(_x) {
      return _ref.apply(this, arguments);
    };
  })();
  return function ({ path, content }) {
    if (content != null) {
      // do we need a way to set cwd here?
      _sandbox2.default.run(sandbox, _unit2.default.create({
        language: "coffeescript",
        path,
        content
      }));
    } else if (path != null) {
      // what if we want a different encoding?
      sandbox.include(path);
    } else {
      throw "biscotti: either path or content required";
    }
    return filter(sandbox);
  };
};

exports.default = renderer;