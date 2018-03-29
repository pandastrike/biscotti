import {dirname, resolve as resolve} from "path"

include = ({cwd = undefined, isBuffered = true} = {}) ->
  (engine) ->
    {run} = engine.sandbox
    _include = (path) ->
      {get, append, clear, restore} = engine
      cwd ?= engine.cwd
      path = if path[0] == "/" then path else resolve cwd, path
      saved = {cwd, buffer: (do get)}
      cwd = dirname path
      do clear
      result = run {path, include: true}
      restore saved.buffer
      cwd = saved.cwd
      append result if isBuffered
      result

    engine.sandbox.include = _include

export {include}
