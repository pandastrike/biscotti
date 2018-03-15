import fs from "fs"
import Unit from "./unit"

trim = (s) -> s.trim()

create = ({candidates, encoding = "utf8"}) ->
  (path) ->
    unit = do (_path = path) ->
      for language, paths of candidates _path
        for path in paths
          try
            content = trim fs.readFileSync path, encoding
            return Unit.create {
              path
              encoding
              language
              content
            }
      throw "biscotti: [#{_path}] not found"

Loader = {create}

export {Loader as default}
