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


	setValue: (value) ->
		super(value)
		@setSelected(value)
		return


	setSelected: (value) ->
		if value or @prompt
			@input.setValue(value) if @input
			@emit('selected', this, value)
		return


	getItems: ->
		return Helpers.createSelectItems(this)


	setItems: (items) ->
		Helpers.setSelectItems(this, items)
		if !@prompt and @value isnt null
			@input.setValue(@getValue())
		return


	buildRowContent: (row) ->
		return if @rowBuilder then @rowBuilder(row) else null


	afterRenderControl: ->
		super()
		@setItems(@getItems())
		@input.on 'change', (input, value)=> @setValue(value)
		@focusEl = @input.focusEl
		return


module.exports = BaseSelectControl