class TextArea extends Miwo.Component

	xtype: 'textareainput'
	isInput: true
	el: 'textarea'
	height: null
	disabled: false
	readonly: false
	resize: 'vertical'


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


	doRender: () ->
		@el.addClass('form-control')
		@el.set("readonly", @readonly) if @readonly
		@el.set("disabled", @disabled) if @disabled
		@el.setStyle("resize", @resize) if @resize
		@el.setStyle("height", @height) if @height
		return


module.exports = TextArea