BaseControl = require './BaseControl'
Slider = require '../../input/Slider'


class SliderControl extends BaseControl

	xtype: "slider"
	min: 0
	max: 100
	step: 1
	value: 0


	setValue: (value) ->
		@input.setValue(value)
		super(@input.getValue()) # value is fixed by slider
		return


	createInput: ->
		input = new Slider
			step: @step
			min: @min
			max: @max
		input.on 'change', (slider, value)=>
			@setValue(value)
			return
		return input


module.exports = SliderControl