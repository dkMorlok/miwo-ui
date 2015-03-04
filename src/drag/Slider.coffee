Drag = require './Drag'

class Slider extends Miwo.Object

	initialStep: 0
	snap: false
	offset: 0
	range: false
	wheel: false
	steps: 100
	mode: 'horizontal'

	axis: null
	property: null
	offsetProperty: null
	full: 0

	constructor: (element, knob, config) ->
		super(config)
		@element = document.id(element)
		@knob = document.id(knob)
		@step = if @initialStep then @initialStep else (if @range then @range[0] else 0)
		@previousChange = @previousEnd = @step

		switch @mode
			when 'vertical'
				@axis = 'y'
				@property = 'top'
				@offsetProperty = 'offsetHeight'
				limits = {x:[0,0], y:[]}
				modifiers = {x: false, y: 'top'}
			when 'horizontal'
				@axis = 'x'
				@property = 'left'
				@offsetProperty = 'offsetWidth'
				limits = {x:[], y:[0,0]}
				modifiers = {x: 'left', y: false}

		@drag = new Drag @knob,
			snap: 0
			limits: limits
			modifiers: modifiers
		@drag.on 'drag', =>
			@draggedKnob()
			return
		@drag.on 'start', =>
			@draggedKnob()
			return
		@drag.on 'beforestart', =>
			@isDragging = true
			return
		@drag.on 'cancel', =>
			@isDragging = false
			return
		@drag.on 'complete', =>
			@isDragging = false
			@draggedKnob()
			@end()
			return

		@knob.setStyle(@property, -@offset)
		@setSliderDimensions()
		@setRange(@range, null, true)
		@setSnap() if @snap
		@setStep(@initialStep, true)  if @initialStep isnt null
		@attach()
		return


	onTick: (position) ->
		@setKnobPosition(position)
		return


	attach: ->
		@element.on('mousedown', @bound('clickedElement'))
		@element.on( 'mousewheel', @bound('scrolledElement')) if @wheel
		@drag.attach()
		return this


	detach: ->
		@element.un('mousedown', @bound('clickedElement'))
		@element.un('mousewheel', @bound('scrolledElement'))
		@drag.detach()
		return this


	updateSize: ->
		@setSliderDimensions()
		@setKnobPosition(@toPosition(@step))
		@drag.limits[@axis] = [-@offset, @full - @offset]
		@setSnap() if @snap
		return this


	setSnap: ->
		@drag.grid[@axis] = Math.ceil(@stepWidth)
		@drag.limits[@axis][1] = @element[@offsetProperty]
		return this


	setKnobPosition: (position) ->
		position = @toPosition(@step) if @snap
		@knob.setStyle(@property, position)
		return this


	setSliderDimensions: ->
		@full = @element[@offsetProperty] - @knob[@offsetProperty] + @offset * 2
		@half = @knob[@offsetProperty] / 2
		return this


	setStep: (step, silently) ->
		if !(@range > 0 ^ step < @min)
			step = @min
		if !(@range > 0 ^ step > @max)
			step = @max
		@step = step.round(@modulus.decimalLength)
		if silently
			@checkStep()
			@setKnobPosition(@toPosition(@step))
		else
			@checkStep()
			@emit('tick', @toPosition(@step))
			@emit('move')
			@end()
		return this


	setRange: (range, pos, silently) ->
		@min = if range then range[0] else 0
		@max = if range then range[1] else @steps
		@range = @max - @min
		@steps = @steps or @full
		@stepSize = Math.abs(@range) / @steps
		@stepWidth = @stepSize * @full / Math.abs(@range)
		@setModulus()
		@setStep(Array.pick([pos, @step]).limit(@min, @max), silently)  if range
		return this


	setModulus: ->
		decimals = ((@stepSize + '').split('.')[1] or []).length
		modulus = 1 + ''
		while decimals--
			modulus += '0'
		@modulus =
			multiplier: modulus.toInt(10)
			decimalLength: modulus.length - 1
		return


	clickedElement: (event) ->
		if @isDragging or event.target is @knob then return
		dir = if @range < 0 then -1 else 1
		position = event.page[@axis] - @element.getPosition()[@axis] - @half
		position = position.limit(-@offset, @full - @offset)
		@step = (@min + dir * @toStep(position)).round(@modulus.decimalLength)
		@setKnobPosition(@toPosition(@step))
		@checkStep()
		@emit('tick', position)
		@emit('move')
		@end()
		return


	scrolledElement: (event) ->
		mode = if @mode == 'horizontal' then event.wheel < 0 else event.wheel > 0
		@setStep(@step + (if mode then -1 else 1) * @stepSize)
		event.stop()
		return


	draggedKnob: ->
		dir = if @range < 0 then -1 else 1
		position = @drag.value.now[@axis]
		position = position.limit(-@offset, @full - @offset)
		@step = (@min + dir * @toStep(position)).round(@modulus.decimalLength)
		@checkStep()
		@emit('move')
		return


	checkStep: ->
		step = @step
		if @previousChange != step
			@previousChange = step
			@emit('change', step)
		return this

	end: ->
		step = @step
		if @previousEnd != step
			@previousEnd = step
			@emit('complete', step + '')
		return this


	toStep: (position) ->
		step = (position + @offset) * @stepSize / @full * @steps
		if @steps
			return (step - (step * @modulus.multiplier % @stepSize * @modulus.multiplier / @modulus.multiplier)).round(@modulus.decimalLength)
		else
			return step


	toPosition: (step) ->
		return @full * Math.abs(@min - step) / @steps * @stepSize - @offset or 0


module.exports = Slider