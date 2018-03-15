mixin = (sandbox) ->
  buffer = []
  append = (value) -> buffer.push value
  Object.assign sandbox, {
    buffer
    append
    $: (f) -> -> append f arguments...
    $$: append
  }

Buffer = {mixin}

export {Buffer as default}
