"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _loader = require("./loader");

var _fallback = require("./fallback");

var _buffer = require("./buffer");

var _include = require("./include");

var _vcss = require("./filters/vcss");

var _sandbox = require("./sandbox");

var _engine = require("./engine");

var CSS, mix, unit, vcss;

mix = function (mixins, target) {
  var i, len, mixin, results;
  results = [];
  for (i = 0, len = mixins.length; i < len; i++) {
    mixin = mixins[i];
    if (mixin.call != null) {
      results.push(mixin(target));
    } else if (mixin.slice != null) {
      results.push(mix(mixin, target));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

CSS = {
  s: function (selector, mixins) {
    return function (styles) {
      mix(mixins, styles[selector] != null ? styles[selector] : styles[selector] = {});
      return styles;
    };
  },
  p: function (name, value) {
    return function (style) {
      style[name] = value;
      return style;
    };
  },
  unit: unit = function (name, value) {
    return { name, value };
  },
  rem: function (number) {
    return unit("rem", 4);
  },
  pct: function (number) {
    return number / 100;
  },
  scale: function ({ name, value }, factor) {
    value *= factor;
    return { name, value };
  }
};

exports.default = vcss = function () {
  var globals;
  globals = Object.assign({}, { require }, CSS);
  return (0, _engine.engine)([{
    sandbox: (0, _sandbox.sandbox)(globals)
  }, (0, _loader.loader)({
    coffeescript: {
      index: true,
      extensions: [".vdom"]
    }
  }), (0, _fallback.fallback)(), (0, _include.include)({
    isBuffered: false
  }), _buffer.buffer, _vcss.filter]);
}();

exports.default = vcss;