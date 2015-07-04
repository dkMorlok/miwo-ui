BaseInputControl = require './BaseInputControl'
Helpers = require './Helpers'


class BaseSelectControl extends BaseInputControl

	items: null
	store: null
	keyProperty: null
	textProperty: null
	rowBuilder: null
	prompt: false
	input: null


	setValue: (value, onlyControl) ->
		if (value isnt null && value isnt undefined && value isnt "") or @prompt
			super(value, onlyControl)
			@emit('selected', this, value)
		return


	getItems: ->
		return Helpers.createSelectItems(this)


	setItems: (items) ->
		Helpers.setSelectItems(this, items)
		if !@prompt and @value isnt null and @value isnt @input.getValue()
			@input.setValue(@getValue())
		return


	buildRowContent: (row) ->
		return if @rowBuilder then @rowBuilder(row) else null


	afterRenderControl: ->
		super()
		@setItems(@getItems())
		@input.on 'change', (input, value)=> @setValue(value, true)
		@focusEl = @input.focusEl
		return


module.exports = BaseSelectControl