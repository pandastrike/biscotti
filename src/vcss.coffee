import {loader} from "./loader"
import {fallback} from "./fallback"
import {buffer} from "./buffer"
import {include} from "./include"
import {filter} from "./filters/vcss"
import {sandbox} from "./sandbox"
import {engine} from "./engine"
import {Method} from "fairmont-multimethods"
import {isType} from "fairmont-helpers"

# TODO: Fairmont isEmpty should use isKind for objects?
isEmpty = (x) -> (Object.keys x).length == 0

class Styles
  @create: -> new Styles
class Properties
  @create: -> new Properties
class Value
class Units extends Value
  @create: -> new Units arguments...
  constructor: ({@name, @value}) -> super()
units = (name, value) -> Units.create {name, value}

# TODO: I need to use duck-typing here
# because VM literals have different
# prototypes/constructors that those
# in closures from outside the VM

isDefined = (x) -> x != undefined
isFunction = (x) -> x.call?
isArray = (x) -> x.forEach?
isObject = (x) -> x.constructor.assign?

mix = do Method.create

Method.define mix, isFunction, isObject,
  (mixin, target) -> mixin target

Method.define mix, isArray, isObject,
  (mixins, target) ->
    for mixin in mixins
      mix mixin, target

render = do Method.create

Method.define render, isDefined,
  (value) -> "#{value}"

Method.define render, (isType Styles),
  (styles) ->
    (for selector, properties of styles when ! isEmpty properties
      "#{selector} {
          #{render properties}
        }").join "\n"

Method.define render, (isType Properties),
  (properties) ->
    (for name, value of properties
      "#{name}: #{render value};").join " "

Method.define render, (isType Units),
  ({name, value}) -> "#{value}#{name}"

CSS =

  render: render

  s: (_selector, mixins) ->
    (target = {}) ->
      styles = (target.styles ?= do Styles.create)
      target.selector ?= ""
      selector = _selector.replace /\&/, target.selector
      style = styles[selector] ?= do Properties.create
      mix mixins, {styles, style, selector}
      styles

  p: (name, value) ->
    ({style}) ->
      style[name] = value
      style

  units: units

  rem: (number) -> units "rem", number

  pct: (number) -> number / 100

  scale: ({name, value}, factor) ->
    value *= factor
    units name, value


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

export {vcss, CSS}
