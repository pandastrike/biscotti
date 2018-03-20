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
isBiscotti = (unit) -> unit.biscotti?

embedded = (open, close) ->

  close ?= open

  open = split open
  close = split close

  (engine) ->
    {sandbox, append} = engine
    {run} = sandbox
    define run, isBiscotti, (unit) ->
      {path, content, language} = unit
      while (_ = (open content))?
        [before, content] = _
        append before
        if (_ = (close content))?
          [block, content] = _
          sandbox.run {path, content: block, language}
      sandbox.append content

export {embedded}
