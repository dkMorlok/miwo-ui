Column = require './Column'
SwitchInput = require '../../input/Switch'


class SwitchColumn extends Column

	xtype: 'switchcolumn'
	align:'center'
	width: 110
	onState: undefined
	offState: undefined
	onText: undefined
	offText: undefined

	renderValue: (value, row) ->
		input = new SwitchInput
			value: value
			onState: @onState
			offState: @offState
			onText: @onText
			offText: @offText
		input.on 'beforechange', =>
			@emit('beforechange', this, input, row)
			return
		input.on 'change', =>
			row.set(@getDataIndex(), input.getValue())
			return
		return input

module.exports = SwitchColumn
