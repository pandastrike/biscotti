"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Buffer, mixin;

mixin = function (sandbox) {
  var append, buffer;
  buffer = [];
  append = function (value) {
    return buffer.push(value);
  };
  return Object.assign(sandbox, {
    buffer,
    append,
    $: function (f) {
      return function () {
        return append(f(...arguments));
      };
    },
    $$: append
  });
};

exports.default = Buffer = { mixin };

exports.default = Buffer;