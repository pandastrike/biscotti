"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = undefined;

var _fairmontMultimethods = require("fairmont-multimethods");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var define, filter, isNotFiltered;

({ define } = _fairmontMultimethods.Method);

// TODO: implement before, after, and wrap for generics
// This is a hack, where we use a flag on the argument
// to ensure we don't hit an infinite loop
isNotFiltered = function (unit) {
  return unit.javascript != null && unit.filter == null;
};

exports.filter = filter = function (engine) {
  var buffer, clear, run, sandbox;
  ({ buffer, clear, sandbox } = engine);
  ({ run } = sandbox);
  return define(run, isNotFiltered, function (unit) {
    unit.filter = _asyncToGenerator(function* () {
      var result;
      result = "";
      while (buffer.length > 0) {
        result += yield buffer.shift();
      }
      $p({ result });
      return result;
    });
    run(unit);
    return unit.filter();
  });
};

exports.filter = filter;