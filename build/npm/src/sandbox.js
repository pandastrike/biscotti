"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sandbox = undefined;

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

var _coffeescript = require("coffeescript");

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _fairmontMultimethods = require("fairmont-multimethods");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var define, isCoffeeScript, isJavaScript, isSandbox, sandbox;

({ define } = _fairmontMultimethods.Method);

isCoffeeScript = function (unit) {
  return unit.coffeescript != null && unit.javascript == null;
};

isJavaScript = function (unit) {
  return unit.javascript != null;
};

isSandbox = function (sandbox) {
  return _vm2.default.isContext(sandbox);
};

exports.sandbox = sandbox = function (globals) {
  var _sandbox, run;
  _sandbox = _vm2.default.createContext(globals);
  run = _fairmontMultimethods.Method.create({
    description: "Runs a JavaScript program in a sandbox",
    default: function (unit) {
      throw `biscotti: Don't know how to run [${unit.path}]`;
    }
  });
  define(run, isJavaScript, function (unit) {
    return _vm2.default.runInContext(unit.javascript, _sandbox, {
      filename: unit.path,
      displayErrors: true
    });
  });
  define(run, isCoffeeScript, function (unit) {
    if (unit.javascript == null) {
      unit.javascript = function () {
        return _coffeescript2.default.compile(unit.coffeescript, {
          bare: true,
          filename: unit.path,
          transpile: {
            presets: [['env', {
              targets: {
                node: "6.10"
              }
            }]]
          }
        });
      }();
    }
    return run(unit);
  });
  _sandbox.run = run;
  return _sandbox;
};

exports.sandbox = sandbox;