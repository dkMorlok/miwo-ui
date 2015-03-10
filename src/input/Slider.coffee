Tooltip = require '../tip/Tooltip'


class SliderInput extends Miwo.Component

	xtype: 'sliderinput'
	isInput: true
	value: 0
	step: 1
	min: 0
	max: 100
	disabled: false

	selectionEl: null
	knobEl: null
	trackEl: null
	trackPos: null
	trackSize: null
	stepSize: null
	tooltipKnob: null
	tooltipSelection: null


	afterInit: ->
		super
		if @min is null || @max is null
			throw new Error("min or max properties are required")
		return


	doRender: ->
		@el.addClass('slider')
		@el.set 'html',
		'<div miwo-reference="trackEl" class="slider-track">'+
			'<div miwo-reference="selectionEl" class="slider-selection"></div>'+
			'<div miwo-reference="knobEl" class="slider-knob" tabindex="0"></div>'+
		'</div>';
		return


	afterRender:  ->
		super
		@tooltipKnob = new Tooltip
			target: @knobEl
			placement: 'top'
			distance: 3

		@tooltipSelection = new Tooltip
			target: @selectionEl
			placement: 'top'
			distance: 3

		@trackPos = @trackEl.getPosition()
		@trackSize = @trackEl.getSize()
		@stepSize = @trackSize.x / (@max-@min)
		@focusEl = @knobEl

		@knobEl.on 'mousedown', =>
			if @disabled then return
			@active = true
			@knobEl.addClass('active')
			@startDrag()
			return

		@knobEl.on 'keydown', (e) =>
			if @disabled then return
			switch e.key
				when 'left' then @decrease(); e.stop()
				when 'down' then @decrease(); e.stop()
				when 'right' then @increase(); e.stop()
				when 'up' then @increase(); e.stop()
			return

		@trackEl.on 'click', (event)=>
			if @disabled then return
			@setValueByEvent(event)
			@tooltipSelection.setText(@getValue())
			@emit('change', this, @getValue())
			return

		@selectionEl.on 'mouseenter', =>
			if @disabled then return
			if @active then return
			@tooltipSelection.show()
			@tooltipSelection.setText(@getValue())
			return

		@selectionEl.on 'mouseleave', =>
			if @disabled then return
			if @active then return
			@tooltipSelection.hide()
			return

		@setValue(@value)
		@setDisabled(@disabled)
		return


	startDrag: ->
		@tooltipKnob.show()
		@tooltipKnob.setText(@getValue())
		miwo.body.on 'mousemove', @bound('onMouseMove')
		miwo.body.on 'mouseup', @bound('onMouseUp')
		return


	stopDrag: ->
		@tooltipKnob.hide()
		miwo.body.un 'mousemove', @bound('onMouseMove')
		miwo.body.on 'mouseup', @bound('onMouseUp')
		return


	onMouseUp: ->
		@active = false
		@knobEl.removeClass('active')
		@stopDrag()
		@onChange()
		return


	onChange: ->
		@emit('change', this, @getValue())
		return


	onMouseMove: (event) ->
		@setValueByEvent(event)
		@tooltipKnob.setText(@getValue())
		return


	setValueByEvent: (event) ->
		left = Math.max(0, Math.min(event.page.x - @trackPos.x, @trackSize.x))
		relativeValue = left/@trackSize.x
		value = @min + Math.round(relativeValue * (@max-@min))
		@setValue(value)
		return


	setValue: (value) ->
		value = Math.round(value)
		value = parseInt(value/@step) * @step  if @step > 1
		value = Math.min(@max, Math.max(@min, value))
		if @value is value then return
		@value = value
		if !@rendered then return
		@selectionEl.setStyle('width', ((value-@min)*@stepSize))
		@knobEl.setStyle('left', ((value-@min)*@stepSize))
		return


	getValue: ->
		return @value


	decrease: ->
		@setValue(@value-@step)
		return


	increase: ->
		@setValue(@value+@step)
		return


	setDisabled: (@disabled) ->
		if !@rendered then return
		@el.toggleClass('disabled', @disabled)
		return


	parentShown: ->
		@trackPos = @trackEl.getPosition()
		@trackSize = @trackEl.getSize()
		@stepSize = @trackSize.x / (@max-@min)
		@selectionEl.setStyle('width', ((@value-@min)*@stepSize))
		@knobEl.setStyle('left', ((@value-@min)*@stepSize))
		return


	doDestroy: ->
		@stopDrag()
		@tooltipKnob.destroy()
		@tooltipSelection.destroy()
		super


module.exports = SliderInput