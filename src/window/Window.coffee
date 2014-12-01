Button = require '../buttons/Button'
ToolButton = require '../buttons/ToolButton'


class Window extends Miwo.Container

	isWindow: true
	xtype: 'window'
	closeMode: 'hide'
	closeOnClickOut: true
	closeOnEsc: true
	closeable: true
	minimizable: false
	title: ''
	autoCenter: true
	preventAutoRender: true

	# True to make the window modal and mask everything behind it when displayed, false
	# to display it without restricting access to other UI elements.
	# @config {Boolean}
	modal: true

	buttons: null
	titleEl: null
	contentEl: null
	footerEl: null
	toolsEl: null
	keyListener: null
	tools: null


	beforeInit: ->
		super()
		@zIndexManage = true
		@contentEl = 'div'
		@baseCls = 'window'
		@visible = false
		@width = 600
		@top = 30
		@renderTo = miwo.body
		@buttons = new Miwo.utils.Collection()
		@tools = new Miwo.utils.Collection()
		return


	afterInit: ->
		super()
		miwo.windowMgr.register(this)
		return


	open: ->
		@show()
		return


	close: (destroy = false, silent) ->
		if !destroy && @closeMode is 'hide'
			@doHide()
		else
			@preventClose = false
			@emit('beforeclose', this)  if !silent
			if @preventClose then return
			@doClose()
			@emit('close', this)
			@destroy()
		return


	setTitle: (title) ->
		@title = title
		@titleEl.set("html", title) if @titleEl
		return


	doShow: ->
		super()
		@toFront()
		return


	doHide: ->
		super()
		@toBack()
		return


	doClose: ->
		@hide()
		return


	beforeRender: () ->
		super()
		@el.addClass('modal-dialog')
		@el.set 'html', """
		<div class="miwo-window-content modal-content">
			<div miwo-reference="headerEl" class="miwo-window-header modal-header">
				<div miwo-reference="toolsEl" class='miwo-window-tools'></div>
				<h4 miwo-reference="titleEl" class='miwo-window-title modal-title'>#{@title}</h4>
			</div>
			<div miwo-reference="contentEl" class="miwo-window-body modal-body"></div>
			<div miwo-reference="footerEl" class="miwo-window-footer modal-footer"></div>
		</div>"""
		return


	afterRender: ->
		super()
		@keyListener = new Miwo.utils.KeyListener(@el)
		@keyListener.on 'esc', () =>
			@close()  if @closeOnEsc
			return

		@el.set('aria-labelledby', @id+'Label')
		@titleEl.set('id', @id+'Label')

		if @closeable
			@addTool 'close',
				icon: 'remove'
				text: miwo.tr('miwo.window.close')
				handler: => @close()

		if @minimizable
			@addTool 'hide',
				icon: 'minus'
				text: miwo.tr('miwo.window.hide')
				handler: => @hide()

		if !@modal
			miwo.body.on('click', @bound('onBodyClick'));

		for name,button of @buttons.items
			button.render(@footerEl) if !button.rendered
		return


	onBodyClick: (e) ->
		if @isVisible() && e.target is @el then return
		if e.target.getParent('.miwo-window') is @el then return
		@close() if @closeOnClickOut
		return


	onOverlayClick: () ->
		@close() if @closeOnClickOut
		return


	setContent: (string) ->
		@contentEl.set("html", string)
		return



	setButtons: (buttons) ->
		for button in @buttons
			button.destroy()
		@buttons.empty()
		for button in buttons
			@addButton(button.name, button)
		return


	addButton: (name, button) ->
		if !Type.isInstance(button)
			button = new Button(button)
		@buttons.set(name, button)
		button.render(@footerEl) if @footerEl
		return button


	addCloseButton: (text) ->
		return @addButton 'close',
			text: text
			handler: () => @close()


	getButton: (name) ->
		return @buttons.get(name)



	addTool: (name, button) ->
		button = new ToolButton(button) if !Type.isInstance(button)
		@tools.set(name, button)
		button.render(@toolsEl)
		return button


	getTool: (name)->
		return @tools.get(name)


	doDestroy: ->
		miwo.windowMgr.unregister(this)
		miwo.body.un('click', @bound('onBodyClick'))
		@keyListener.destroy() if @keyListener
		@buttons.destroy()
		@tools.destroy()
		super()
		return



module.exports = Window