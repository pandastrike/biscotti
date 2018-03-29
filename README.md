# Biscotti

Like Legos for building domain-specific languages (DSLs).

For example, suppose we want an HTML DSL. We can implement one that uses CoffeeScript and VDOM like this:

```coffee
import {loader, fallback, buffer, include,
  filters, sandbox, engine} from "biscotti"
import {HTML} from "panda-vdom"

render = do ->

  globals = Object.assign {}, {require}, HTML

  engine [
    sandbox: sandbox globals
    loader
      coffeescript:
        index: true
        extensions: [ ".vhtml" ]
    do fallback
    include isBuffered: false
    buffer
    filters.string
  ]

export {render as default}
```

You could then call the resulting `render` function:

```coffee
# will load ./html/index.vhtml
render path: "./vhtml"
```

You _probably_ don't want to use this directly. Instead, check out the various engines we've written that use Biscotti:

- [biscotti-coffee](https://github.com/pandastrike/biscotti-coffee)
- [biscotti-cpp](https://github.com/pandastrike/biscotti-cpp)
- [biscotti-html](https://github.com/pandastrike/biscotti-html)
- [biscotti-css](https://github.com/pandastrike/biscotti-css)

## Usage

The `engine` function takes an array containing an initial definition of the engine and a list of mixins that will add capabilities to it. Typically, that initial definition defines the `sandbox` property, whose value must be a _sandbox_, which is a V8 VM. It returns a render function that takes an options object with either a `path` (and option `encoding`) or a `content` property.

## Mixins

Mixins include:

- `loader` - A dictionary of file types and descriptions for loading a file given a path. The `index` property determines whether to try adding `index` to the path. The `extensions` property is a list of extensions to try.

- `fallback` - Defines the assumptions to make if no path is given. The default is to assume a CoffeeScript file. You can pass an options object with a `language` property to provide a different fallback.

- `include` — Adds an `include` method to the sandbox's globals. This allows a given file to include another file using a relative path. Effectively allows for the equivalent of partials, or partial templates.

- `buffer` — Adds functions to the sandbox's globals allowing included files to add values to a buffer. This way you can return values from the files your engine processes. The `get` function returns the buffer, in case you want to manipulate it from within a file. The `append` function adds to it. The `$$` function is equivalent to `append`. The `$` modifies another function so that it's return value is appended to the buffer.

- `filters` — Includes various post-processing functions for transforming the buffer into a usable return value. `filters.string` converts each element into a string and appends it to single return string.

- `embedded` — Allows you to process arbitrary text, embedding code between delimiters. You must provide an options object with the delimiters as `open` and `close` (which will default to `open` if undefined).  

## Language Support

Biscotti supports JavaScript and CoffeeScript out of the box. You can add support for additional languages by adding definitions to the sanbox's generic `run` method. See the code for the [`sandbox`](./src/sandbox.coffee) and [`embedded`](./src/embedded.coffee) mixins for examples.
