import {dirname, resolve as resolve} from "path"

create = ({cwd, load, evaluate}) ->
  (path) ->
    unit = load (if path[0] == "/" then path else resolve cwd, path)
    saved = cwd
    cwd = dirname unit.path
    evaluate unit
    cwd = saved
    unit

mixin = ({cwd, load, evaluate}) ->
  (sandbox) ->
    sandbox.include = create {cwd, load, evaluate}

Include = {create, mixin}

export {Include as default}
