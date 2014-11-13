BaseControl = require './BaseControl'
CheckboxList = require '../../input/CheckboxList'
Helpers = require './Helpers'


class CheckboxListControl extends BaseControl

	xtype: "checkboxlist"
	items: null
	inline: false
	isBoxControl: true


	createInput: () ->
		return new CheckboxList
			id: @id
			inline: @inline


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


	afterRenderControl: () ->
		@setItems(@getItems())
		@input.setValue(@value)
		@input.setDisabled(@disabled)
		@input.on 'change', ()=> @setValue(@input.getValue())
		@input.on 'focus', ()=> @setFocus()
		@input.on 'blur', ()=> @validate()
		return


module.exports = CheckboxListControl