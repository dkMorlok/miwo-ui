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
			height: @height
			readonly: @readonly
			disabled: @disabled
			resize: @resize
		return input



module.exports = TextAreaControl