Column = require './Column'
Checkbox = require '../../input/Checkbox'


class CheckerColumn extends Column

	xtype: "checkercolumn"
	align: "center"
	width: 50
	colClass: 'checker'
	isCheckerColumn: true

	# disable update cell if row is updated
	preventUpdateCell: true


	constructor: (config) ->
		super(config)


	onRenderCell: (td, value, record) ->
		checkbox = new Checkbox
			id: @getGrid().id.toString()+"-checker-"+record.getId().toString()
		checkbox.render(td)
		checkbox.on 'change', (checker, value)=>
			@emit("rowcheck", this, td.getParent('tr'), value)
			return
		td.set("disableclick", true)
		td.store('checker', checkbox)
		return


	onDestroyCell: (td) ->
		checkbox = td.retrieve('checker')
		checkbox.destroy()
		td.eliminate('checker')
		return


	onRenderHeader: (th) ->
		checkbox = new Checkbox
			id: @getGrid().id.toString()+'-checker-all'
		checkbox.render(th)
		checkbox.on 'change', (checker, value)=>
			@emit("headercheck", this, value)
			return
		th.store('checker', checkbox)
		return


	getRowChecker: (record) ->
		for tr in @getGrid().tbodyEl.getChildren()
			if tr.retrieve('record') is record
				return tr.getElement('td.grid-col-checker').retrieve('checker')
		return null


	getHeadChecker: () ->
		return @getGrid().headerEl.getElement('tr:first-child th.grid-col-checker').retrieve('checker')


	setCheckedRow: (record, checked) ->
		@getRowChecker(record).setChecked(checked)
		return


	setDisabledRow: (record, disabled) ->
		@getRowChecker(record).setDisabled(disabled)
		return


	setCheckedHeader: (checked) ->
		@getHeadChecker().setChecked(checked)
		return



module.exports = CheckerColumn