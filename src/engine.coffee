engine = (list) ->
  [object, mixins...] = list
  mixin object for mixin in mixins
  object.sandbox.run

export {engine}
