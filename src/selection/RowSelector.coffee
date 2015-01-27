BaseSelector = require './BaseSelector'


class RowSelector extends BaseSelector

	selectOnRowClick: true


	gridRendered: (grid) ->
		if @selectOnRowClick
			@mon grid.bodyEl, "click:relay(tr)", (event, target) =>
				@onRowClick(target, event)
				return
		return


	onRowClick: (tr, event) ->
		if !event.control && !event.meta
			@selection.deselectAll()
		if (record = tr.retrieve("record"))
			@selection.toggle(record)
		return


	getRowByRecord: (record) ->
		for tr in @grid.bodyEl.getElements('tr')
			if tr.retrieve('record') && tr.retrieve('record').id is record.id
				return tr
		return null


	modelSelect: (selection, record) ->
		row = @getRowByRecord(record)
		row.addClass("grid-selected") if row
		return


	modelDeselect: (selection, record) ->
		row = @getRowByRecord(record)
		row.removeClass("grid-selected") if row
		return



module.exports = RowSelector