Column = require './Column'


class CheckColumn extends Column

	xtype: "checkcolumn"
	align: "center"
	width: 50
	iconTrue: "glyphicon glyphicon-ok"
	iconFalse: ""


	formatValue: (value) ->
		if value
			return (if @iconTrue then "<i class=\"" + @iconTrue + "\"></i>" else "")
		else
			return (if @iconFalse then "<i class=\"" + @iconFalse + "\"></i>" else "")


module.exports = CheckColumn