global.$p = -> console.error arguments...
import assert from "assert"
import {resolve} from "path"
import processor from "../src/processor"
import renderer from "../src/renderer"


do ->

  # we need to do this because this path is relative to
  # file not where the tests may be run from ...
  path = resolve "./test/files/index.bpp"

  content = """
    # Greetings!

    :: do $ -> "Hello, Bar!" ::
    """

  process = processor {require}

  do ->
    assert.equal (await process {path}),
      '# Greetings!\n\n\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!'

    assert.equal (await process {content}),
      '# Greetings!\n\nHello, Bar!'


do ->

  # we need to do this because this path is relative to
  # file not where the tests may be run from ...
  path = resolve "./test/files/index.biscotti"

  content = """
    do $ -> "# Greetings!\\n\\n"

    do $ -> "Hello, Bar!"
    """

  render = renderer {require}

  do ->
    assert.equal (await render {path}),
      '# Greetings!\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!'

    assert.equal (await render {content}),
      '# Greetings!\n\nHello, Bar!'
