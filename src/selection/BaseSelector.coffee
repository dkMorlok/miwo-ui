class BaseSelector extends Miwo.Object

	isSelector: true

	# @cfg {boolean} checkerRequired
	checkerRequired: false

	# @property {Miwo.grid.Grid}
	grid: null

	# @property {Miwo.selection.Model}
	selection: null


	# Set grid
	# @param {Miwo.grid.Grid} grid
	setGrid: (@grid) ->
		@mon(grid, 'rendered', 'gridRendered')
		@mon(grid, 'refresh', 'gridRefresh')
		return


	# Set selection model to manage selections
	# @param {Miwo.selection.Model} selection
	setSelectionModel: (@selection) ->
		@mon(selection, 'select', 'modelSelect')
		@mon(selection, 'deselect', 'modelDeselect')
		@mon(selection, 'change', 'modelChange')
		return


	gridRefresh: (grid) ->
		return


	gridRendered: (grid) ->
		return


	modelSelect: (selection, record, rowIndex) ->
		return


	modelDeselect: (selection, record, rowIndex) ->
		return


	modelChange: (selection, rs) ->
		return


	doDestroy: ->
		@grid = null
		@selection = null
		super



module.exports = BaseSelector