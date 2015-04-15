BaseControl = require './BaseControl'
Slider = require '../../input/Slider'


class SliderControl extends BaseControl

	xtype: "slider"
	min: 0
	max: 100
	step: 1
	value: 0
	mode: 'slider'
	knobRenderer: undefined
	selectionRenderer: undefined


	setValue: (value) ->
		@input.setValue(value)
		super(@input.getValue()) # value is fixed by slider
		return


	createInput: ->
		input = new Slider
			mode: @mode
			inputName: @name
			step: @step
			min: @min
			max: @max
			knobRenderer: @knobRenderer
			selectionRenderer: @selectionRenderer

		input.on 'change', (slider, value)=>
			@setValue(value)
			return

		return input


module.exports = SliderControl