BaseInput = require './BaseInput'


class BaseTextInput extends BaseInput

	el: 'input'
	disabled: false
	readonly: false
	placeholder: null
	tabindex: 0
	inputName: null
	componentCls: 'form-control'


	getInputEl: ->
		return @el


	setValue: (value) ->
		@el.set("value", value)
		return


	getValue: ->
		return @el.get("value")


	setDisabled: (@disabled) ->
		@el.set("disabled", @disabled)
		return


	setReadonly: (@readonly) ->
		@el.set("readonly", @readonly)
		return


	setPlaceholder: (@placeholder) ->
		@el.set("placeholder", @placeholder)
		return


	doRender: ->
		@el.set("tabindex", @tabindex)
		@el.set("name", @inputName || @name)
		@el.set("placeholder", @placeholder) if @placeholder isnt null
		@el.set("readonly", @readonly) if @readonly
		@el.set("disabled", @disabled) if @disabled
		return


module.exports = BaseTextInput