BaseControl = require './BaseControl'
DropSelectInput = require '../../input/DropSelect'


class DropSelectControl extends BaseControl

	xtype: "dropselect"
	store: undefined
	keyProperty: undefined
	textProperty: undefined
	sourceTitle: undefined
	targetTitle: undefined
	sourceEmpty: undefined
	targetEmpty: undefined

	createInput: ->
		return new DropSelectInput
			id: @id
			store: @store
			keyProperty: @keyProperty
			textProperty: @textProperty
			sourceTitle: @sourceTitle
			targetTitle: @targetTitle
			sourceEmpty: @sourceEmpty
			targetEmpty: @targetEmpty


	setValue: (value) ->
		@input.setValue(value, true)
		super(value)
		return


	setDisabled: (disabled) ->
		@input.setDisabled(disabled)
		super(disabled)
		return


	renderControl: (ct) ->
		@getInput().render(ct)
		return


	afterRenderControl: ->
		@input.setValue(@value)
		@input.setDisabled(@disabled)
		@input.on 'change', => @setValue(@input.getValue())
		return


module.exports = DropSelectControl