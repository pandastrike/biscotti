"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path2 = require("path");

var _coffeescript = require("coffeescript");

var _coffeescript2 = _interopRequireDefault(_coffeescript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var all, append, biscotti, log;

log = function () {
  return console.error(...arguments);
};

append = function (to, from) {
  return to += from;
};

all = function (promises) {
  if (promises != null) {
    return Promise.all(promises);
  } else {
    return [];
  }
};

exports.default = biscotti = function (_require = require) {
  var context;
  context = function (require) {
    var compile, document, run, sandbox;
    compile = function (code, path) {
      return _coffeescript2.default.compile(code, {
        bare: true,
        filename: path,
        transpile: {
          presets: [['env', {
            targets: {
              node: "6.10"
            }
          }]]
        }
      });
    };
    sandbox = _vm2.default.createContext({
      require: require
    });
    run = function (code, path) {
      return _vm2.default.runInContext(code, sandbox, {
        filename: path,
        displayErrors: true
      });
    };
    // a document returns a promise
    // that resolves to a processed document
    document = function (path, { encoding = "utf8", open = "::", close } = {}) {
      var buffer, cwd, offset, out, pattern, read, resolve, subdocument;
      if (close == null) {
        close = open;
      }
      offset = 0;
      pattern = RegExp(`${open}\\s*([^]*?)\\s*${close}`, "gm");
      resolve = function (path) {
        if (path[0] === "/") {
          return path;
        } else {
          return (0, _path2.resolve)(cwd, path);
        }
      };
      read = function (path) {
        var _path, contents, i, len, paths;
        paths = [path, `${path}.bisc`, `${path}/index.bisc`, `${path}.md`, `${path}/index.md`];
        for (i = 0, len = paths.length; i < len; i++) {
          _path = paths[i];
          try {
            contents = _fs2.default.readFileSync(_path, encoding);
            break;
          } catch (error) {}
        }
        if (contents != null) {
          return contents;
        } else {
          throw new Error(`biscotti: [${path}] not found`);
        }
      };
      // a subdocument returns a promise
      // a resolves to a processed subdocument
      subdocument = (() => {
        var _ref = _asyncToGenerator(function* (path) {
          var cd, cwd, i, insertion, insertions, len, replace, resolved, result, saved, stripped, text;
          insertions = [];
          replace = function (text, action) {
            return text.replace(pattern, function (_, code) {
              var placeholder, promises;
              action(code);
              promises = [];
              while (buffer.length > 0) {
                promises.push(buffer.pop());
              }
              placeholder = `::${insertions.length}::`;
              insertions.push((() => {
                var _ref2 = _asyncToGenerator(function* (text) {
                  var buffered, what;
                  buffered = yield all(promises);
                  what = buffered.reduce(append, "");
                  return text.replace(RegExp(`${placeholder}`, "gm"), function () {
                    return what;
                  });
                });

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              })());
              return placeholder;
            });
          };
          cd = function (path, action) {};
          resolved = resolve(path);
          saved = cwd;
          text = read(resolved);
          stripped = replace(text, function (code) {
            return run(compile(code));
          });
          cwd = saved;
          result = stripped;
          for (i = 0, len = insertions.length; i < len; i++) {
            insertion = insertions[i];
            result = yield insertion(result);
          }
          return result;
        });

        return function subdocument(_x) {
          return _ref.apply(this, arguments);
        };
      })();
      cwd = (0, _path2.dirname)(path);
      buffer = [];
      out = function (f) {
        return function () {
          return buffer.push(f(...arguments));
        };
      };
      Object.assign(sandbox, out, {
        $: out,
        include: function (path) {
          return out(function () {
            return subdocument(path, cwd);
          })();
        }
      });
      return subdocument(path);
    };
    return document;
  };
  return context(_require);
};

exports.default = biscotti;