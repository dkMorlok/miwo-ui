BaseControl = require './BaseControl'
Checkbox = require '../../input/Checkbox'


class CheckboxControl extends BaseControl

	xtype: "checkbox"
	value: false
	isBoxControl: true


	createInput: () ->
		return new Checkbox
			id: @id
			label: @label


	setValue: (value) ->
		super(value)
		@input.setChecked(!!value)
		return


	isChecked: () ->
		return @value is true


	isFilled: () ->
		return @isChecked()


	setDisabled: (disabled) ->
		super(disabled)
		@input.setDisabled(disabled)
		return


	renderLabel: (ct) ->
		return


	renderControl: (ct) ->
		ct.addClass('input-control')
		input = @getInput()
		input.render(ct)

		input.setChecked(@isChecked())
		input.setDisabled(@disabled)

		input.on 'change', ()=> @setValue(!@getValue())
		input.on 'focus', ()=> @setFocus()
		return



module.exports = CheckboxControl