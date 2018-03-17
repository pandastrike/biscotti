import Loader from "./loader"
import Include from "./include"
import Buffer from "./buffer"
import Unit from "./unit"
import Sandbox from "./sandbox"

processor = ({globals = {require}, open = "::", close}) ->

  close ?= open

  sandbox = Sandbox.create globals

  load = Loader.create
    candidates: (path) ->
      coffeescript: [
        path
        "#{path}.bpp"
        "#{path}/index.bpp"
      ]

  filter = (sandbox) ->
    result = ""
    while sandbox.buffer.length > 0
      result += await do sandbox.buffer.shift
    result

  insertions = []

  split = (delimiter) ->
    (string) ->
      if (index = string.indexOf delimiter) >= 0
        before = string.substr 0, index
        after = string.substr index + delimiter.length
        [before, after]
      else
        undefined

  open = split open
  close = split close

  evaluate = (unit) ->
    {path, content, language} = unit
    while (_ = (open content))?
      [before, content] = _
      sandbox.append before

      if (_ = (close content))?
        [block, content] = _
        Sandbox.run sandbox, Unit.create {path, content: block, language}
    sandbox.append content

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
    filter sandbox

export {processor as default}
