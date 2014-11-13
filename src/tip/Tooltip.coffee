BaseTip = require './BaseTip'


class Tooltip extends BaseTip

	text: null
	baseCls: 'tooltip'


	setText: (@text) ->
		if !@rendered then return
		@contentEl.set('html', text)
		@updatePosition()
		return


	beforeRender: () ->
		super
		@el.addClass("in #{@placement} tooltip-#{@type}")
		@el.set('role', 'tooltip')
		@el.set 'html', '<div class="tooltip-arrow"></div><div miwo-reference="contentEl" class="tooltip-inner"></div>'
		return


	afterRender: () ->
		super
		@setText(@text) if @text
		return


module.exports = Tooltip