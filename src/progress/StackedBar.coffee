Bar = require './Bar'

class StackedBar extends Miwo.Container

	baseCls: 'progress'

	addBar: (name, config) ->
		return @add(name, new Bar(config))


module.exports = StackedBar