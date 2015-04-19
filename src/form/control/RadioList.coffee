BaseControl = require './BaseControl'
RadioList = require '../../input/RadioList'
Helpers = require './Helpers'


class RadioListControl extends BaseControl

	xtype: "radiolist"
	items: null
	inline: false
	isBoxControl: true


	createInput: ->
		return new RadioList
			id: @id+'-input'
			inline: @inline
			radioName: @name


	getItems: ->
		return Helpers.createInputItems(this)


	setItems: (items) ->
		Helpers.setInputItems(this, items)
		return


	setValue: (value) ->
		@input.setValue(value)
		super(value)
		return


	setDisabled: (disabled) ->
		@input.setDisabled(disabled)
		super(disabled)
		return


	setDisabledItem: (name, disabled) ->
		@input.setDisabled(name, disabled)
		return


	renderControl: (ct) ->
		@getInput().render(ct)
		return


	afterRenderControl: ->
		@setItems(@getItems())
		@input.setValue(@value)
		@input.setDisabled(@disabled)
		@input.on 'change', => @setValue(@input.getValue())
		@input.on 'blur', => @validate()
		return


module.exports = RadioListControl