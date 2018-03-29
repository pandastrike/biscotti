import {Method} from "fairmont-multimethods"
{define} = Method

# TODO: implement before, after, and wrap for generics
# This is a hack, where we use a flag on the argument
# to ensure we don't hit an infinite loop

isNotFiltered = (unit) ->
  # TODO: biscotti files don't have javascript defined!
  unit.javascript? && !unit.filter?

filter = (engine) ->
  {append, get, clear, sandbox} = engine
  {run} = sandbox

  define run, isNotFiltered, (unit) ->
    buffer = do get
    unit.filter = ->
      result = ""
      for item in buffer
        result += await item
      do clear
      result

    run unit
    do unit.filter

export {filter}
