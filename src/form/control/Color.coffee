BaseControl = require './BaseControl'
ColorInput = require '../../input/Color'


class ColorControl extends BaseControl

	xtype: 'colorfield'
	readonly: false



	doInit: ->
		super
		if @value then @value = @value.toUpperCase()
		return


	createInput: ->
		picker = new ColorInput
			id: @id
			disabled: @disabled
			readonly: @readonly
			resettable: false
		picker.on 'changed', (picker, hex) =>
			@setValue('#'+hex)
			return
		picker.on 'reset', =>
			@reset()
			return
		return picker


	setValue: (value) ->
		if value then value = value.toUpperCase()
		super(value)
		@input.setValue(value)
		return


	onDirtyChange: (isDirty) ->
		super(isDirty)
		@input.setResettable(isDirty)
		return


	initRules: ->
		super()
		@rules.addRule("color")
		return


module.exports = ColorControl