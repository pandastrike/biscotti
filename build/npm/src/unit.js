"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Unit, create, defaults;

defaults = {
  encoding: "utf8",
  path: "* eval *"
};

create = function (description) {
  var content, language;
  ({ language, content } = description);
  if (language != null) {
    description[language] != null ? description[language] : description[language] = content;
  }
  return Object.assign({}, defaults, description);
};

exports.default = Unit = { create };

exports.default = Unit;