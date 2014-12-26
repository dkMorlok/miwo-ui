BaseTip = require './BaseTip'
ScreenMask = require '../utils/ScreenMask'


class Popover extends BaseTip

	xtype: 'popover'
	title: ''
	content: ''
	baseCls: 'popover'
	screenMask: null
	closeMode: 'close'
	role: 'tooltip'


	afterInit: () ->
		super()
		@screenMask = new ScreenMask =>
			if @closeMode is 'hide' then @hide() else @close()
		return


	beforeRender: () ->
		super
		@el.addClass("in #{@placement} popover-#{@type}")
		@el.set 'html',
		'<div class="arrow"></div>'+
		'<h3 miwo-reference="titleEl" class="popover-title"></h3>'+
		'<div miwo-reference="contentEl" class="popover-content"></div>'
		return


	show: () ->
		@screenMask.show()
		super()
		return


	hide: () ->
		@screenMask.hide()
		super()
		return


	afterRender: () ->
		super
		@setTitle(@title) if @title
		@setContent(@content) if @content
		return


	setTitle: (@title) ->
		if @rendered
			@titleEl.set("html", title)
			@updatePosition()
		return


	setContent: (@content) ->
		if @rendered
			@contentEl.set("html", content)
			@updatePosition()
		return


	addedComponent: (component) ->
		if @rendered
			@updatePosition()
		return


	removedComponent: (component) ->
		if @rendered
			@updatePosition()
		return


	doDestroy: () ->
		@screenMask.destroy()
		super()
		return


module.exports = Popover