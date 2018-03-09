"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _path = require("path");

var _index = require("../src/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path, process, text;

// we need to do this because this path is relative to
// file not where the tests may be run from ...
path = (0, _path.resolve)("./test/files/index.bisc");

text = "# Greetings!\n\n:: do $ -> \"Hello, Bar!\" ::";

process = (0, _index2.default)({ require });

_asyncToGenerator(function* () {
  var _rec = new _powerAssertRecorder(),
      _rec2 = new _powerAssertRecorder();

  _powerAssert2.default.equal(_rec._expr(_rec._capt((yield process(_rec._capt(path, "arguments/0/argument/arguments/0"))), "arguments/0"), {
    content: "assert.equal((await process(path)), '# Greetings!\\n\\n\\n\\nThis is a test.\\n\\nHello, Foo!\\n\\nGoodbye, now!')",
    filepath: "index.coffee",
    line: 18,
    async: true
  }), '# Greetings!\n\n\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!');
  return _powerAssert2.default.equal(_rec2._expr(_rec2._capt((yield process(_rec2._capt(path, "arguments/0/argument/arguments/0"), _rec2._capt({ text }, "arguments/0/argument/arguments/1"))), "arguments/0"), {
    content: "assert.equal((await process(path, { text })), '# Greetings!\\n\\nHello, Bar!')",
    filepath: "index.coffee",
    line: 21,
    async: true
  }), '# Greetings!\n\nHello, Bar!');
})();