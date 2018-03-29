buffer = (engine) ->
  _buffer = []
  get = -> _buffer
  append = (value) -> _buffer.push value
  clear = -> _buffer = []
  restore = (buffer) -> _buffer = buffer
  Object.assign engine, { get, append, clear, restore }
  Object.assign engine.sandbox, {
    get
    append
    # TODO: possibly make these part of a separate mixin?
    $: (f) -> -> append f arguments...
    $$: append
    clear
    restore
  }
  engine

export {buffer}
