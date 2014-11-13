Button = require '../../buttons/Button'


class ButtonControl extends Button

	constructor: (config = {}) ->
		if config.label then config.text = config.label
		super(config)



class SubmitButton extends ButtonControl

	isSubmitButton: true
	xtype: 'submitbutton'
	type: 'primary'



class ResetButton extends ButtonControl

	isResetButton: true
	xtype: 'submitbutton'



module.exports =
	ButtonControl: ButtonControl
	SubmitButton: SubmitButton
	ResetButton: ResetButton