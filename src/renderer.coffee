import {loader} from "./loader"
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
    include
    buffer
    filter
  ]

export {renderer as default}
