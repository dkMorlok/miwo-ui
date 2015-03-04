class WidthManager extends Miwo.Object

	defaultFitWidth: 100
	renderer: null
	widths: null

	constructor: (@renderer, config) ->
		super(config)
		window.on("resize", @bound("onWindowResize"))
		return


	actualize: (tr = null) ->
		if !@widths
			@widths = @detectWidths()
		if tr
			# update single row sizes
			@actualizeRow(tr, @widths)
		else
			# update header sizes
			theadRow = @renderer.thead
			for name,width of @widths
				if width isnt null
					th = theadRow.getElement("tr th[column=\"" + name + "\"]")
					th.setStyle("width", width)
					th.setStyle("max-width", width)
			# update body sizes
			for tr in @renderer.tbody.getElements("tr.grid-row-data")
				@actualizeRow(tr, @widths)
		return


	actualizeRow: (tr, widths) ->
		for name,width of widths
			if width isnt null
				td = tr.getElement("td[column=\"" + name + "\"]")
				td.setStyle("width", width)
				td.setStyle("max-width", width)
		return


	onWindowResize: ->
		@widths = null
		@actualize()
		return


	detectWidths: ->
		renderer = @renderer
		freeWidth = renderer.grid.bodyEl.getWidth()
		totalFit = 0
		widths = {}
		isFit = false
		columns = []

		for column in renderer.columns
			if column.isVisible()
				columns.push(column)
				if column.widthType is "fit"
					isFit = true

		# calculate sizes
		wildCount = 0
		for column in columns
			name = column.name
			if column.widthType is "auto"
				if column.width
					widths[name] = column.width
				else if isFit
					widths[name] = @defaultFitWidth
				else
					widths[name] = null
					wildCount++
				if widths[name]
					freeWidth -= widths[name]
			if column.widthType is "fit"
				widths[name] = null
				totalFit += (if column.width then column.width else 1)

		for column in columns
			if column.widthType is "fit"
				fitWidth = ((freeWidth * column.width) / totalFit).round()
				if fitWidth < column.minWidth
					widths[column.name] = column.minWidth
					freeWidth -= column.minWidth
				else
					widths[column.name] = fitWidth

				# wild column - unsepcified width
			else if column.widthType is "auto"
				if widths[column.name] is null
					widths[column.name] = (freeWidth / wildCount).round()

		return widths


	doDestroy: ->
		window.un("resize", @bound("onWindowResize"))
		@renderer = null
		super()
		return


module.exports = WidthManager


