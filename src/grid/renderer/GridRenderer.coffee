WidthManager = require './WidthManager'


class GridRenderer extends Miwo.Object

	# @cfg {Number}
	dblclickdelay: 0

	# common used objects
	grid: null
	columns: null

	# private properties
	thead: null
	tfoot: null
	tbody: null
	tfilters: null
	widthManager: null
	cellclickTimeoutId: null


	constructor: (@grid, config) ->
		super(config)
		@columns = []
		@widthManager = new WidthManager(this, @widthManager)
		return


	render: ->
		grid = @grid
		grid.on("parentshown", @bound('onGridParentShown'))
		grid.on("selectionchange", @bound('onSelectionChanged'))

		# prepare columns, checker pull to begin
		for column in grid.getColumns()
			if column.isCheckerColumn
				@columns.push(column)
		for column in grid.getColumns()
			if !column.isCheckerColumn
				@columns.push(column)

		bodyEl = grid.bodyEl
		bodyEl.addClass('grid-stripe')  if grid.stripe
		bodyEl.addClass('grid-nowrap')  if grid.nowrap
		bodyEl.addClass('grid-rowclickable')  if grid.rowclickable

		# header TABLE
		theadTable = new Element("table")
		theadTable.inject(grid.headerEl)
		# header titles
		@renderHeader(theadTable)
		# header filters
		@renderFilters(theadTable)

		# body TABLE
		tbodyTable = new Element("table")
		tbodyTable.inject(grid.bodyEl)
		# body rows
		@renderBody(tbodyTable)

		# footer
		@renderFooter(grid.footerEl)
		grid.emit("render", grid)
		for column in @columns then column.afterRender()
		return


	afterRender: ->
		@widthManager.actualize()
		return


	refresh: ->
		@destroyRows(@tbody)
		@renderBody(@tbody)
		@widthManager.actualize()
		@grid.onRefresh()
		return


	recordAdded: (record) ->
		@renderRow(@tbody, record, @tbody.getChildren().length)  # push to end
		@syncRows()
		return


	recordRemoved: (record) ->
		tr = @getRowById(record.getId())
		if tr
			@destroyRow(tr)
			@syncRows()
		return


	recordUpdated: (record) ->
		tr = @getRowById(record.getId())
		if tr
			@updateRow(tr, record)
			@syncRows()
		else
			@renderRow(@tbody, record)
			@syncRows()
		return


	renderHeader: (theadTable) ->
		thead = new Element("thead", {cls: "grid-headers"})
		thead.inject(theadTable)
		@thead = thead

		tr = new Element("tr").inject(thead)
		for column in @columns
			th = new Element("th").inject(tr)
			th.addClass('text-'+column.align)
			th.addClass('grid-col-'+column.colClass) if column.colClass
			th.set("column", column.name)
			th.set("html", column.renderHeader())
			th.set("title", column.title) if column.title
			th.setVisible(false) if !column.visible

			column.onRenderHeader(th) if column.onRenderHeader
			@grid.emit("headerrender", @grid, th, column)
		return


	renderFilters: (theadTable) ->
		# @tfilters = new Element("tbody", {cls: "grid-filters"})
		# @tfilters.inject(theadTable)
		# not implemented yet
		return


	renderBody: (tbodyTable) ->
		tbody = new Element("tbody", {cls: "grid-rows"})
		tbody.inject(tbodyTable)
		tbody.on("click:relay(td)", @bound('onCellClick'))
		tbody.on("dblclick:relay(td)", @bound('onCellDblClick'))
		@tbody = tbody
		@grid.tbodyEl = tbody

		records = @grid.getRecords()

		if @grid.groupBy
			groups = {}
			# group records
			for record in records
				value = record.get(@grid.groupBy)
				groups[value] = []  if !groups[value]
				groups[value].push(record)
			# render grouped records
			for name,records of groups
				@renderGroup(tbody, name)
				@renderRows(tbody, records)
		else
			@renderRows(tbody, records)

		@reindexRows()
		return


	renderGroup: (tbody, name) ->
		tr = new Element("tr", {cls: "grid-row-group", parent:tbody, 'data-group':name})
		tr.store("rowid", 'group-'+name)
		td = new Element("td", {html: name, colspan: @columns.length, parent: tr})
		@grid.emit("grouprender", @grid, td, name)
		return


	renderRows: (tbody, records) ->
		for record,index in records
			@renderRow(tbody, record, index)
		return


	renderRow: (tbody, record, index) ->
		tr = new Element("tr", {cls: "grid-row-data"})
		tr.store("record", record)
		tr.store("rowid", record.getId())
		tr.set("data-row", record.getId())
		tr.inject(tbody)

		# render row
		for column in @columns
			@renderCell(tr, record, column)

		# notify after row rendered
		@grid.emit("rowrender", @grid, tr, record, index)
		return


	updateRow: (tr, record) ->
		cells = {}
		for td in tr.getElements('td')
			cells[td.get('column')] = td
		for column in @columns
			if !column.preventUpdateCell
				@updateCell(cells[column.name], record, column)
		return


	renderCell: (tr, record, column) ->
		td = new Element("td").inject(tr)
		td.addClass('grid-col-'+column.colClass) if column.colClass
		td.addClass("text-" + column.align)
		td.store("dataIndex", column.getDataIndex())
		td.set("column", column.name)
		td.set("title", record.get(column.titleIndex))  if column.titleIndex
		td.setVisible(false) if !column.visible
		@updateCell(td, record, column)
		return


	updateCell: (td, record, column) ->
		dataIndex = column.getDataIndex()
		value = record.get(dataIndex)
		td.set("html", column.renderValue(value, record))
		column.onRenderCell(td, value, record) if column.onRenderCell
		@grid.emit("cellrender", @grid, td, value, record)
		return


	destroyRows: (tbody) ->
		for tr in tbody.getElements("tr")
			@destroyRow(tr)
		return


	destroyRow: (tr) ->
		record = tr.retrieve("record")
		tr.eliminate("record")
		tr.eliminate("rowid")
		@grid.emit("rowdestroy", @grid, tr)
		for td in tr.getElements("td")
			@destroyCell(td, record)
		tr.destroy()
		return


	destroyCell: (td, record) ->
		column = @grid.get(td.get("column"))
		column.onDestroyCell(td, record) if column.onDestroyCell
		@grid.emit("celldestroy", @grid, td)
		td.eliminate("dataIndex")
		return


	syncRows: () ->
		records = @grid.getRecords()

		if !@grid.groupBy
			positions = []
			for rec in records
				positions.push(rec.getId())
		else
			groups = {}
			for record in records
				value = record.get(@grid.groupBy)
				groups[value] = []  if !groups[value]
				groups[value].push(record)

			for name, records of groups
				groupRow = @tbody.getElement("tr.grid-row-group[data-group='#{name}']")
				if !groupRow
					@renderGroup(@tbody, name)

			for groupRow in @tbody.getElements("tr.grid-row-group")
				groupName = groupRow.get('data-group')
				if !groups[groupName]
					groupRow.destroy()

			positions = [];
			for name, records of groups
				positions.push('group-'+name)
				for record in records
					positions.push(record.getId())

		# rows by ids
		rows = {}
		for row in @tbody.getChildren()
			rows[row.retrieve('rowid')] = row

		# bi-directional sorting
		len = positions.length
		limit = Math.round(len/2)
		for i in [0..limit] by +1
			id = positions.shift()
			row = rows[id]
			@syncRow(row, i) if row

			id = positions.pop()
			row = rows[id]
			@syncRow(row, len-i-1) if row

		@reindexRows()
		return


	syncRow: (row, position) ->
		if row.getIndex() isnt position
			if position is 0
				row.inject(@tbody, 'top')
			else
				prevRow = @tbody.getElement('tr:nth-child("'+position+'")')
				row.inject(prevRow, 'after')
		return


	reindexRows: () ->
		index = 0
		for row in @tbody.getChildren()
			if row.hasClass('grid-row-data')
				row.set('row-index', index++)
		return


	renderFooter: (footerEl) ->
		showFooter = false

		if @grid.operations
			showFooter = true
			hasSelection = @grid.getSelectionModel().hasSelection()
			@grid.operations.render(footerEl)
			@grid.operations.setVisible(hasSelection)

		if !showFooter
			footerEl.hide()
			@grid.el.addClass('grid-nofooter')
		return


	onSelectionChanged: (grid, sm, selection) ->
		hasSelection = selection.length > 0
		if @grid.operations
			@grid.operations.setVisible(hasSelection)
		return


	onCellClick: (e, td) ->
		if td.get("disableclick") then return
		if e.target.tagName is "A" then return

		clearTimeout(@cellclickTimeoutId)
		@cellclickTimeoutId = (=>
			info = @getCellInfo(td)
			@grid.emit("cellclick", @grid, td, info.record, info, e)
			@grid.emit("rowclick", @grid, info.record, info, e)  if @grid.rowclickable
			return
		).delay(@dblclickdelay)
		return


	onCellDblClick: (e, td) ->
		if td.get("disableclick") then return
		if e.target.tagName is "A" then return

		clearTimeout(@cellclickTimeoutId)
		info = @getCellInfo(td)
		@grid.emit("celldblclick", @grid, td, info.record, info, e)
		@grid.emit("rowdblclick", @grid, info.record, info, e)  if @grid.rowclickable
		return


	getCellInfo: (td) ->
		tr = td.getParent()
		dataIndex = td.retrieve("dataIndex")
		record = tr.retrieve("record")
		return {
			tr: tr
			cellIndex: td.getIndex()
			rowIndex: tr.getIndex()
			record: record
			value: record.get(dataIndex)
			dataIndex: dataIndex
			column: td.get("column")
		}


	getRowById: (id) ->
		for tr in @tbody.getElements("tr")
			if tr.retrieve('rowid') is id
				return tr
		return null


	onGridParentShown: (component) ->
		@widthManager.actualize()
		return


	doDestroy: ->
		@widthManager.destroy()
		@grid.un("parentshown", @bound('onGridParentShown'))
		@grid.un("selectionchange", @bound('onSelectionChanged'))
		@destroyRows(@tbody)
		@grid = @tbody = @tfilters = @thead = @tfoot = null
		super()
		return


module.exports = GridRenderer