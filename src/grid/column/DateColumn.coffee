Column = require './Column'


class DateColumn extends Column

	xtype: 'datecolumn'
	align: 'right'
	emptyText: 'N/A'
	format: '%c'


	formatValue: (value, record) ->
		if Type.isDate(value)
			return if value.format then value.format(this.format) else value.toDateString()
		else
			return value


module.exports = DateColumn