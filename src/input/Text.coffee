class TextInput extends Miwo.Component

	xtype: 'textinput'
	isInput: true
	el: 'input'
	type: 'text'
	disabled: false
	readonly: false
	autocomplete: null
	placeholder: null
	tabindex: 0
	name: null
	componentCls: 'form-control'


	setValue: (value) ->
		@el.set("value", value)
		return


	getValue: ->
		return @el.get("value")


	setDisabled: (@disabled) ->
		@el.set("disabled", disabled)
		return


	getInputEl: ->
		return @el


	getInputId: ->
		return @id


	doRender: ->
		@el.set("type", @type)
		@el.set("tabindex", @tabindex)
		@el.set("name", @name) if @name
		@el.set("autocomplete", @autocomplete) if @autocomplete isnt null
		@el.set("placeholder", @placeholder) if @placeholder isnt null
		@el.set("readonly", @readonly) if @readonly
		@el.set("disabled", @disabled) if @disabled
		return


module.exports = TextInput