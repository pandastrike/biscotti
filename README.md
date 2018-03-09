# Biscotti

_Like M4, but in CoffeeScript._

Put CoffeeScript in your Markdown or YAML…or anywhere else! This is probably a thing you have never thought of doing or have always dreamt of doing, depending on your tolerance for madness.

If you're familiar with [M4](https://www.gnu.org/software/m4/manual/m4.html), just imagine that, but with CoffeeScript, complete with full the latest EcmaScript goodies, including Promises and `import`.

If you're not familiar with M4, or your only familiarity with it is because `make config` didn't work, imagine a templating language like Handlebars, except that it laughs in face of phrases like “logicless templates.”

Suppose we're writing in Markdown, and we get tired of writing the Markdown for greetings. (I know, implausible, but just go with it.) We can define a simple `greeting` function we can use anywhere in our document.

```markdown
# Biscotti

_Like M4, but in CoffeeScript._

:: greeting = $ (name) -> "Hello, #{name}!" ::

```

That little `$` is a “built-in” that takes the result of the function and includes it in the output that will replace our code block. (If for some reason, you wanted to load JQuery, `$` is an alias for `out`.)

Suppose we want to welcome our friend Foo. (Like I said, just go with it.) We can just invoke our function.

```
:: greeting "Foo" ::
```

> # Biscotti
>
> _Embed executable CoffeeScript in your Markdown._
>
>
> Hello, Foo!

How about we break out Markdown file into more manageable pieces?

```markdown
# A Dark And Stormy Night

_by Snoopy_

::

include "chapter-1"
include "chapter-2"
include "chapter-3"
# you get the idea...

::

```

And, yup, `include` is another built-in.

You can also use `import` to reuse code from other modules. You just need to pass in an implementation of `require` to a Biscotti instance's `context` method.

```markdown

:: import {chapter} from "my-biscotti-helpers" ::

# :: coffee chapter title: "Once Upon A Time" ::

Once upon a time, in a land far, far away…
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

# pass in your require to import local packages
process = biscotti {require}

# returns post-processed result
process "./my-novel.bisc"
```

## API

### _biscotti [globals] &rarr; processor_

- _globals_ - An object whose properties will be available as global variables in a document's execution context. If you want to use `import`, you'll want to provide a `require` property, which should be a Node-compatible `require` function that takes a module name or absolute or relative path and returns the corresponding module's exports. Defaults to use the module's own `require`.

- _processor_ - a function for processing documents.

The default export of the biscotti module is a function that takes an optional `require` function and returns a processor function. What that means is that any updates to globals will be carried over from one call to the next.

A processor keeps its execution sanbox across invocations.

### _processor path, [options] &rarr; processed-document_

- _options_ - An object describing options for processing a given document.

  - _text_ - If you already have the document you want to process in memory, you can simply pass it as an option. In this case, the _path_ argument is used only to resolve includes and for error messages. Defaults to the contents of the file at _path_.

  - _encoding_ - String that determines the encoding used when reading the file. Defaults to `utf8`. Ingored when `text` option is provided.

  - _open_ - String determining the open delimiter for code blocks. Defaults to `::`.

  - _close_ - String determining the close delimiter for code blocks. Defaults to the value of _open_.

- _processed-document_ -
