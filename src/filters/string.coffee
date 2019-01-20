import {isObject, isArray} from "panda-parchment"
import {Method} from "panda-generics"
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
    unit.indent ?= 0
    unit.filter = ->
      result = ""
      for item in buffer
        i = await item
        if i.replace?
          result += i.replace /\n/g, ("\n" + " ".repeat unit.indent)
        else
          result += i
      do clear
      result

    run unit
    do unit.filter

export {filter}
