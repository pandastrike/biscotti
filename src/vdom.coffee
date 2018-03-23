import {loader} from "./loader"
import {fallback} from "./fallback"
import {buffer} from "./buffer"
import {include} from "./include"
import {filter} from "./filters/vdom"
import {sandbox} from "./sandbox"
import {engine} from "./engine"
import {HTML} from "panda-vdom"

vdom = do ->

  globals = Object.assign {}, {require}, HTML

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

export {vdom as default}
