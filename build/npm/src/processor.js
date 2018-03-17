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
  var evaluate, filter, include, insertions, load, sandbox, split;
  if (close == null) {
    close = open;
  }
  sandbox = _sandbox2.default.create(globals);
  load = _loader2.default.create({
    candidates: function (path) {
      return {
        coffeescript: [path, `${path}.bpp`, `${path}/index.bpp`]
      };
    }
  });
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
  insertions = [];
  split = function (delimiter) {
    return function (string) {
      var after, before, index;
      if ((index = string.indexOf(delimiter)) >= 0) {
        before = string.substr(0, index);
        after = string.substr(index + delimiter.length);
        return [before, after];
      } else {
        return void 0;
      }
    };
  };
  open = split(open);
  close = split(close);
  evaluate = function (unit) {
    var _, before, block, content, language, path;
    ({ path, content, language } = unit);
    while ((_ = open(content)) != null) {
      [before, content] = _;
      sandbox.append(before);
      if ((_ = close(content)) != null) {
        [block, content] = _;
        _sandbox2.default.run(sandbox, _unit2.default.create({
          path,
          content: block,
          language
        }));
      }
    }
    return sandbox.append(content);
  };
  include = _include2.default.mixin({
    cwd: process.cwd(),
    load,
    evaluate
  });
  include(sandbox);
  _buffer2.default.mixin(sandbox);
  return function ({ path, content }) {
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
    return filter(sandbox);
  };
};

exports.default = processor;