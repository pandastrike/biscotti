import vm from "vm"
import fs from "fs"
import {resolve as $resolve, dirname} from "path"
import coffeescript from "coffeescript"

log = -> console.error arguments...

biscotti = (md) ->

  context: (path, require) ->

    buffers = []
    block = 0
    start = -> buffers[block] = []
    append = (f) -> -> buffers[block].push f arguments...
    collate = (content, buffer) -> content += buffer
    finish = -> buffers[block++].reduce collate, ""
    buffered = (f) ->
      start()
      do f
      finish()

    contexts = []
    push = (path) -> contexts.push [ block, path ]
    pop = ->
      [block, path ] = contexts.pop()
      path
    cwd = dirname path
    push cwd
    cd = (path, f) ->
      push cwd
      cwd = dirname path
      output = do f
      cwd = pop()
      output
    resolve = (path) ->
      if path[0] == "/"
        path
      else
        $resolve cwd, path
    read = (path) ->
      paths = [
        path
        "#{path}.bisc"
        "#{path}/index.bisc"
        "#{path}.md"
        "#{path}/index.md"
     ]

      for _path in paths
        try
          contents = fs.readFileSync _path, "utf8"
          break

      if contents?
        contents
      else
        throw new Error "biscotti: [#{path}] not found"

    compile = (cs) ->
      coffeescript.compile cs,
        bare: true
        transpile:
          presets: [[ 'env', targets: node: "6.10" ]]
    sandbox = vm.createContext
      require: require
      append: append
      include: (path) ->
        do append ->
          _path = resolve path
          cd (dirname _path), ->
            process read _path
    run = (js) ->
      vm.runInContext js, sandbox,
        filename: cwd
        displayErrors: true

    replace = (contents, f) ->
      contents.replace /::: coffee\s([^]*?)\s^:::/gm, (args...) -> f args[1]

    process = (contents) ->
      replace contents, (cs) ->
        buffered -> run compile cs

    render: (contents) -> md process contents

export {biscotti as default}
