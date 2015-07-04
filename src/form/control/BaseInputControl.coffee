BaseControl = require './BaseControl'


class BaseInputControl extends BaseControl


	setValue: (value, onlyControl) ->
		super(value)
		@input.setValue(value, true)  if @input && !onlyControl
		return this


	setDisabled: (disabled) ->
		super(disabled)
		@input.setDisabled(disabled)  if @input
		return this


	setReadonly: (@readonly) ->
		@input.setReadonly(@readonly)  if @input && @input.setReadonly
		return this


	afterRenderControl: ->
		input = @getInput()
		input.on('focus', @bound('onInputFocus'))
		input.on('blur', @bound('onInputBlur'))
		return


	onInputFocus: ->
		@setFocus()
		return


	onInputBlur: ->
		@validate()
		@blur()
		return


module.exports = BaseInputControl