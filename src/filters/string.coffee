import {Method} from "fairmont-multimethods"
{define} = Method

# TODO: implement before, after, and wrap for generics
# This is a hack, where we use a flag on the argument
# to ensure we don't hit an infinite loop

isNotFiltered = (unit) -> unit.javascript? && !unit.filter?

filter = (engine) ->
  {buffer, clear, sandbox} = engine
  {run} = sandbox

  define run, isNotFiltered, (unit) ->
    unit.filter = ->
      result = ""
      while buffer.length > 0
        result += await do buffer.shift
      $p {result}
      result
    run unit
    do unit.filter

export {filter}
