class BaseTip extends Miwo.Container

	xtype: 'tip'
	placement: "top"
	distance: 0
	target: null
	type: 'default'
	container: null
	delay: null
	visible: false


	afterInit: ->
		super()
		@renderTo = if @renderTo then $(@renderTo) else miwo.body
		return


	afterRender: ->
		super()
		@el.on "mouseenter", =>
			@el.addClass("hover")
			@emit('mouseenter', this)
			return

		@el.on "mouseleave", =>
			@el.removeClass("hover")
			@emit('mouseleave', this)
			return
		return


	show: ->
		if @visible then return
		@visible = true
		@render() if !@rendered
		if @delay then @el.show.delay(@delay, @el) else @el.show()
		@updatePosition()
		@emit('show', this)
		return this


	hide: ->
		if !@visible then return
		@visible = false
		@emit('hide', this)
		@el.hide()
		return this


	close: ->
		if !@visible then return
		@hide()
		@emit('close', this)
		@destroy()
		return this


	isHover: ->
		return @el.hasClass("hover")


	isVisible: ->
		return @el.isVisible()


	updatePosition: ->
		pos = @target.getPosition()
		sizeTarget = @target.getSize()
		size = @el.getSize()
		distance = @distance

		switch @placement
			when "top"
				@el.setPosition
					x: pos.x - size.x / 2 + sizeTarget.x / 2
					y: pos.y - size.y - distance

			when "bottom"
				@el.setPosition
					x: pos.x - size.x / 2 + sizeTarget.x / 2
					y: pos.y + sizeTarget.y + distance

			when "left"
				@el.setPosition
					x: pos.x - size.x - distance
					y: pos.y + sizeTarget.y / 2 - size.y / 2

			when "right"
				@el.setPosition
					x: pos.x + sizeTarget.x + distance
					y: pos.y + sizeTarget.y / 2 - size.y / 2
		return


module.exports = BaseTip