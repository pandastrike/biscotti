import {Method} from "panda-generics"
{define} = Method

isUnknown = (unit) -> unit.content? && !unit.path? && !unit.language?

defaults =
  path: "* eval *"
  language: "coffeescript"

fallback = (description = {}) ->
  description = Object.assign {}, defaults, description
  {language} = description

  (engine) ->
    {run} = engine.sandbox
    define run, isUnknown, (unit) ->
      Object.assign unit, description
      unit[language] ?= unit.content
      run unit

export {fallback}
