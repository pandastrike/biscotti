import vm from "vm"
import coffeescript from "coffeescript"
import {Method} from "fairmont-multimethods"
{define} = Method

isCoffeeScript = (unit) -> unit.coffeescript? && !unit.javascript?
isJavaScript = (unit) -> unit.javascript?
isSandbox = (sandbox) -> vm.isContext sandbox

sandbox = (globals) ->

  _sandbox = vm.createContext globals

  run = Method.create
    description: "Runs a JavaScript program in a sandbox"
    default: (unit) ->
      throw "biscotti: Don't know how to run [#{unit.path}]"

  define run, isJavaScript, (unit) ->
    vm.runInContext unit.javascript, _sandbox,
      filename: unit.path
      displayErrors: true

  define run, isCoffeeScript, (unit) ->
    unit.javascript ?= do ->
      coffeescript.compile unit.coffeescript,
        bare: true
        filename: unit.path
        transpile: presets: [[ 'env', targets: node: "6.10" ]]
    run unit

  _sandbox.run = run

  _sandbox

export {sandbox}
