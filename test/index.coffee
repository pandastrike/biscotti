import assert from "assert"
import {resolve} from "path"
import fs from "fs"
import biscotti from "../src/index"
import markdownIt from "markdown-it"

md = do (parser = markdownIt()) ->
  (markdown) -> parser.render markdown

path = resolve "./test/files/index.bisc"

output = biscotti md
.context path, require
.render fs.readFileSync path, "utf8"

assert.equal output,
  '<p>Hello, Foo!</p>\n'
