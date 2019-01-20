import {resolve} from "path"
import assert from "assert"
import {print, test} from "amen"
import {loader, fallback, buffer, include,
  filters, sandbox, engine} from "../src"

verify = ({before, actual, expected}) ->
  -> assert.equal expected, await actual do before

before = ->
  engine [
    sandbox: sandbox {require}
    loader
      coffeescript:
        index: true
        extensions: [ ".biscotti" ]
    do fallback
    do include
    buffer
    filters.string
  ]

do ->

  print await test "biscotti", [

    test "from path", verify
      before: before
      actual: (render) -> render path: resolve "./test/files/index.biscotti"
      expected: "# Greetings!\n\nThis is a test.\n\n\
        Hello, Foo!\n\nGoodbye, now!"

    test "from content", verify
      before: before
      actual: (render) -> render
        content: """
          do $ -> "# Greetings!\\n\\n"

          do $ -> "Hello, Bar!"
          """
      expected: '# Greetings!\n\nHello, Bar!'

]
