BaseDatePicker = require './BaseDate'

class YearPicker extends BaseDatePicker

	xtype: "yearpicker"
	baseCls: 'yearpicker'


	beforeInit: ->
		super
		@moveIndex = {'up':-4, 'down':4, 'right':1, 'left':-1}
		return


	activatePrev: ->
		@activate(@activeDate.getFullYear()-10)
		return


	activateNext: ->
		@activate(@activeDate.getFullYear()+10)
		return


	renderCalendar: ->
		date = @activeDate
		prevYear = new Date(date.getFullYear()-1, 0, 1)
		nextYear = new Date(date.getFullYear()+10, 0, 1)

		@focusedIndex = null
		@items = []
		for i in [0..11]
			@items.push({
				date: new Date(date.getFullYear()+i-1, 0, 1)
				index: i
				foreign: i==0 && i==11
			})

		body = @panel.getElement('tbody')
		body.empty()
		for i in [0..2]
			tr = new Element('tr', {parent:body})
			for j in [0..3]
				index = i*4 + j
				item = @items[index]
				item.cell = new Element('td', {parent:tr, html: @formatYear(item.date), 'data-index': index, 'data-date':item.date})
				if !@isDayEnabled(item.date)
					item.cell.addClass('disabled')
				if @isSelected(item.date)
					item.cell.addClass('selected')
				if @isFocused(item.date)
					item.cell.addClass('focus')
					@focusedIndex = index

		firstYear = new Date(date.getFullYear(), 0, 1)
		lastYear = new Date(date.getFullYear()+9, 0, 1)
		enabledPrevYear = @isDayEnabled(prevYear)
		enabledNextYear = @isDayEnabled(nextYear)

		@panel.getElement('.prev').toggleClass('invisible', !enabledPrevYear)
		@panel.getElement('.next').toggleClass('invisible', !enabledNextYear)
		@panel.getElement('.switch').toggleClass('disabled', !enabledPrevYear && !enabledNextYear)
		@panel.getElement('.switch').set('html', @formatYear(firstYear)+' - '+@formatYear(lastYear))
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
		return @selectedDate isnt null && @selectedDate.getYear() is date.getYear()


	isFocused: (date) ->
		return @focusedDate isnt null && @focusedDate.getYear() is date.getYear()


	tryMoveFocus: (index) ->
		year = @focusedDate.getFullYear()
		focusedIndex = @focusedIndex

		@focusedIndex += index
		@focusedDate.setFullYear(year+index)

		if @isDayEnabled(@focusedDate)
			if @focusedIndex < 0 || @items[@focusedIndex].foreign
				if @focusedIndex < 6 then @activatePrev() else @activateNext()
			else
				@updateCalendar()
		else
			@focusedDate.setFullYear(year)
			@focusedDateIndex = focusedIndex
		return


module.exports = YearPicker