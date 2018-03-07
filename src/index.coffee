import vm from "vm"
import fs from "fs"
import {resolve, dirname} from "path"
import coffeescript from "coffeescript"

biscotti = (md) ->

  context: (path, require) ->

    buffer = ""
    paths = [ cwd = dirname path ]

    sandbox = vm.createContext
      require: require
      append: (f) -> -> buffer += f arguments...
      include: (_path) ->
        _path = if _path[0] == "/"
          _path
        else
          resolve cwd, _path

        _paths = [
          _path
          "#{_path}.bisc"
          "#{_path}/index.bisc"
          "#{_path}.md"
          "#{_path}/index.md"
       ]

        for p in _paths
          try
            contents = fs.readFileSync p, "utf8"
            break

        if contents?
          paths.push cwd = dirname p
          buffer += process contents
          cwd = paths.pop()
        else
          throw new Error "biscotti: [#{_path}] not found"


    process = (contents) ->

      contents.replace /::: coffee\s([^]*?)\s^:::/gm, (_, cs) ->

        js = coffeescript.compile cs,
          bare: true
          transpile:
            presets: [[ 'env', targets: node: "6.10" ]]

        buffer = ""

        vm.runInContext js, sandbox,
          filename: path
          displayErrors: true

        buffer

    render: (contents) -> md process contents

export {biscotti as default}
