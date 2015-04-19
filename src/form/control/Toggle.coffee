BaseControl = require './BaseControl'
ToggleInput = require '../../input/Toggle'

class ToggleControl extends BaseControl

	xtype: 'toggle'
	onState: undefined
	offState: undefined
	onText: undefined
	offText: undefined
	size: undefined
	value: false


	createInput: ->
		return new ToggleInput
			id: @id+'-input'
			inputName: @name
			size: @size
			onState: @onState
			offState: @offState
			onText: @onText
			offText: @offText


	setValue: (value) ->
		@input.setValue(value)
		super(value)
		return


	setDisabled: (disabled) ->
		@input.setDisabled(disabled)
		super(disabled)
		return


	setReadonly: (readonly) ->
		@input.setReadonly(readonly)
		return


	renderControl: (ct) ->
		@getInput().render(ct)
		return


	afterRenderControl: ->
		@input.setValue(@value)
		@input.setDisabled(@disabled)
		@input.setReadonly(@readonly)
		@input.on 'change', => @setValue(@input.getValue())
		return


module.exports = ToggleControl