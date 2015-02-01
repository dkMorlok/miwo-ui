BaseDatePicker = require './BaseDate'

class MonthPicker extends BaseDatePicker

	xtype: "monthpicker"
	baseCls: 'monthpicker'


	beforeInit: ->
		super
		@moveIndex = {'up':-4, 'down':4, 'right':1, 'left':-1}
		return


	activatePrev: ->
		@activate(@activeDate.getFullYear()-1)
		return


	activateNext: ->
		@activate(@activeDate.getFullYear()+1)
		return


	renderCalendar: ->
		date = @activeDate
		prevYear = new Date(date.getFullYear()-1, 12, 0) # last day in previous year
		nextYear = new Date(date.getFullYear()+1, 1, 1) # fist day next year

		@focusedIndex = null
		@items = []
		for i in [0..11]
			@items.push({
				date: new Date(date.getFullYear(), i, 1)
				index: i
			})

		body = @panel.getElement('tbody')
		body.empty()
		for i in [0..2]
			tr = new Element('tr', {parent:body})
			for j in [0..3]
				index = i*4 + j
				item = @items[index]
				item.cell = new Element('td', {parent:tr, html: @formatMonth(item.date), 'data-index': index})
				if !@isDayEnabled(item.date)
					item.cell.addClass('disabled')
				if @isSelected(item.date)
					item.cell.addClass('selected')
				if @isFocused(item.date)
					item.cell.addClass('focus')
					@focusedIndex = index

		enabledPrevYear = @isDayEnabled(prevYear)
		enabledNextYear = @isDayEnabled(nextYear)

		@panel.getElement('.prev').toggleClass('invisible', !enabledPrevYear)
		@panel.getElement('.next').toggleClass('invisible', !enabledNextYear)
		@panel.getElement('.switch').toggleClass('disabled', !enabledPrevYear && !enabledNextYear)
		@panel.getElement('.switch').set('html', date.getFullYear())
		return


	updateCalendar: ->
		for i in [0..11]
			item = @items[i]
			item.cell
				.toggleClass('disabled', !@isDayEnabled(item.date))
				.toggleClass('selected', @isSelected(item.date))
				.toggleClass('focus', @isFocused(item.date))
		return


	isSelected: (date) ->
		return @selectedDate isnt null && @selectedDate.getYear() is date.getYear() && @selectedDate.getMonth() is date.getMonth()


	isFocused: (date) ->
		return @focusedDate isnt null && @focusedDate.getYear() is date.getYear() && @focusedDate.getMonth() is date.getMonth()


	tryMoveFocus: (index) ->
		month = @focusedDate.getMonth()
		focusedIndex = @focusedIndex

		@focusedIndex += index
		@focusedDate.setMonth(month+index)

		if @isDayEnabled(@focusedDate)
			@updateCalendar()
		else
			@focusedDate.setMonth(month)
			@focusedDateIndex = focusedIndex
		return


module.exports = MonthPicker