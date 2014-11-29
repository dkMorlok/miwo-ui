BaseTextControl = require './BaseTextControl'


class TextControl extends BaseTextControl

	isTextField: true
	xtype: 'textfield'

	initRules:  ->
		super
		switch @type
			when 'email'
				@rules.addRule('email')
			when 'url'
				@rules.addRule('url')
		return


	onSpecialkey: (control, key, e) ->
		if key is 'enter'
			@setValue(@getRawValue(), true)
		return


module.exports = TextControl