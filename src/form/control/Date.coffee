TextControl = require './Text'


class DateControl extends TextControl

	xtype: "datefield"
	type: 'date'
	validateOnChange: false
	placeholder: "yyyy-mm-dd"


	initRules: ->
		super
		@rules.addRule("date")
		return


module.exports = DateControl