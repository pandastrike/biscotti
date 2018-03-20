buffer = (engine) ->
  _buffer = []
  append = (value) -> _buffer.push value
  clear = -> _buffer = []
  Object.assign engine, { buffer: _buffer, append, clear }
  Object.assign engine.sandbox, {
    buffer: _buffer
    append
    # TODO: possibly make these part of a separate mixin?
    $: (f) -> -> append f arguments...
    $$: append
    clear
  }
  engine

export {buffer}
