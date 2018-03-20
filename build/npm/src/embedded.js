"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embedded = undefined;

var _fairmontMultimethods = require("fairmont-multimethods");

var define, embedded, isBiscotti, split;

({ define } = _fairmontMultimethods.Method);

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

// TODO: should this be configurable?
isBiscotti = function (unit) {
  return unit.biscotti != null;
};

exports.embedded = embedded = function (open, close) {
  if (close == null) {
    close = open;
  }
  open = split(open);
  close = split(close);
  return function (engine) {
    var append, run, sandbox;
    ({ sandbox, append } = engine);
    ({ run } = sandbox);
    return define(run, isBiscotti, function (unit) {
      var _, before, block, content, language, path;
      ({ path, content, language } = unit);
      while ((_ = open(content)) != null) {
        [before, content] = _;
        append(before);
        if ((_ = close(content)) != null) {
          [block, content] = _;
          sandbox.run({
            path,
            content: block,
            language
          });
        }
      }
      return sandbox.append(content);
    });
  };
};

exports.embedded = embedded;