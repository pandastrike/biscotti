"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var engine;

exports.engine = engine = function (list) {
  var i, len, mixin, mixins, object;
  [object, ...mixins] = list;
  for (i = 0, len = mixins.length; i < len; i++) {
    mixin = mixins[i];
    mixin(object);
  }
  return object.sandbox.run;
};

exports.engine = engine;