import assert from "assert"
import {resolve} from "path"
import fs from "fs"
import biscotti from "../src/index"
import markdownIt from "markdown-it"

md = do (parser = markdownIt()) ->
  (markdown) -> parser.render markdown

path = resolve "./test/files/index.bisc"

process = biscotti require

do ->
  assert.equal (await process path),
    '# Greetings!\n\n\n\n\nThis is a test.\n\nHello, Foo!\n'
