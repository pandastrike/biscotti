# Biscotti

_Embed executable CoffeeScript in your Markdown._

This is probably a thing you have never thought of doing or have always dreamt of doing, depending on how crazy you are.

Let's define a simple `greeting` function we can use in our document.

```markdown
# Biscotti

_Embed executable CoffeeScript in your Markdown._

::: coffee

greeting = append (name) -> "Hello, #{name}!"

:::

I'd like to welcome you. I don't know your name, though, so I'll just call you Foo.

::: coffee

greeting "Foo"

:::
```

> # Biscotti

> _Embed executable CoffeeScript in your Markdown._

> I'd like to welcome you. I don't know your name, though, so I'll just call you Foo.

> Hello, Foo!

How about we break out Markdown file into more manageable pieces?

```markdown
# A Dark And Stormy Night

_by Snoopy_

::: coffee

include "chapter-1"
include "chapter-2"
include "chapter-3"
# you get the idea...

:::

```

## Installation

It's the usual NPM deal.

`npm i -s biscotti`

## Usage

```coffee
import assert from "assert"
import {resolve} from "path"
import fs from "fs"
import biscotti from "../src/index"
import markdownIt from "markdown-it"

# choose whichever Markdown parser you prefer...
# Biscotti just needs a function that will accept
# Markdown and render it...
md = do (parser = markdownIt()) ->
  (markdown) -> parser.render markdown

path = resolve "./test/files/index.bisc"

output = biscotti md
.context path # so you can reuse a vm sandbox if you want
.render fs.readFileSync path, "utf8"

assert.equal output,
  '<p>Hello, Foo!</p>\n'
```

## Markdown API

Right now, Biscotti bundles two built-in functions you can use from within your Markdown documents. (Of course, you can define however many you like.)

- _append_ - Takes a function and returns a function that will append to the render buffer. So if you have a function that, say, generates some Markdown, you can wrap it with `append` so that the Markdown will render.

- _include_ - Takes a path and embeds the document within this document. You can use relative or absolute paths. Extension is optional, assumes `.bisc`. Will also attempt to load `index.bisc` if you give it a directory.
