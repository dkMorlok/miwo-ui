BaseTextControl = require './BaseTextControl'


class TextControl extends BaseTextControl

	isTextField: true
	xtype: 'textfield'


	initRules:  ->
		super
		switch @type
			when 'email' then @rules.addRule('email')
			when 'url' then @rules.addRule('url')
			when 'date' then @rules.addRule('date')
		return


	onSpecialkey: (control, key, e) ->
		if key is 'enter'
			@setValue(@getRawValue(), true)
		return


module.exports = TextControl