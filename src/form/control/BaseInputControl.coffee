BaseControl = require './BaseControl'


class BaseInputControl extends BaseControl


	setValue: (value, onlyControl) ->
		super(value)
		@input.setValue(value)  if @input && !onlyControl
		return this


	setDisabled: (disabled) ->
		super(disabled)
		@input.setDisabled(disabled)  if @input
		return this


module.exports = BaseInputControl