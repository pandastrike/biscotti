import vm from "vm"
import fs from "fs"
import {resolve as $resolve, dirname} from "path"
import coffeescript from "coffeescript"

log = -> console.error arguments...

trim = (string) -> do string.trim

append = (to, from) -> to += from

all = (promises) ->
  if promises?
    Promise.all promises
  else
    []

biscotti = (globals = {require}) ->

  context = (globals) ->

    compile = (code, path) ->
      coffeescript.compile code,
        bare: true
        filename: path
        transpile:
          presets: [[ 'env', targets: node: "6.10" ]]

    sandbox = vm.createContext globals
    run = (code, path) ->
      vm.runInContext code, sandbox,
        filename: path
        displayErrors: true

    # a document returns a promise
    # that resolves to a processed document
    document = (path, {encoding = "utf8", open = "::", close, text} = {}) ->

      close ?= open

      offset = 0

      pattern = ///#{open}\s*([^]*?)\s*#{close}///gm

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
            contents = fs.readFileSync _path, encoding
            break

        if contents?
          contents
        else
          throw new Error "biscotti: [#{path}] not found"

      # a subdocument returns a promise
      # a resolves to a processed subdocument
      subdocument = (path, text) ->

        insertions = []

        replace = (text, action) ->
          text.replace pattern, (_, code) ->
            action code
            promises = []
            while buffer.length > 0
              promises.push do buffer.shift
            placeholder = "#{open}#{insertions.length}#{close}"
            insertions.push (text) ->
              buffered = await all promises
              what = buffered.reduce append, ""
              text.replace ///#{placeholder}///gm, -> what
            placeholder

        resolved = resolve path
        saved = cwd
        text ?= trim read resolved
        stripped = replace text, (code) -> run compile code
        cwd = saved
        result = stripped
        for insertion in insertions
          result = await insertion result
        result

      cwd = dirname path
      buffer = []

      out = (f) -> -> buffer.push f arguments...

      Object.assign sandbox,
        out
        $: out
        include: (path) -> do out -> subdocument path

      subdocument path, text

    document

  context globals

export {biscotti as default}
