"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _path = require("path");

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _amen = require("amen");

var _src = require("../src");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var before, verify;

verify = function ({ before, actual, expected }) {
  return _asyncToGenerator(function* () {
    var _rec = new _powerAssertRecorder(),
        _rec2 = new _powerAssertRecorder();

    return _powerAssert2.default.equal(_rec._expr(_rec._capt(expected, "arguments/0"), {
      content: "assert.equal(expected, (await actual(before())))",
      filepath: "index.coffee",
      line: 8,
      async: true
    }), _rec2._expr(_rec2._capt((yield actual(_rec2._capt(before(), "arguments/1/argument/arguments/0"))), "arguments/1"), {
      content: "assert.equal(expected, (await actual(before())))",
      filepath: "index.coffee",
      line: 8,
      async: true
    }));
  });
};

before = function () {
  return (0, _src.engine)([{
    sandbox: (0, _src.sandbox)({ require })
  }, (0, _src.loader)({
    coffeescript: {
      index: true,
      extensions: [".biscotti"]
    }
  }), (0, _src.fallback)(), (0, _src.include)(), _src.buffer, _src.filters.string]);
};

_asyncToGenerator(function* () {
  return (0, _amen.print)((yield (0, _amen.test)("biscotti", [(0, _amen.test)("from path", verify({
    before: before,
    actual: function (render) {
      return render({
        path: (0, _path.resolve)("./test/files/index.biscotti")
      });
    },
    expected: '# Greetings!\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!'
  })), (0, _amen.test)("from content", verify({
    before: before,
    actual: function (render) {
      return render({
        content: "do $ -> \"# Greetings!\\n\\n\"\n\ndo $ -> \"Hello, Bar!\""
      });
    },
    expected: '# Greetings!\n\nHello, Bar!'
  }))])));
})();