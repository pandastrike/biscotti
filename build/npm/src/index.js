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

var biscotti, log;

log = function () {
  return console.error(...arguments);
};

exports.default = biscotti = function (md) {
  return {
    context: function (path, require) {
      var append, block, buffered, buffers, cd, collate, compile, contexts, cwd, finish, pop, process, push, read, replace, resolve, run, sandbox, start;
      buffers = [];
      block = 0;
      start = function () {
        return buffers[block] = [];
      };
      append = function (f) {
        return function () {
          return buffers[block].push(f(...arguments));
        };
      };
      collate = function (content, buffer) {
        return content += buffer;
      };
      finish = function () {
        return buffers[block++].reduce(collate, "");
      };
      buffered = function (f) {
        start();
        f();
        return finish();
      };
      contexts = [];
      push = function (path) {
        return contexts.push([block, path]);
      };
      pop = function () {
        [block, path] = contexts.pop();
        return path;
      };
      cwd = (0, _path2.dirname)(path);
      push(cwd);
      cd = function (path, f) {
        var output;
        push(cwd);
        cwd = (0, _path2.dirname)(path);
        output = f();
        cwd = pop();
        return output;
      };
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
            contents = _fs2.default.readFileSync(_path, "utf8");
            break;
          } catch (error) {}
        }
        if (contents != null) {
          return contents;
        } else {
          throw new Error(`biscotti: [${path}] not found`);
        }
      };
      compile = function (cs) {
        return _coffeescript2.default.compile(cs, {
          bare: true,
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
        require: require,
        append: append,
        include: function (path) {
          return append(function () {
            var _path;
            _path = resolve(path);
            return cd((0, _path2.dirname)(_path), function () {
              return process(read(_path));
            });
          })();
        }
      });
      run = function (js) {
        return _vm2.default.runInContext(js, sandbox, {
          filename: cwd,
          displayErrors: true
        });
      };
      replace = function (contents, f) {
        return contents.replace(/::: coffee\s([^]*?)\s^:::/gm, function (...args) {
          return f(args[1]);
        });
      };
      process = function (contents) {
        return replace(contents, function (cs) {
          return buffered(function () {
            return run(compile(cs));
          });
        });
      };
      return {
        render: function (contents) {
          return md(process(contents));
        }
      };
    }
  };
};

exports.default = biscotti;