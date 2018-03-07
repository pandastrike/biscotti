"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }(),
    _rec = new _powerAssertRecorder();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _path = require("path");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _index = require("../src/index");

var _index2 = _interopRequireDefault(_index);

var _markdownIt = require("markdown-it");

var _markdownIt2 = _interopRequireDefault(_markdownIt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md, output, path;

md = function (parser) {
  return function (markdown) {
    return parser.render(markdown);
  };
}((0, _markdownIt2.default)());

path = (0, _path.resolve)("./test/files/index.bisc");

output = (0, _index2.default)(md).context(path).render(_fs2.default.readFileSync(path, "utf8"));

_powerAssert2.default.equal(_rec._expr(_rec._capt(output, "arguments/0"), {
  content: "assert.equal(output, '<p>Hello, Foo!</p>\\n')",
  filepath: "index.coffee",
  line: 16
}), '<p>Hello, Foo!</p>\n');