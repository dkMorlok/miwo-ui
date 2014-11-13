BaseControl = require './BaseControl'
Color = require '../../input/Color'


class ColorControl extends BaseControl

	xtype: 'colorfield'


	createInput: ->
		picker = new Color
			id: @id
			disabled: @disabled
			resetable: false
		picker.on 'changed', (picker, hex) =>
			@setValue('#'+hex)
			return
		picker.on 'reset', () =>
			@reset()
			return
		return picker


	setValue: (value) ->
		super(value)
		@input.setValue(value)
		return


	onDirtyChange: (isDirty) ->
		@input.setResetable(isDirty)
		return


	initRules: ->
		super()
		@rules.addRule("color")
		return


module.exports = ColorControl