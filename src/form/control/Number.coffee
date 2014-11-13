TextControl = require './Text'


class NumberControl extends TextControl

	xtype: "numberfield"
	type: 'number'
	min: null
	max: null
	pattern: /[\d\.\-]/


	setValue: (value) ->
		value = @min  if @min isnt null and value < @min
		value = @max  if @max isnt null and value > @max
		super(value)
		return


	initRules: ->
		super()
		@rules.addRule("number")
		@rules.addRule("min", null, @min)  if @min isnt null
		@rules.addRule("max", null, @max)  if @max isnt null
		return


	createInput: ->
		input = super()
		input.el.addClass("number")
		input.el.set("min", @min)  if @min isnt null
		input.el.set("max", @max)  if @max isnt null
		return input


module.exports = NumberControl