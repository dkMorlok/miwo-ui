BaseTextInput = require './BaseTextInput'


class TextInput extends BaseTextInput

	type: 'text'
	autocomplete: null


	doRender: ->
		super()
		@el.set("type", @type)
		@el.set("autocomplete", @autocomplete) if @autocomplete isnt null
		return


module.exports = TextInput