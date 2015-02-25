BaseControl = require './BaseControl'
SwitchInput = require '../../input/Switch'

class SwitchControl extends BaseControl

	xtype: 'switch'
	onState: undefined
	offState: undefined
	onText: undefined
	offText: undefined


	createInput: ->
		return new SwitchInput
			id: @id
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


module.exports = SwitchControl