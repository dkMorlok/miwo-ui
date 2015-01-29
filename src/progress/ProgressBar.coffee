Bar = require './Bar'

class ProgressBar extends Miwo.Container

	bar: null
	baseCls: 'progress'


	constructor: (config) ->
		@bar = new Bar(config)
		super(config)
		return


	doInit: ->
		super
		@add('bar', @bar)
		return


	setValue: (value) ->
		return @bar.setValue(value)


	setDescription: (desc) ->
		return @bar.setDescription(desc)


	setType: (type) ->
		return @bar.setType(type)


	setActive: (active) ->
		return @bar.setActive(active)


	setHideValue: (hideValue) ->
		return @bar.setHideValue(hideValue)


	getValue: ->
		return @bar.getValue()


module.exports = ProgressBar