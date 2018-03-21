import {dirname, resolve as resolve} from "path"

include = do (cwd = undefined) ->
  (engine) ->
    {run} = engine.sandbox
    _include = (path) ->
      cwd ?= engine.cwd
      path = if path[0] == "/" then path else resolve cwd, path
      saved = cwd
      cwd = dirname path
      result = run {path, include: true}
      cwd = saved
      result

    engine.sandbox.include = _include

export {include}
