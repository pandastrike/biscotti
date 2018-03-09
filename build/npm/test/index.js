"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var md, path, process;

md = function (parser) {
  return function (markdown) {
    return parser.render(markdown);
  };
}((0, _markdownIt2.default)());

path = (0, _path.resolve)("./test/files/index.bisc");

process = (0, _index2.default)(require);

_asyncToGenerator(function* () {
  var _rec = new _powerAssertRecorder();

  return _powerAssert2.default.equal(_rec._expr(_rec._capt((yield process(_rec._capt(path, "arguments/0/argument/arguments/0"))), "arguments/0"), {
    content: "assert.equal((await process(path)), '# Greetings!\\n\\n\\n\\n\\nThis is a test.\\n\\nHello, Foo!\\n\\nGoodbye, now!\\n')",
    filepath: "index.coffee",
    line: 15,
    async: true
  }), '# Greetings!\n\n\n\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!\n');
})();