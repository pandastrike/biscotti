import {loader} from "./loader"
import {fallback} from "./fallback"
import {buffer} from "./buffer"
import {include} from "./include"
import {filter} from "./filters/string"
import {sandbox} from "./sandbox"
import {engine} from "./engine"

renderer = ({globals = {require}}) ->

  engine [
    sandbox: sandbox globals
    loader
      coffeescript:
        index: true
        extensions: [ ".biscotti" ]
    do fallback
    include
    buffer
    filter
  ]

export {renderer as default}
