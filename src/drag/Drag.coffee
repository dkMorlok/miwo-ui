class Drag extends Miwo.Object

	# @config {int}
	snap: 6
	# @config {string}
	unit: 'px'
	# @config {number|boolean}
	grid: null
	# @config {boolean}
	style: true
	# @config {boolean}
	limits: null
	# @config {boolean}
	handle: false
	# @config {boolean}
	invert: false
	# @config {boolean}
	preventDefault: false
	# @config {boolean}
	stopPropagation: false
	# @config {object} {x:'left', y:'top'}
	modifiers: null

	# @event beforestart  (el)
	# @event start (el, event)
	# @event snap (el)
	# @event drag (el, event)
	# @event cancel (el)
	# @event complete (el, event)

	mouse: null
	value: null
	handles: null
	document: null
	element: null

	constructor: (@element, config) ->
		super(config)

		@element = document.id(@element)
		@document = @element.getDocument()
		@modifiers = {x:'left', y:'top'} if !@modifiers

		type = typeOf(@handle)
		@handles = (if type == 'array' or type == 'collection' then $$(@handle) else document.id(@handle)) or @element

		@limits = {x: [], y: []}  if !@limits
		@mouse = {'now': {}, 'pos': {}}
		@value = {'start': {}, 'now': {}}

		if 'ondragstart' in document and !('FileReader' in window) and !Drag.ondragstartFixed
			document.ondragstart = Function.from(false)
			Drag.ondragstartFixed = true

		if @grid is null || typeOf(@grid) == 'number'
			@grid = {x: @grid, y: @grid}

		@attach()
		return


	attach: ->
		@handles.on('mousedown', @bound('start'))
		return this


	detach: ->
		@handles.un('mousedown', @bound('start'))
		return this


	start: (event) ->
		if event.rightClick then return
		event.preventDefault()  if @preventDefault
		event.stopPropagation()  if @stopPropagation

		@mouse.start = event.page
		@emit('beforestart', @element)

		for name,property of @modifiers
			if !property then continue
			style = @element.getStyle(property)
			# Some browsers (IE and Opera) don't always return pixels.
			if style and !style.match(/px$/)
				coordinates = @element.getCoordinates(@element.getOffsetParent()) if !coordinates
				style = coordinates[property]
			if @style
				@value.now[name] = (style or 0).toInt()
			else
				@value.now[name] = @element[property]
			if @invert
				@value.now[name] *= -1
			@mouse.pos[name] = event.page[name] - @value.now[name]

		@document.on('mousemove', @bound('check'))
		@document.on('mouseup', @bound('cancel'))
		return


	check: (event) ->
		if @preventDefault
			event.preventDefault()
		distance = Math.round(Math.sqrt((event.page.x - @mouse.start.x) ** 2 + (event.page.y - @mouse.start.y) ** 2))
		if distance > @snap
			@cancel()
			@document.on('mousemove', @bound('drag'))
			@document.on('mouseup', @bound('stop'))
			@emit('start', @element, event)
			@emit('snap', @element)
		return


	drag: (event) ->
		if @preventDefault
			event.preventDefault()
		@mouse.now = event.page
		for name,property of @modifiers
			if !property then continue
			@value.now[name] = @mouse.now[name] - @mouse.pos[name]
			if @invert
				@value.now[name] *= -1
			if @limits[name]
				if (@limits[name][1] or @limits[name][1] == 0) and @value.now[name] > @limits[name][1]
					@value.now[name] = @limits[name][1]
				else if (@limits[name][0] or @limits[name][0] == 0) and @value.now[name] < @limits[name][0]
					@value.now[name] = @limits[name][0]
			if @grid && @grid[name]
				@value.now[name] -= (@value.now[name] - (@limits[name][0] or 0)) % @grid[name]
			if @style
				@element.setStyle(property, @value.now[name] + @unit)
			else
				@element[property] = @value.now[name]
		@emit('drag', @element, event)
		return


	cancel: (event) ->
		@document.un('mousemove', @bound('check'))
		@document.un('mouseup', @bound('cancel'))
		@emit('cancel', @element) if event
		return


	stop: (event) ->
		@document.un('mousemove', @bound('drag'))
		@document.un('mouseup', @bound('stop'))
		@emit('complete', @element, event) if event
		return


module.exports = Drag