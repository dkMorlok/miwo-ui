Slider = require '../drag/Slider'


class Scrollable extends Miwo.Object

	fade: true
	autoHide: true
	proportional: true
	proportionalMinHeight: 15


	# @param {Miwo.component.Container} container
	# @param {Object} config
	constructor: (container, config) ->
		@container = container
		super(config)
		return


	# Scrolls the scrollable area to the topmost position
	scrollTop: ->
		@scrollableBody.scrollTop = 0
		@actualize()
		return


	# Scrolls the scrollable area to the bottommost position
	scrollBottom: ->
		@scrollableBody.scrollTop = @scrollableBody.scrollHeight
		@actualize()
		return



	afterRender: ->
		@container.el.addClass('scrollable')
		@scrollableCt = @container.scrollableCt || @container.el
		@scrollableBody = @container.scrollableEl || @container.getContentEl()
		@scrollableCt.addClass('scrollable-ct')
		@scrollableBody.addClass('scrollable-body')

		@scrollbar = new Element 'div',
			parent: @scrollableCt
			cls: 'scrollable-slider'
		@scrollbar.set('tween', {duration: 50})

		@knob = new Element 'div',
			parent: @scrollbar
			cls: 'scrollable-knob'

		@slider = new Slider @scrollbar, @knob,
			mode: 'vertical'
		@slider.on 'change', (step) =>
			@scrollableBody.scrollTop = (@scrollableBody.scrollHeight - @scrollableBody.offsetHeight) * step / 100
			return

		# bind events
		@scrollableCt.on('mouseenter', @bound('onElementMouseEnter'))
		@scrollableCt.on('mouseleave', @bound('onElementMouseLeave'))
		@scrollableCt.on('mousewheel', @bound('onElementMouseWheel'))
		@scrollableBody.on('Scrollable:contentHeightChange', @bound('onContentHeightChange'))
		@knob.on('mousedown', @bound('onKnobMouseDown'))
		window.on('resize', @bound('onWindowResize'))
		window.on('mousewheel', @bound('onWindowMouseWheel'))

		# need to show
		@scrollbar.fade('show')
		@scrollbar.fade('hide') if @autoHide
		@actualize()
		return


	onElementMouseEnter: ->
		if @scrollableBody.scrollHeight > @scrollableCt.offsetHeight then @showContainer()
		@actualize()
		return


	onElementMouseLeave: (e) ->
		if !@active then @hideContainer()
		return


	onElementMouseWheel: (e) ->
		e.preventDefault()
		el = @scrollableBody
		# Stops the entire page from scrolling when mouse is located over the element
		if e.wheel < 0 and el.scrollTop < el.scrollHeight - el.offsetHeight or e.wheel > 0 and el.scrollTop > 0
			el.scrollTop = el.scrollTop - @normalizeWheelSpeed(e)
			@actualize()
		return


	normalizeWheelSpeed: (e) ->
		e = e.event
		if e.wheelDelta
			normalized = if e.wheelDelta % 120 - 0 == -0 then e.wheelDelta / 120 else e.wheelDelta / 12
			normalized *= 5
		else
			rawAmount = if e.deltaY then e.deltaY else e.detail
			normalized = -(if rawAmount % 3 then rawAmount * 10 else rawAmount / 3)
			normalized *= 30
		return normalized


	onContentHeightChange: ->
		# this scrollable:contentHeightChange could be fired on the current element in order
		# to get a custom action invoked (implemented in onContentHeightChange option)
		@container.emit('heightchange', @container)
		return


	onKnobMouseDown: ->
		@active = true
		window.on('mouseup', @bound('onWindowMouseUp'))
		return


	onWindowMouseUp: (e) ->
		@active = false
		window.un('mouseup', @bound('onWindowMouseUp'))
		return


	onWindowResize: ->
		@actualize.delay(50, this)
		return


	onWindowMouseWheel: ->
		if @scrollableBody.isVisible() then @actualize()
		return


	actualize: ->
		el = @scrollableBody

		# Repositions the scrollbar by rereading the container element's dimensions/position
		setTimeout ()=>
			@size = el.getSize()
			@position = el.getPosition()
			@slider.updateSize()
			return
		, 50

		if @proportional
			if isNaN(@proportionalMinHeight) or @proportionalMinHeight <= 0
				throw new Error('Miwo.panel.Scrollpane::reposition(): option "proportionalMinHeight" is not a positive number.')
			else
				minHeight = Math.abs(@proportionalMinHeight)
				knobHeight = if el.scrollHeight != 0 then el.offsetHeight * (el.offsetHeight / el.scrollHeight) else 0
				@knob.setStyle('height', Math.max(knobHeight, minHeight))

		diff = el.scrollHeight - el.offsetHeight
		pos = if diff then Math.round(el.scrollTop / diff * 100) else 0
		@slider.setStep(pos)
		return


	showContainer: (force) ->
		if @autoHide and @fade and !@active or force and @fade
			@scrollbar.fade(0.6)
		else if @autoHide and !@fade and !@active or force and !@fade
			@scrollbar.fade('show')
		return


	hideContainer: (force) ->
		if @autoHide and @fade and !@active or force and @fade
			@scrollbar.fade('out')
		else if @autoHide and !@fade and !@active or force and !@fade
			@scrollbar.fade('hide')
		return


	doDestroy: ->
		window.un('resize', @bound('onWindowResize'))
		window.un('mousewheel', @bound('onWindowMouseWheel'))
		@scrollbar.destroy()
		super


module.exports = Scrollable