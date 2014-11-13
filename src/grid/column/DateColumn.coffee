Column = require './Column'


class DateColumn extends Column

	xtype: 'datecolumn'
	align: 'right'
	emptyText: 'N/A'
	format: '%c'


	formatValue: (value, record) ->
		if Type.isDate(value)
			return value.format(this.format)
		else
			return value


module.exports = DateColumn