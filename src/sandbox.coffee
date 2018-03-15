import vm from "vm"
import coffeescript from "coffeescript"
import {Method} from "fairmont-multimethods"
import Unit from "./unit"

run = Method.create
  description: "Run a biscotti unit (file or from memory)"
  default: (sandbox, unit) ->
    throw "biscotti: Don't know how to run [#{unit.path}]"

isCoffeeScript = (unit) -> unit.coffeescript? && !unit.javascript?
isJavaScript = (unit) -> unit.javascript?
isSandbox = (sandbox) -> vm.isContext sandbox

Method.define run, isSandbox, isCoffeeScript, (sandbox, unit) ->
  unit.javascript ?= do ->
    coffeescript.compile unit.coffeescript,
      bare: true
      filename: unit.path
      transpile: presets: [[ 'env', targets: node: "6.10" ]]
  run sandbox, unit

Method.define run, isSandbox, isJavaScript, (sandbox, unit) ->
  vm.runInContext unit.javascript, sandbox,
    filename: unit.path
    displayErrors: true

create = (globals) -> vm.createContext globals

Sandbox = {run, create}

export {Sandbox as default}
