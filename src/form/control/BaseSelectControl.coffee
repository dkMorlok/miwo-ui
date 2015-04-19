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


	afterRenderControl: () ->
		@setItems(@getItems())
		inputEl = @input.getInputEl()
		inputEl.on 'change', ()=> if !@disabled then @setValue(@input.getValue())
		@focusEl = inputEl
		return


module.exports = BaseSelectControl