BaseInputControl = require './BaseInputControl'
Checkbox = require '../../input/Checkbox'


class CheckboxControl extends BaseInputControl

	xtype: "checkbox"
	value: false
	isBoxControl: true


	createInput: ->
		checkbox = new Checkbox
			id: @id+'Input'
			label: @label
		checkbox.on 'change', =>
			@setValue(!@getValue())
			return
		return checkbox


	isChecked: ->
		return @value is true


	isFilled: ->
		return @isChecked()


	renderLabel: ->
		return


	renderControl: (ct) ->
		ct.addClass('input-control')
		input = @getInput()
		input.render(ct)
		return


module.exports = CheckboxControl