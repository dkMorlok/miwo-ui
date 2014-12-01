class DropdownItem extends Miwo.Component

	xtype: "dropdownitem"
	el: 'li'
	baseCls: 'dropdown-menuitem'
	text: ""
	disabled: false
	handler: null
	linkEl: null


	setText: (text) ->
		@text = text
		@linkEl.set "html", text  if @linkEl
		return


	setHandler: (handler) ->
		@handler = handler
		return


	doRender: ->
		@el.set('role', 'presentation')
		@linkEl = new Element "a",
			href: '#click'
			role: 'menuitem'
			html: @text
			parent: @el
		@mon @linkEl, 'click', 'onClick'
		return


	onClick: (e) ->
		e.stop()
		if @disabled then return
		@container.hide()
		@emit('click', this, e)
		@click(e)
		return


	click: (e) ->
		if Type.isFunction(@handler)
			@handler(this, e)
		else if Type.isString(@handler)
			if @handler.indexOf('#') is 0
				document.location.hash = @handler
			else
				document.location = @handler
		return


module.exports = DropdownItem