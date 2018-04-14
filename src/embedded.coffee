import {Method} from "fairmont-multimethods"
{define} = Method

split = (delimiter) ->
  (string) ->
    if (index = string.indexOf delimiter) >= 0
      before = string.substr 0, index
      after = string.substr index + delimiter.length
      [before, after]
    else
      undefined

# TODO: should this be configurable?
isBiscotti = (unit) -> unit.biscotti? & !unit.coffeescript?

embedded = (open, close) ->

  close ?= open

  open = split open
  close = split close

  (engine) ->
    {sandbox, append} = engine
    {run} = sandbox
    define run, isBiscotti, (unit) ->
      {path, content, language} = unit
      code = []
      while (_ = (open content))?
        [before, content] = _
        code.push "append" + JSON.stringify before
        if (_ = (close content))?
          [block, content] = _
          code.push block.trim()
      code.push "append" + JSON.stringify content
      unit.coffeescript = code.join "\n"
      run unit

export {embedded}
