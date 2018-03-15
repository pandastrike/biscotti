
defaults =
  encoding: "utf8"
  path: "* eval *"

create = (description) ->
  {language, content} = description
  (description[language] ?= content) if language?
  Object.assign {}, defaults, description

Unit = {create}
export {Unit as default}
