RowSelector = require './RowSelector'


class CheckSelector extends RowSelector

	selectOnRowClick: false
	checkerRequired: true



	setCheckColumn: (@column) ->
		@mon(column, 'rowcheck', 'onRowCheck')
		@mon(column, 'headercheck', 'onHeaderCheck')
		return


	onRowCheck: (column, row, checked) ->
		rec = row.retrieve('record')
		@selection.setSelected(rec, checked)
		return


	onHeaderCheck: (column, checked) ->
		@selection.setSelectedAll(checked)
		return


	modelSelect: (selection, record) ->
		@column.setCheckedRow(record, true)
		return


	modelDeselect: (selection, record) ->
		@column.setCheckedRow(record, false)
		return


	modelChange: (selection, rs) ->
		super(selection, rs)
		selectedAll = selection.getTotalSelectableCount() is selection.getCount()
		@column.setCheckedHeader(selectedAll && selection.hasSelection())
		return


	gridRendered: (grid) ->
		super(grid)
		@setCheckColumn(grid.checker)
		return


	gridRefresh: (grid) ->
		if !@column
			throw new Error("Check selector is not binded with column. You should call setCheckColumn(). Maybe grid is not rendered")

		sm = grid.getSelectionModel()

		grid.getRecords().each (rec) =>
			if !sm.isSelectable(rec)
				@column.setDisabledRow(rec, true)
			return

		sm.getSelection().each (rec) =>
			@modelSelect(sm, rec)
			return
		return


	doDestroy: ->
		@column = null
		super()
		return


module.exports = CheckSelector