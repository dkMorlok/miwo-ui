BaseTextControl = require './BaseTextControl'
TextArea = require '../../input/TextArea'


class TextAreaControl extends BaseTextControl

	isTextAreaField: true
	xtype: "textarea"
	height: null
	resize: "vertical"


	createInput: () ->
		return new TextArea
			id: @id+'-input'
			height: @height
			readonly: @readonly
			disabled: @disabled
			resize: @resize



module.exports = TextAreaControl