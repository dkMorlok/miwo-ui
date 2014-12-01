Button = require './Button'


class ToolButton extends Miwo.Component

	isTool: true
	xtype: "toolbutton"
	handler: null
	icon: null
	text: ""
	tooltip: null
	el: 'button'

	textEl: null
	iconEl: null



	setDisabled: (disabled, silent) ->
		@el.toggleClass('disabled', disabled)
		@disabled = disabled
		(if disabled then @emit('disabled', this) else @emit('enabled', this)) unless silent
		return


	setText: (text) ->
		@text = text
		@textEl.set("html", text) if @textEl
		return


	setIcon: (cls, silent) ->
		if @iconEl
			if @icon
				@iconEl.removeClass(Button.defaultIconClsPrefix+@icon)
		@icon = cls
		if @iconEl
			if cls
				@iconEl.addClass(Button.defaultIconClsPrefix+cls)
				@iconEl.show("inline-block")
			else
				@iconEl.hide()
		return


	click: (e) ->
		@handler(this, e) if @handler
		return


	doRender: ->
		@el.addClass('btn-tool')
		@el.addClass('disabled')  if @disabled
		@el.set("title", @tooltip)  if @tooltip
		@el.on("click", @bound("onClick"))

		@iconEl = new Element "i",
			parent: @el
			cls: Button.defaultIconClsBase+' '+Button.defaultIconClsPrefix+@icon

		@textEl = new Element "span",
			parent: @el
			cls: 'sr-only'
			html: @text
		return


	onClick: (e) ->
		e.stop()
		if @disabled then return

		@preventClick = false
		@emit('beforeclick', this, e)
		if @preventClick then return

		@emit('click', this, e)
		@click(e)
		return



module.exports = ToolButton