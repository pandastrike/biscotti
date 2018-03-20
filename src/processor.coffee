import {loader} from "./loader"
import {buffer} from "./buffer"
import {include} from "./include"
import {filter} from "./filters/string"
import {sandbox} from "./sandbox"
import {embedded} from "./embedded"
import {engine} from "./engine"

processor = ({globals = {require}, open = "::", close}) ->

  engine [
    sandbox: sandbox globals
    loader
      coffeescript:
        index: true
        extensions: [ ".bpp" ]
    include
    buffer
    embedded open, close
    filter
  ]

export {processor as default}
