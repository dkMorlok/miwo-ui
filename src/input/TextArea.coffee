BaseText = require './BaseText'

class TextAreaInput extends BaseText

	xtype: 'textareainput'
	el: 'textarea'
	height: null
	resize: 'vertical'


	doRender: ->
		super
		@el.setStyle("resize", @resize) if @resize
		@el.setStyle("height", @height) if @height
		return


module.exports = TextAreaInput