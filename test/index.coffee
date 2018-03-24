global.$p = -> console.error arguments...
$p.H = -> $
import assert from "assert"
import {resolve} from "path"
import processor from "../src/processor"
import renderer from "../src/renderer"
import vdom from "../src/vdom"
import {HTML} from "panda-vdom"
import {print, test} from "amen"
import {vcss, CSS} from "../src/vcss"


do ->

  print await test "Biscotti", [

    test "Pre-processor engine", do ->

      [

        test "from path", ->
          process = processor {require}

          # we need to do this because this path is relative to
          # file not where the tests may be run from ...
          path = resolve "./test/files/index.bpp"
          result = await process {path}
          assert.equal result,
            '# Greetings!\n\n\n\nThis is a test.\n\n\
              Hello, Foo!\n\nGoodbye, now!'

        test "from string", ->
          process = processor {require}

          content = """
            # Greetings!

            :: do $ -> "Hello, Bar!" ::
            """
          result = await process {content}
          assert.equal result,
            '# Greetings!\n\nHello, Bar!'
      ]

    test "Rendering engine", do ->

      [

        test "from path", ->
          render = renderer {require}

          # we need to do this because this path is relative to
          # file not where the tests may be run from ...
          path = resolve "./test/files/index.biscotti"
          result = await render {path}
          assert.equal result,
            '# Greetings!\n\nThis is a test.\n\nHello, Foo!\n\nGoodbye, now!'

        test "from path (with import)", ->
          render = renderer {require}

          result = await render path: resolve "./test/files/html/index.biscotti"
          assert.equal result,
            "<html><body><h1>Hello, World!</h1></body></html>"

        test "from content", ->
          render = renderer {require}

          content = """
            do $ -> "# Greetings!\\n\\n"

            do $ -> "Hello, Bar!"
            """
          result = await render {content}
          assert.equal result,
            '# Greetings!\n\nHello, Bar!'

      ]

    test "VDOM", ->

      documents = await vdom path: resolve "./test/files/vdom/index.vdom"
      assert.equal documents.length, 1
      result = HTML.render documents[0]
      assert.equal result,
        "<html><body><h1>Hello, World!</h1></body></html>",

    test "VCSS", ->
      sheets = await vcss path: resolve "./test/files/vcss/index.vcss"
      result = CSS.render do sheets[0]
      assert result, """
        article > h1 { font-size: 3.6rem; line-height: 4rem; }
        article > p { font-face: Montserrat; }
       """
]
