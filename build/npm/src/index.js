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

var biscotti;

exports.default = biscotti = function (md) {
  return {
    context: function (path, require) {
      var buffer, cwd, paths, process, sandbox;
      buffer = "";
      paths = [cwd = (0, _path2.dirname)(path)];
      sandbox = _vm2.default.createContext({
        require: require,
        append: function (f) {
          return function () {
            return buffer += f(...arguments);
          };
        },
        include: function (_path) {
          var _paths, contents, i, len, p;
          _path = _path[0] === "/" ? _path : (0, _path2.resolve)(cwd, _path);
          _paths = [_path, `${_path}.bisc`, `${_path}/index.bisc`, `${_path}.md`, `${_path}/index.md`];
          for (i = 0, len = _paths.length; i < len; i++) {
            p = _paths[i];
            try {
              contents = _fs2.default.readFileSync(p, "utf8");
              break;
            } catch (error) {}
          }
          if (contents != null) {
            paths.push(cwd = (0, _path2.dirname)(p));
            buffer += process(contents);
            return cwd = paths.pop();
          } else {
            throw new Error(`biscotti: [${_path}] not found`);
          }
        }
      });
      process = function (contents) {
        return contents.replace(/::: coffee\s([^]*?)\s^:::/gm, function (_, cs) {
          var js;
          js = _coffeescript2.default.compile(cs, {
            bare: true,
            transpile: {
              presets: [['env', {
                targets: {
                  node: "6.10"
                }
              }]]
            }
          });
          buffer = "";
          _vm2.default.runInContext(js, sandbox, {
            filename: path,
            displayErrors: true
          });
          return buffer;
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