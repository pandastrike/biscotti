import fs from "fs"
import {dirname, join} from "path"
import {Method} from "panda-generics"
{define} = Method

trim = (s) -> s.trim()

isNotLoaded = (unit) -> !unit.content?

loader = (description) ->

  candidates = (vpath) ->
    result = {}
    for language, {index, extensions} of description
      result[language] = [ vpath ]
      for extension in extensions
        result[language].push (vpath + extension)
        if index?
          result[language].push join vpath, ("index" + extension)
    result

  load = (unit) ->
    if unit.path?
      unit.encoding ?= "utf8"
      for language, paths of candidates unit.path
        for path in paths
          try
            unit.content = trim fs.readFileSync path, unit.encoding
            unit[language] = unit.content
            return unit
      throw "[#{unit.path}] not found"

  (engine) ->

    engine.load = engine.sandbox.load = load

    {run} = engine.sandbox
    define run, isNotLoaded, (unit) ->
      engine.cwd ?= dirname unit.path
      run load unit

    engine

export {loader}
