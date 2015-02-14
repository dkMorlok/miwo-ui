TextInput = require './Text'

class DateInput extends TextInput

	xtype: 'dateinput'
	type: 'date'
	placeholder: 'yyyy-mm-dd'
	startDate: null
	endDate: null
	todayBtn: false
	clearBtn: false
	rangeSelector: null
	rangeStart: null
	rangeEnd: null
	popover: null


	doInit: ->
		super
		@startDate = @parseDate(@startDate)
		@endDate = @parseDate(@endDate)
		@rangeStart = @parseDate(@rangeStart) || null
		@rangeEnd = @parseDate(@rangeEnd) || null
		return


	afterRender: ->
		super
		@el.set('type', 'text')
		@el.on 'click', => @openPicker()
		@el.on 'keydown', (e) => @onKeyDown(e)
		return


	onKeyDown: (e) ->
		if e.key.length is 1
			e.stop()
		else if e.key is 'up' || e.key is 'down' || e.key is 'left' || e.key is 'right'
			e.stop()
			@openPicker()
		else if e.key is 'backspace'
			e.stop()
			@setValue('')
		return


	setValue: (value) ->
		if value && !Type.isDate(value)
			value = @parseDate(value)
		super(if value then @formatDate(value) else '')
		if @rangeSelector is 'start'
			@setRange(value||false, null, true)
		else if @rangeSelector is 'end'
			@setRange(null, value||false, true)
		return


	setStartDate: (date) ->
		@startDate = @parseDate(date)
		@popover.get('picker').setStartDate(date) if @popover
		return


	setEndDate: (date) ->
		@endDate = @parseDate(date)
		@popover.get('picker').setEndDate(date) if @popover
		return


	setRange: (rangeStart, rangeEnd, silent) ->
		@rangeStart = if rangeStart is false then false else @parseDate(rangeStart) || @rangeStart
		@rangeEnd = if rangeEnd is false then false else @parseDate(rangeEnd) || @rangeEnd
		@popover.get('picker').setRange(@rangeStart, @rangeEnd, silent) if @popover
		return


	openPicker: ->
		if @disabled || @readonly then return
		@popover = @createPicker() if !@popover
		@popover.show()
		@popover.get('picker').setDate(@parseDate(@getValue()), true)
		@popover.get('picker').setFocus()
		return


	hidePicker: ->
		@popover.close()
		return


	createPicker: ->
		popover = miwo.pickers.createPopoverPicker 'date',
			target: @el
			type: @type
			rangeSelector: @rangeSelector
			rangeStart: @rangeStart || null # false means reset picker date, but only null is accepted as value
			rangeEnd: @rangeEnd || null		# false means reset picker date, but only null is accepted as value
			startDate: @startDate
			endDate: @endDate
			todayBtn: @todayBtn
			clearBtn: @clearBtn
		popover.get('picker').on 'selected', (picker, date) =>
			@setValue(date)
			@hidePicker()
			@emit('changed', this, @getValue(), date)
			return
		popover.on 'close', =>
			@popover = null
			@setFocus()
			return
		return popover


	formatDate: (date) ->
		return date.getFullYear()+ '-' + (date.getMonth()+1).pad(2)+ '-' + date.getDate().pad(2)


	parseDate: (value) ->
		if !value then return null
		if Type.isDate(value) then return value
		if !value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) then return null
		parts = value.split('-')
		return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]))


	doDestroy: ->
		@popover.destroy() if @popover
		super


module.exports = DateInput