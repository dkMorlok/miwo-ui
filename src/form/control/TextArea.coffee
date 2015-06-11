BaseTextControl = require './BaseTextControl'
TextArea = require '../../input/TextArea'


class TextAreaControl extends BaseTextControl

	xtype: "textarea"
	isTextAreaField: true
	height: null
	resize: "vertical"


	createInput: ->
		input = new TextArea
			id: @id+'-input'
			inputName: @name
			height: @height
			readonly: @readonly
			disabled: @disabled
			resize: @resize
			placeholder: @placeholder

		@height = null
		return input


module.exports = TextAreaControl