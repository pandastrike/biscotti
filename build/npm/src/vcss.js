"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSS = exports.vcss = undefined;

var _loader = require("./loader");

var _fallback = require("./fallback");

var _buffer = require("./buffer");

var _include = require("./include");

var _vcss = require("./filters/vcss");

var _sandbox = require("./sandbox");

var _engine = require("./engine");

var _fairmontMultimethods = require("fairmont-multimethods");

var _fairmontHelpers = require("fairmont-helpers");

var CSS, Properties, Styles, Units, Value, isArray, isDefined, isEmpty, isFunction, isObject, mix, render, units, vcss;

// TODO: Fairmont isEmpty should use isKind for objects?
isEmpty = function (x) {
  return Object.keys(x).length === 0;
};

Styles = class Styles {
  static create() {
    return new Styles();
  }

};

Properties = class Properties {
  static create() {
    return new Properties();
  }

};

Value = class Value {};

Units = class Units extends Value {
  static create() {
    return new Units(...arguments);
  }

  constructor({
    name: name1,
    value: value1
  }) {
    super();
    this.name = name1;
    this.value = value1;
  }

};

units = function (name, value) {
  return Units.create({ name, value });
};

// TODO: I need to use duck-typing here
// because VM literals have different
// prototypes/constructors that those
// in closures from outside the VM
isDefined = function (x) {
  return x !== void 0;
};

isFunction = function (x) {
  return x.call != null;
};

isArray = function (x) {
  return x.forEach != null;
};

isObject = function (x) {
  return x.constructor.assign != null;
};

mix = _fairmontMultimethods.Method.create();

_fairmontMultimethods.Method.define(mix, isFunction, isObject, function (mixin, target) {
  return mixin(target);
});

_fairmontMultimethods.Method.define(mix, isArray, isObject, function (mixins, target) {
  var i, len, mixin, results;
  results = [];
  for (i = 0, len = mixins.length; i < len; i++) {
    mixin = mixins[i];
    results.push(mix(mixin, target));
  }
  return results;
});

render = _fairmontMultimethods.Method.create();

_fairmontMultimethods.Method.define(render, isDefined, function (value) {
  return `${value}`;
});

_fairmontMultimethods.Method.define(render, (0, _fairmontHelpers.isType)(Styles), function (styles) {
  var properties, selector;
  return function () {
    var results;
    results = [];
    for (selector in styles) {
      properties = styles[selector];
      if (!isEmpty(properties)) {
        results.push(`${selector} { ${render(properties)} }`);
      }
    }
    return results;
  }().join("\n");
});

_fairmontMultimethods.Method.define(render, (0, _fairmontHelpers.isType)(Properties), function (properties) {
  var name, value;
  return function () {
    var results;
    results = [];
    for (name in properties) {
      value = properties[name];
      results.push(`${name}: ${render(value)};`);
    }
    return results;
  }().join(" ");
});

_fairmontMultimethods.Method.define(render, (0, _fairmontHelpers.isType)(Units), function ({ name, value }) {
  return `${value}${name}`;
});

exports.CSS = CSS = {
  render: render,
  s: function (_selector, mixins) {
    return function (target = {}) {
      var selector, style, styles;
      styles = target.styles != null ? target.styles : target.styles = Styles.create();
      if (target.selector == null) {
        target.selector = "";
      }
      selector = _selector.replace(/\&/, target.selector);
      style = styles[selector] != null ? styles[selector] : styles[selector] = Properties.create();
      mix(mixins, { styles, style, selector });
      return styles;
    };
  },
  p: function (name, value) {
    return function ({ style }) {
      style[name] = value;
      return style;
    };
  },
  units: units,
  rem: function (number) {
    return units("rem", number);
  },
  pct: function (number) {
    return number / 100;
  },
  scale: function ({ name, value }, factor) {
    value *= factor;
    return units(name, value);
  }
};

exports.vcss = vcss = function () {
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

exports.vcss = vcss;
exports.CSS = CSS;