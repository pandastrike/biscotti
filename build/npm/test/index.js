"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _path = require("path");

var _processor = require("../src/processor");

var _processor2 = _interopRequireDefault(_processor);

var _renderer = require("../src/renderer");

var _renderer2 = _interopRequireDefault(_renderer);

var _vdom = require("../src/vdom");

var _vdom2 = _interopRequireDefault(_vdom);

var _pandaVdom = require("panda-vdom");

var _amen = require("amen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

global.$p = function () {
  return console.error(...arguments);
};

$p.H = function () {
  return $;
};

_asyncToGenerator(function* () {
  return (0, _amen.print)((yield (0, _amen.test)("Biscotti", [(0, _amen.test)("Pre-processor engine", function () {
    return [(0, _amen.test)("from path", _asyncToGenerator(function* () {
      var _rec = new _powerAssertRecorder();

      var path, process, result;
      process = (0, _processor2.default)({ require });
      // we need to do this because this path is relative to
      // file not where the tests may be run from ...
      path = (0, _path.resolve)("./test/files/index.bpp");
      result = yield process({ path });
      return _powerAssert2.default.equal(_rec._expr(_rec._capt(result, "arguments/0"), {
        content: "assert.equal(result, '# Greetings!\\n\\n\\n\\nThis is a test.\\n\\nHello, Foo!\\n\\nGoodbye, now!')",
        filepath: "index.coffee",
        line: 27,
        async: true
      }), '# Greetings!\n\n\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!');
    })), (0, _amen.test)("from string", _asyncToGenerator(function* () {
      var _rec2 = new _powerAssertRecorder();

      var content, process, result;
      process = (0, _processor2.default)({ require });
      content = "# Greetings!\n\n:: do $ -> \"Hello, Bar!\" ::";
      result = yield process({ content });
      return _powerAssert2.default.equal(_rec2._expr(_rec2._capt(result, "arguments/0"), {
        content: "assert.equal(result, '# Greetings!\\n\\nHello, Bar!')",
        filepath: "index.coffee",
        line: 40,
        async: true
      }), '# Greetings!\n\nHello, Bar!');
    }))];
  }()), (0, _amen.test)("Rendering engine", function () {
    return [(0, _amen.test)("from path", _asyncToGenerator(function* () {
      var _rec3 = new _powerAssertRecorder();

      var path, render, result;
      render = (0, _renderer2.default)({ require });
      // we need to do this because this path is relative to
      // file not where the tests may be run from ...
      path = (0, _path.resolve)("./test/files/index.biscotti");
      result = yield render({ path });
      return _powerAssert2.default.equal(_rec3._expr(_rec3._capt(result, "arguments/0"), {
        content: "assert.equal(result, '# Greetings!\\n\\nThis is a test.\\n\\nHello, Foo!\\n\\nGoodbye, now!')",
        filepath: "index.coffee",
        line: 55,
        async: true
      }), '# Greetings!\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!');
    })), (0, _amen.test)("from path (with import)", _asyncToGenerator(function* () {
      var _rec4 = new _powerAssertRecorder();

      var render, result;
      render = (0, _renderer2.default)({ require });
      result = yield render({
        path: (0, _path.resolve)("./test/files/html/index.biscotti")
      });
      return _powerAssert2.default.equal(_rec4._expr(_rec4._capt(result, "arguments/0"), {
        content: "assert.equal(result, \"<html><body><h1>Hello, World!</h1></body></html>\")",
        filepath: "index.coffee",
        line: 62,
        async: true
      }), "<html><body><h1>Hello, World!</h1></body></html>");
    })), (0, _amen.test)("from content", _asyncToGenerator(function* () {
      var _rec5 = new _powerAssertRecorder();

      var content, render, result;
      render = (0, _renderer2.default)({ require });
      content = "do $ -> \"# Greetings!\\n\\n\"\n\ndo $ -> \"Hello, Bar!\"";
      result = yield render({ content });
      return _powerAssert2.default.equal(_rec5._expr(_rec5._capt(result, "arguments/0"), {
        content: "assert.equal(result, '# Greetings!\\n\\nHello, Bar!')",
        filepath: "index.coffee",
        line: 74,
        async: true
      }), '# Greetings!\n\nHello, Bar!');
    }))];
  }()), (0, _amen.test)("VDOM", _asyncToGenerator(function* () {
    var _rec6 = new _powerAssertRecorder(),
        _rec7 = new _powerAssertRecorder();

    var documents, result;
    documents = yield (0, _vdom2.default)({
      path: (0, _path.resolve)("./test/files/vdom/index.vdom")
    });
    _powerAssert2.default.equal(_rec6._expr(_rec6._capt(_rec6._capt(documents, "arguments/0/object").length, "arguments/0"), {
      content: "assert.equal(documents.length, 1)",
      filepath: "index.coffee",
      line: 82,
      async: true
    }), 1);
    result = _pandaVdom.HTML.render(documents[0]);
    return _powerAssert2.default.equal(_rec7._expr(_rec7._capt(result, "arguments/0"), {
      content: "assert.equal(result, \"<html><body><h1>Hello, World!</h1></body></html>\")",
      filepath: "index.coffee",
      line: 84,
      async: true
    }), "<html><body><h1>Hello, World!</h1></body></html>");
  }))])));
})();