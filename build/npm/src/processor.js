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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var processor;

exports.default = processor = function ({ globals = { require }, open = "::", close }) {
  var evaluate, filter, include, insertions, load, mv, pattern, sandbox;
  if (close == null) {
    close = open;
  }
  pattern = RegExp(`${open}\\s*([^]*?)\\s*${close}`, "gm");
  sandbox = _sandbox2.default.create(globals);
  load = _loader2.default.create({
    candidates: function (path) {
      return {
        coffeescript: [path, `${path}.bpp`, `${path}/index.bpp`]
      };
    }
  });
  mv = function (a, b) {
    var results;
    results = [];
    while (a.length > 0) {
      results.push(b.push(a.shift()));
    }
    return results;
  };
  filter = (() => {
    var _ref = _asyncToGenerator(function* (buffer) {
      var i, item, len, result;
      result = "";
      for (i = 0, len = buffer.length; i < len; i++) {
        item = buffer[i];
        result += yield item;
      }
      return result;
    });

    return function filter(_x) {
      return _ref.apply(this, arguments);
    };
  })();
  insertions = [];
  evaluate = function (unit) {
    var content, language, path;
    ({ path, content, language } = unit);
    return sandbox.append(content.replace(pattern, function (_, content) {
      var buffer, placeholder;
      buffer = [];
      placeholder = `${open}${insertions.length}${close}`;
      insertions.push((() => {
        var _ref2 = _asyncToGenerator(function* (content) {
          return content.replace(RegExp(`${placeholder}`, "gm"), (yield filter(buffer)));
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })());
      _sandbox2.default.run(sandbox, _unit2.default.create({ path, content, language }));
      mv(sandbox.buffer, buffer);
      return placeholder;
    }));
  };
  include = _include2.default.mixin({
    cwd: process.cwd(),
    load,
    evaluate
  });
  include(sandbox);
  _buffer2.default.mixin(sandbox);
  return (() => {
    var _ref3 = _asyncToGenerator(function* ({ path, content }) {
      var i, insertion, len, result;
      if (content != null) {
        evaluate(_unit2.default.create({
          language: "coffeescript",
          path,
          content
        }));
      } else if (path != null) {
        sandbox.include(path);
      } else {
        throw "biscotti: either path or content required";
      }
      result = sandbox.buffer.shift();
      for (i = 0, len = insertions.length; i < len; i++) {
        insertion = insertions[i];
        result = yield insertion(result);
      }
      return result;
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  })();
};

exports.default = processor;