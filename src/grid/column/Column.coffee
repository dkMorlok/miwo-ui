class Column extends Miwo.Component

	isColumn: true
	text: ''
	title: ''
	visible: true
	sortable: false
	renderer: null
	align: 'left'
	emptyText: ''
	widthType: 'auto'
	width: null
	fit: null
	dataIndex: ''
	titleIndex: null


	afterInit: ->
		super()
		if @fit
			@widthType = 'fit'
			delete @fit
		return


	getGrid: ->
		return @container


	getDataIndex: () ->
		return @dataIndex || @name


	renderHeader: (value, record) ->
		return @text


	renderValue: (value, record) ->
		if @renderer
			html = @renderer(value, record)
		else
			if value is '' or value is undefined or value is null
				html = @emptyText
			else
				html = @formatValue(value, record)
		return html


	formatValue: (value, record) ->
		return value


	afterRender: (renderer, grid) ->
		return


module.exports = Column