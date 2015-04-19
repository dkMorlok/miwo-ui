BaseInputControl = require './BaseInputControl'
ColorInput = require '../../input/Color'


class ColorControl extends BaseInputControl

	xtype: 'colorfield'
	readonly: false
	resettable: false


	doInit: ->
		super
		if @value then @value = @value.toLowerCase()
		return


	setValue: (value) ->
		value = value.toLowerCase() if value
		super(value)
		return this


	createInput: ->
		input = new ColorInput
			id: @id+'Input'
			disabled: @disabled
			readonly: @readonly
		input.on 'changed', (input, value) =>
			@emit('inputchange', this, value)
			return
		input.on 'selected', (input, value) =>
			@setValue(value)
			return
		input.on 'reset', =>
			@reset()
			return
		return input


	onDirtyChange: (isDirty) ->
		super(isDirty)
		@input.setResettable(isDirty) if @resettable
		return


	initRules: ->
		super()
		@rules.addRule("color")
		return


module.exports = ColorControl