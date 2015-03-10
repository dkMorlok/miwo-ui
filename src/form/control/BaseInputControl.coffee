BaseControl = require './BaseControl'


class BaseInputControl extends BaseControl


	setValue: (value) ->
		super(value)
		@input.setValue(value)  if @input
		return this


	setDisabled: (disabled) ->
		super(disabled)
		@input.setDisabled(disabled)  if @input
		return this


module.exports = BaseInputControl