import assert from "assert"
import {resolve} from "path"
import biscotti from "../src/index"

# we need to do this because this path is relative to
# file not where the tests may be run from ...
path = resolve "./test/files/index.bisc"

text = """
  # Greetings!

  :: do $ -> "Hello, Bar!" ::
  """

process = biscotti {require}

do ->
  assert.equal (await process path),
    '# Greetings!\n\n\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!'

  assert.equal (await process path, {text}),
    '# Greetings!\n\nHello, Bar!'
