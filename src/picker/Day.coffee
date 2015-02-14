BaseDatePicker = require './BaseDate'

class DayPicker extends BaseDatePicker

	xtype: "daypicker"
	baseCls: 'daypicker'
	rangeStart: null
	rangeEnd: null
	rangeSelector: null


	beforeInit: ->
		super
		@moveIndex = {'up':-7, 'down':7, 'right':1, 'left':-1}
		return


	setRange: (rangeStart, rangeEnd, silent) ->
		@rangeStart = if rangeStart is false then null else rangeStart || @rangeStart
		@rangeEnd = if rangeEnd is false then null else rangeEnd || @rangeEnd
		@emit('range', this, @rangeStart, @rangeEnd) if !silent
		@onRangeChanged(silent)
		@updateCalendar() if @rendered
		return


	setStartDate: (startDate) ->
		@startDate = new Date(startDate.getTime())
		return


	setEndDate: (endDate) ->
		@endDate = new Date(endDate.getTime())
		return


	onRangeChanged: (silent) ->
		return


	activateNext: ->
		@activate(null, @activeDate.getMonth()+1)
		return


	activatePrev: ->
		@activate(null, @activeDate.getMonth()-1)
		return


	onSelected: (silent) ->
		if @rangeSelector is 'end'
			@setRange(null, @selectedDate, silent)
		else if @rangeSelector is 'start'
			@setRange(@selectedDate, null, silent)
		return


	renderHeader: ->
		tr = new Element 'tr',
			html: '<tr>'+
				'<th class="prev">«</th>'+
				'<th class="switch" colspan="5"></th>'+
				'<th class="next">»</th>'+
			'</tr>'
		tr.inject(@getElement('thead'))

		tr = new Element 'tr',
			html: '<tr>'+
				'<th class="dow">Su</th>'+
				'<th class="dow">Mo</th>'+
				'<th class="dow">Tu</th>'+
				'<th class="dow">We</th>'+
				'<th class="dow">Th</th>'+
				'<th class="dow">Fr</th>'+
				'<th class="dow">Sa</th>'+
			'</tr>'
		tr.inject(@getElement('thead'))
		return


	renderCalendar: ->
		date = @activeDate
		firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
		lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
		prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0)
		nextFirstDay = new Date(date.getFullYear(), date.getMonth()+1, 1)
		toDay = new Date().toDateString()

		@focusedIndex = null
		@items = []
		first = firstDay.getDay()-1
		first = 6  if first <= 0
		for i in [first..0] by -1
			@items.push({
				foreign: true
				date: new Date(date.getFullYear(), date.getMonth(), -i)
			})

		for i in [1..lastDay.getDate()]
			@items.push({
				foreign: false
				date: new Date(date.getFullYear(), date.getMonth(), i)
			})

		length = @items.length
		for i in [length..42] # note calendar has 42 items
			@items.push({
				foreign: true
				date: new Date(date.getFullYear(), date.getMonth()+1, i-length+1)
			})

		body = @panel.getElement('tbody')
		body.empty()
		for i in [0..5]
			tr = new Element('tr', {parent:body})
			for j in [0..6]
				index = i*7+j
				item = @items[index]
				td = new Element('td', {parent:tr, html: item.date.getDate(), 'data-index': index})
				if @isFocused(item.date)
					@focusedIndex = index
					@focusedDate = item.date
				if toDay is item.date.toDateString()
					td.addClass('today')
					toDayIndex = index
					toDayDate = item.date
				item.index = index
				item.cell = td

		@updateCalendar()

		if !@focusedDate && toDayDate
			@focusedDate = toDayDate
			@focusedIndex = toDayIndex

		enabledPrevLastDay = @isDayEnabled(prevLastDay)
		enabledNextFirstDay = @isDayEnabled(nextFirstDay)
		@panel.getElement('.prev').toggleClass('invisible', !enabledPrevLastDay)
		@panel.getElement('.next').toggleClass('invisible', !enabledNextFirstDay)
		@panel.getElement('.switch').toggleClass('disabled', !enabledNextFirstDay && !enabledPrevLastDay)
		@panel.getElement('.switch').set('html', @formatMonth(date)+' '+@formatYear(date))
		return


	updateCalendar: ->
		for i in [0..41]
			item = @items[i]
			item.cell
				.toggleClass('inactive', item.foreign)
				.toggleClass('disabled', !@isDayEnabled(item.date))
				.toggleClass('selected', @isSelected(item.date))
				.toggleClass('focus', @isFocused(item.date))
				.toggleClass('range-item', @isDayInRange(item.date))
				.toggleClass('range-start', @isSameDates(@rangeStart, item.date))
				.toggleClass('range-end', @isSameDates(@rangeEnd, item.date))
		return


	isSelected: (date) ->
		return @selectedDate isnt null && @isSameDates(@selectedDate, date)


	isFocused: (date) ->
		return @focusedDate isnt null && @isSameDates(@focusedDate, date)


	isDayInRange: (date) ->
		return @rangeStart isnt null && @rangeEnd isnt null && @rangeStart <= date && @rangeEnd >= date


	isSameDates: (dateA, dateB) ->
		return dateA isnt null && dateB isnt null && dateA.toDateString() is dateB.toDateString()


	tryMoveFocus: (index) ->
		if !@focusedDate then return

		date = @focusedDate.getDate()
		focusedIndex = @focusedIndex

		@focusedIndex += index
		@focusedDate.setDate(date+index)

		if !@items[@focusedIndex]
			console.log("In component #{@name} was error")
			@focusedDate.setDate(date)
			@focusedIndex = focusedIndex
			return

		if @isDayEnabled(@focusedDate)
			if @focusedIndex < 0 || @items[@focusedIndex].foreign
				if @focusedIndex < 15 then @activatePrev() else @activateNext()
			else
				@updateCalendar()
		else
			@focusedDate.setDate(date)
			@focusedIndex = focusedIndex
		return



module.exports = DayPicker