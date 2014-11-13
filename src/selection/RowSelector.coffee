BaseSelector = require './BaseSelector'


class RowSelector extends BaseSelector

	selectOnRowClick: true


	gridRendered: (grid) ->
		if @selectOnRowClick
			@mon grid.bodyEl, "click:relay(tr)", (event, target) =>
				record = target.retrieve("record")
				@selection.deselectAll()
				@selection.select(record)
				return
		return


	getRowByRecord: (record) ->
		for tr in @grid.bodyEl.getChildren()
			if tr.retrieve('record') is record
				return tr
		return null


	modelSelect: (selection, record) ->
		@getRowByRecord(record).addClass("grid-selected")
		return


	modelDeselect: (selection, record) ->
		@getRowByRecord(record).removeClass("grid-selected")
		return



module.exports = RowSelector