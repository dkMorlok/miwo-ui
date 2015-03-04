class BaseTextInput extends Miwo.Component

	isInput: true
	el: 'input'
	disabled: false
	readonly: false
	placeholder: null
	tabindex: 0
	inputName: null
	componentCls: 'form-control'


	setValue: (value) ->
		@el.set("value", value)
		return


	getValue: ->
		return @el.get("value")


	setDisabled: (@disabled) ->
		@el.set("disabled", @disabled)
		return


	setReadonly: (@readonly) ->
		@el.set("disabled", @readonly)
		return


	setPlaceholder: (@placeholder) ->
		@el.set("placeholder", @placeholder)
		return


	getInputEl: ->
		return @el


	getInputId: ->
		return @id


	doRender: ->
		@el.set("tabindex", @tabindex)
		@el.set("name", @inputName || @name)
		@el.set("placeholder", @placeholder) if @placeholder isnt null
		@el.set("readonly", @readonly) if @readonly
		@el.set("disabled", @disabled) if @disabled
		return


module.exports = BaseTextInput