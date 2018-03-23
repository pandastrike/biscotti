import {loader} from "./loader"
import {buffer} from "./buffer"
import {fallback} from "./fallback"
import {include} from "./include"
import {filter} from "./filters/string"
import {sandbox} from "./sandbox"
import {embedded} from "./embedded"
import {engine} from "./engine"

processor = ({globals = {require}, open = "::", close}) ->

  engine [
    sandbox: sandbox globals
    loader
      biscotti:
        index: true
        extensions: [ ".bpp" ]
    fallback language: "biscotti"
    do include
    buffer
    embedded open, close
    filter
  ]

export {processor as default}
