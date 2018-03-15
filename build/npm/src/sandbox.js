"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

var _coffeescript = require("coffeescript");

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _fairmontMultimethods = require("fairmont-multimethods");

var _unit = require("./unit");

var _unit2 = _interopRequireDefault(_unit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sandbox, create, isCoffeeScript, isJavaScript, isSandbox, run;

run = _fairmontMultimethods.Method.create({
  description: "Run a biscotti unit (file or from memory)",
  default: function (sandbox, unit) {
    throw `biscotti: Don't know how to run [${unit.path}]`;
  }
});

isCoffeeScript = function (unit) {
  return unit.coffeescript != null && unit.javascript == null;
};

isJavaScript = function (unit) {
  return unit.javascript != null;
};

isSandbox = function (sandbox) {
  return _vm2.default.isContext(sandbox);
};

_fairmontMultimethods.Method.define(run, isSandbox, isCoffeeScript, function (sandbox, unit) {
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
  return run(sandbox, unit);
});

_fairmontMultimethods.Method.define(run, isSandbox, isJavaScript, function (sandbox, unit) {
  return _vm2.default.runInContext(unit.javascript, sandbox, {
    filename: unit.path,
    displayErrors: true
  });
});

create = function (globals) {
  return _vm2.default.createContext(globals);
};

exports.default = Sandbox = { run, create };

exports.default = Sandbox;