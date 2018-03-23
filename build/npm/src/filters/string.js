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
  // TODO: biscotti files don't have javascript defined!
  return unit.javascript != null && unit.filter == null;
};

exports.filter = filter = function (engine) {
  var append, clear, get, run, sandbox;
  ({ append, get, clear, sandbox } = engine);
  ({ run } = sandbox);
  return define(run, isNotFiltered, function (unit) {
    var buffer;
    buffer = get();
    unit.filter = _asyncToGenerator(function* () {
      var i, item, len, result;
      result = "";
      for (i = 0, len = buffer.length; i < len; i++) {
        item = buffer[i];
        result += yield item;
      }
      clear();
      return result;
    });
    run(unit);
    return unit.filter();
  });
};

exports.filter = filter;