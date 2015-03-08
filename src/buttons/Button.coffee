class Button extends Miwo.Component

	@defaultIconClsPrefix: 'glyphicon-'
	@defaultIconClsBase: 'glyphicon'

	isButton: true
	xtype: "button"
	handler: null
	text: ""
	size: ""
	type: "default"
	disabled: false
	active: false
	toggled: false
	toggleHandler: null
	tooltip: null
	title: null
	icon: null

	textEl: null
	iconEl: null


	constructor: (config) ->
		@el = "button"
		@baseCls = "btn"
		super(config)


	setDisabled: (disabled, silent) ->
		@el.toggleClass('disabled', disabled)
		@el.set('tabindex', -disabled)
		@disabled = disabled
		(if disabled then @emit('disabled', this) else @emit('enabled', this)) unless silent
		return


	setText: (text) ->
		@text = text
		if @textEl
			@textEl.set("html", " " + @renderText() + " ")
		return


	setIcon: (cls, silent) ->
		if @iconEl && @icon
			@iconEl.removeClass(Button.defaultIconClsPrefix+@icon)
		@icon = cls
		if @iconEl
			if cls
				@iconEl.addClass(Button.defaultIconClsPrefix+cls)
				@iconEl.show("inline-block")
			else
				@iconEl.hide()
		return


	setSize: (size) ->
		@el.removeClass(@getBaseCls(@size)) if @size
		@el.addClass(@getBaseCls(size)) if size
		@size = size
		return


	setActive: (active, silent) ->
		@el.toggleClass('active', active)
		@active = active
		@emit('active', this, active) if !silent && active
		return


	isActive: ->
		return @active and not @disabled


	setToggled: (toggled) ->
		@toggled = toggled
		return


	toggle: (silent) ->
		@setActive(!@active)
		if !silent
			@emit('toggle', this, @active)
			if @toggleHandler then @toggleHandler(this, @active)
		return


	click: (e) ->
		if Type.isFunction(@handler)
			@handler(this, e)
		else if Type.isString(@handler)
			if @handler.indexOf('#') is 0
				miwo.redirect(@handler)
			else
				document.location = @handler
		return


	renderText: ->
		return if @icon then ' '+@text else @text


	doRender: ->
		@el.addClass(@getBaseCls(@type))  if @type
		@el.addClass(@getBaseCls(@size))  if @size
		@el.addClass('active')  if @active
		@el.addClass('disabled')  if @disabled
		@el.set('tabindex', -1)  if @disabled
		@el.set("title", @tooltip || @title)  if @tooltip || @title
		@el.on("click", @bound("onClick"))
		@el.on("keyup", @bound("onKeyUp"))

		@iconEl = new Element "i",
			parent: @el
			cls: Button.defaultIconClsBase

		@textEl = new Element "span",
			parent: @el
			html: @renderText()

		@iconEl.addClass(Button.defaultIconClsPrefix+@icon)
		if !@icon then @iconEl.hide()
		return


	onClick: (e) ->
		e.stop()
		if @disabled then return

		@preventClick = false
		@emit('beforeclick', this, e)
		if @preventClick then return

		if @toggled then @toggle()
		@emit('click', this, e)
		@click(e)
		return


	onKeyUp: (e) ->
		if e.key is 'enter' then @onClick(e)
		return



module.exports = Button