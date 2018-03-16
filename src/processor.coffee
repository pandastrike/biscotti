import Loader from "./loader"
import Include from "./include"
import Buffer from "./buffer"
import Unit from "./unit"
import Sandbox from "./sandbox"

processor = ({globals = {require}, open = "::", close}) ->

  close ?= open

  pattern = ///#{open}\s*([^]*?)\s*#{close}///gm

  sandbox = Sandbox.create globals

  load = Loader.create
    candidates: (path) ->
      coffeescript: [
        path
        "#{path}.bpp"
        "#{path}/index.bpp"
      ]

  mv = (a, b) -> (b.push do a.shift) while a.length > 0

  filter = (buffer) ->
    result = ""
    (result += await item) for item in buffer
    result

  insertions = []

  evaluate = (unit) ->
    {path, content, language} = unit
    sandbox.append content.replace pattern, (_, content) ->
      buffer = []
      placeholder = "#{open}#{insertions.length}#{close}"
      insertions.push (content) ->
        content.replace ///#{placeholder}///gm, await filter buffer
      Sandbox.run sandbox, Unit.create {path, content, language}
      mv sandbox.buffer, buffer
      placeholder

  include = Include.mixin { cwd: process.cwd(), load, evaluate }

  include sandbox

  Buffer.mixin sandbox

  ({path, content}) ->
    if content?
      evaluate Unit.create { language: "coffeescript", path, content }
    else if path?
      sandbox.include path
    else
      throw "biscotti: either path or content required"

    result = do sandbox.buffer.shift
    for insertion in insertions
      result = await insertion result
    result


export {processor as default}
