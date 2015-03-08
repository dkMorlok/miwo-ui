Column = require './Column'
ToggleInput = require '../../input/Toggle'


class ToggleColumn extends Column

	xtype: 'togglecolumn'
	align:'center'
	width: 110
	onState: undefined
	offState: undefined
	onText: undefined
	offText: undefined
	size: undefined

	renderValue: (value, row) ->
		input = new ToggleInput
			value: value
			onState: @onState
			offState: @offState
			onText: @onText
			offText: @offText
			size: @size
		input.on 'beforechange', =>
			@emit('beforechange', this, input, row)
			return
		input.on 'change', =>
			row.set(@getDataIndex(), input.getValue())
			return
		return input


module.exports = ToggleColumn
