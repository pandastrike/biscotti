import Loader from "./loader"
import Include from "./include"
import Buffer from "./buffer"
import Unit from "./unit"
import Sandbox from "./sandbox"
import {dirname} from "path"

renderer = (globals = {require}) ->

  sandbox = Sandbox.create globals

  load = Loader.create
    candidates: (path) ->
      coffeescript: [
        path
        "#{path}.biscotti"
        "#{path}/index.biscotti"
      ]

  evaluate = (unit) -> Sandbox.run sandbox, unit

  include = Include.mixin { cwd: process.cwd(), load, evaluate }

  include sandbox

  Buffer.mixin sandbox

  # package as a set of filters?
  filter = (sandbox) ->
    result = ""
    while sandbox.buffer.length > 0
      result += await do sandbox.buffer.shift
    result

  ({path, content}) ->
    if content?
      # do we need a way to set cwd here?
      Sandbox.run sandbox, Unit.create {
        language: "coffeescript"
        path
        content
      }
    else if path?
      # what if we want a different encoding?
      sandbox.include path
    else
      throw "biscotti: either path or content required"
    filter sandbox

export {renderer as default}
