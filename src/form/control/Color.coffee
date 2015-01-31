BaseControl = require './BaseControl'
ColorInput = require '../../input/Color'


class ColorControl extends BaseControl

	xtype: 'colorfield'
	resettable: false

	createInput: ->
		picker = new ColorInput
			id: @id
			disabled: @disabled
			resettable: @resettable
		picker.on 'changed', (picker, hex) =>
			@setValue('#'+hex)
			return
		picker.on 'reset', =>
			@reset()
			return
		return picker


	setValue: (value) ->
		super(value)
		@input.setValue(value)
		return


	onDirtyChange: (isDirty) ->
		@input.setResettable(isDirty)
		return


	initRules: ->
		super()
		@rules.addRule("color")
		return


module.exports = ColorControl