import {Method} from "panda-generics"
{define} = Method

split = (delimiter) ->
  (string) ->
    if (index = string.indexOf delimiter) >= 0
      before = string.substr 0, index
      after = string.substr index + delimiter.length
      [before, after]
    else
      undefined

# splice = (string, start, deleteCount, items...) ->
#   pre = string[0...start]
#   post = string[(start + deleteCount)...]
#   pre + items.join() + post
#
# readContextIndentation = (before) ->
#   match = /(\r\n|\r|\n)([ ]+)$/.exec before
#   if match?
#     match[2].length
#   else
#     0
#
# setBlockIndent = (block, context) ->
#   output = []
#   subBlocks = block.split "\n"
#   for i in [0...subBlocks.length]
#     if subBlocks[i].length - context <= 0
#       continue
#     spaces = /^([ ]*)/.exec(subBlocks[i])[0].length
#     if spaces - context < 0
#       output.push subBlocks[i]
#       continue
#     output.push splice subBlocks[i], 0, spaces, " ".repeat spaces - context
#
#   output.join "\n"

getIndent = (block) -> (block.match /\n( *)$/)?[1]?.length ? 0

# Based on the embedded block's identation in the parent file, we need to shift
# the code to the left to satisfy the compiler.
deindent = (indent, block) ->
  lines = block.split "\n"
  if lines.length == 1
    block.trim()
  else
    _deindent = (result, current) -> result += current[indent..-1] + "\n"
    lines.reduce _deindent, ""

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
        # set for use by filters when generating output
        unit.indent = getIndent before
        # use string literal syntax here to avoid CS multiline strings
        code.push "append" + JSON.stringify before
        if (_ = (close content))?
          [block, content] = _
          code.push deindent unit.indent, block
      # use string literal syntax here to avoid CS multiline strings
      code.push "append" + JSON.stringify content
      unit.coffeescript = code.join "\n"
      run unit

export {embedded}
