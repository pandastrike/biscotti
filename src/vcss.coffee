import {loader} from "./loader"
import {fallback} from "./fallback"
import {buffer} from "./buffer"
import {include} from "./include"
import {filter} from "./filters/vcss"
import {sandbox} from "./sandbox"
import {engine} from "./engine"

mix = (mixins, target) ->
  for mixin in mixins
    if mixin.call?
      mixin target
    else if mixin.slice?
      mix mixin, target

CSS =

  s: (selector, mixins) ->
    (styles) ->
      mix mixins, (styles[selector] ?= {})
      styles

  p: (name, value) ->
    (style) ->
      style[name] = value
      style

  unit: unit = (name, value) -> {name, value}

  rem: (number) -> unit "rem", 4

  pct: (number) -> number / 100

  scale: ({name, value}, factor) ->
    value *= factor
    {name, value}


vcss = do ->

  globals = Object.assign {}, {require}, CSS

  engine [
    sandbox: sandbox globals
    loader
      coffeescript:
        index: true
        extensions: [ ".vdom" ]
    do fallback
    include isBuffered: false
    buffer
    filter
  ]

export {vcss as default}
