class WidthManager extends Miwo.Object

	defaultFitWidth: 100
	renderer: null
	widths: null


	constructor: (@renderer, config) ->
		super(config)
		window.on("resize", @bound("onWindowResize"))
		return


	actualize: (tr) ->
		if !@widths
			@widths = @detectWidths()

		if tr
			# update only row by argument
			@actualizeRow(tr, @widths)
		else
			# update header sizes
			@actualizeRow(@renderer.thead.getChildren('tr')[0], @widths)
			# update body sizes of first visible row (only 1 is required)
			for row in @renderer.tbody.getChildren("tr.grid-row-data")
				@actualizeRow(row, @widths)
		return


	actualizeRow: (tr, widths) ->
		for name,width of widths
			if width isnt null
				tr.getChildren("[column=\"" + name + "\"]").setStyles
					width: width
					maxWidth: width
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


