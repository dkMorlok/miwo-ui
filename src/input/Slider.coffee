Tooltip = require '../tip/Tooltip'


class SliderInput extends Miwo.Component

	xtype: 'sliderinput'
	isInput: true
	value: 0
	step: 1
	min: 0
	max: 100
	disabled: false
	mode: 'slider'
	knobRenderer: null
	selectionRenderer: null

	selectionEl: null
	selectionTooltip: null
	trackEl: null
	trackPos: null
	trackSize: null
	stepSize: null
	knob0El: null
	knob1El: null


	afterInit: ->
		super()
		if @min is null || @max is null
			throw new Error("min or max properties are required")
		if !Type.isArray(@value)
			@value = [0, @value]
		return


	doRender: ->
		@el.addClass('slider')
		@el.set 'html',
		'<div miwo-reference="trackEl" class="slider-track">'+
			'<div miwo-reference="selectionEl" class="slider-selection"></div>'+
			'<div miwo-reference="knob0El" style="display: none" class="slider-knob" tabindex="0"></div>'+
			'<div miwo-reference="knob1El" class="slider-knob" tabindex="0"></div>'+
		'</div>'
		return


	afterRender:  ->
		super()
		@selectionTooltip = new Tooltip
			target: @selectionEl
			placement: 'top'
			distance: 3

		@trackEl.on 'click', (event)=>
			if @disabled then return
			@setValueByEvent(event)
			@selectionTooltip.setText(@formatSelectionTooltip(@getValue()))
			@emit('change', this, @getValue())
			return

		@selectionEl.on 'mouseenter', =>
			if @disabled then return
			if @active then return
			@selectionTooltip.show()
			@selectionTooltip.setText(@formatSelectionTooltip(@getValue()))
			return

		@selectionEl.on 'mouseleave', =>
			if @disabled then return
			if @active then return
			@selectionTooltip.hide()
			return

		@focusEl = @knob1El
		@knob0El.setVisible(@mode is 'range')
		@decorateKnob(@knob0El, 0)
		@decorateKnob(@knob1El, 1)

		@setValue(@value)
		@setDisabled(@disabled)
		window.on 'resize', @bound('updateSlider')
		return


	decorateKnob: (knobEl, index) ->
		tooltip = new Tooltip
			target: knobEl
			placement: 'top'
			distance: 3

		knobEl.store('tooltip', tooltip)
		knobEl.store('index', index)

		knobEl.on 'mousedown', =>
			if @disabled then return
			@active = true
			@activeKnobEl = knobEl
			knobEl.addClass('active')
			@startDrag()
			return

		knobEl.on 'keydown', (e) =>
			if @disabled then return
			switch e.key
				when 'left' then @decrease(); e.stop()
				when 'down' then @decrease(); e.stop()
				when 'right' then @increase(); e.stop()
				when 'up' then @increase(); e.stop()
			return
		return


	startDrag: ->
		@activeKnobEl.retrieve('tooltip').setText(@formatKnobTooltip(@getValue(@activeKnobEl.retrieve('index')))).show()
		miwo.body.on 'mousemove', @bound('onMouseMove')
		miwo.body.on 'mouseup', @bound('onMouseUp')
		return


	stopDrag: ->
		@activeKnobEl.retrieve('tooltip').hide() if @activeKnobEl
		miwo.body.un 'mousemove', @bound('onMouseMove')
		miwo.body.un 'mouseup', @bound('onMouseUp')
		return


	onMouseUp: ->
		@active = false
		@activeKnobEl.removeClass('active') if @activeKnobEl
		@stopDrag()
		@onChange()
		return


	onChange: ->
		@emit('change', this, @getValue())
		return


	onMouseMove: (event) ->
		@setValueByEvent(event)
		@activeKnobEl.retrieve('tooltip').setText(@formatKnobTooltip(@getValue(@activeKnobEl.retrieve('index'))))
		return


	setValueByEvent: (event) ->
		# detect value by event
		left = Math.max(0, Math.min(event.page.x - @trackPos.x, @trackSize.x))
		relativeValue = left/@trackSize.x
		value = @min + Math.round(relativeValue * (@max-@min))

		# detect knob index by event
		if @mode is 'range'
			index = if value > @value[0]+(@value[1]-@value[0])/2 then 1 else 0
		else
			index = 1

		# set value
		@setValue(value, index)
		return


	setValue: (value, index=1) ->
		# set value
		if Type.isArray(value)
			@value[0] = @formatValue(value[0])
			@value[1] = @formatValue(value[1])
		else
			@value[index] = @formatValue(value)

		# fix value (first smaller, bigger is second)
		if @value[0] > @value[1]
			tmp = @value[0]
			@value[0] = @value[1]
			@value[1] = tmp

		if @rendered
			@updateSlider(true)
		return this


	updateSlider: (onlyValue)->
		if !onlyValue || !@trackPos
			@trackPos = @trackEl.getPosition()
			@trackSize = @trackEl.getSize()
			@stepSize = @trackSize.x / (@max-@min)
		@knob0El.setStyle('left', ((@value[0]-@min)*@stepSize))
		@knob1El.setStyle('left', ((@value[1]-@min)*@stepSize))
		@selectionEl.setStyle('width', (((@value[1] - @value[0])-@min)*@stepSize))
		@selectionEl.setStyle('left', (((@value[0])-@min)*@stepSize))
		return


	formatValue: (value) ->
		value = Math.round(value)
		value = parseInt(value/@step) * @step  if @step > 1
		value = Math.min(@max, Math.max(@min, value))
		return value


	getValue: (index) ->
		if index isnt undefined
			return @value[index]
		else if @mode is 'range'
			return @value
		else
			return if @value[1] > @value[0] then @value[1] else @value[0]


	decrease: ->
		if !@activeKnobEl then return
		index = @activeKnobEl.retrieve('index')
		@setValue(@value[index]-@step, index)
		return this


	increase: ->
		if !@activeKnobEl then return
		index = @activeKnobEl.retrieve('index')
		@setValue(@value[index]+@step, index)
		return this


	setDisabled: (@disabled) ->
		if !@rendered then return
		@el.toggleClass('disabled', @disabled)
		return this


	parentShown: ->
		@updateSlider()
		return


	formatKnobTooltip: (value) ->
		return if @knobRenderer then @knobRenderer(value) else value


	formatSelectionTooltip: (value) ->
		return if @selectionRenderer then @selectionRenderer(value) else if @mode is 'range' then "#{value[0]} - #{value[1]}" else value


	doDestroy: ->
		@stopDrag()
		@knob0El.retrieve('tooltip').destroy()
		@knob1El.retrieve('tooltip').destroy()
		@selectionTooltip.destroy()
		window.un 'resize', @bound('updateSlider')
		super()


module.exports = SliderInput