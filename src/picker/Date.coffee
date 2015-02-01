DayPicker = require './Day'
MonthPicker = require './Month'
YearPicker = require './Year'


class DatePicker extends Miwo.Container

	startDate: null
	endDate: null
	selectedDate: null
	todayBtn: false
	clearBtn: false


	doInit: ->
		super
		@componentCls = 'datepicker'
		@activeDate = new Date()
		@activeDate.setDate(1)
		@add('day', @createComponentDay())
		@add('month', @createComponentMonth())
		@add('year', @createComponentYear())
		return


	createComponentDay: ->
		picker = new DayPicker
			visible: false
			activeDate: @activeDate
			startDate: @startDate
			endDate: @endDate
			selectedDate: @selectedDate
		picker.on 'switch', =>
			picker.hide()
			@get('month').activate(picker.activeDate)
			@get('month').select(picker.selectedDate, true)
			@get('month').show()
			@emit('switch', this, 'month')
			return
		picker.on 'selected', (picker, date)=>
			@emit('selected', this, date)
			return
		return picker


	createComponentMonth: ->
		picker = new MonthPicker
			visible: false
			activeDate: @activeDate
			startDate: @startDate
			endDate: @endDate
			selectedDate: @selectedDate
		picker.on 'switch', =>
			picker.hide()
			@get('year').show()
			@emit('switch', this, 'year')
			return
		picker.on 'selected', =>
			picker.hide()
			@get('day').activate(picker.selectedDate)
			@get('day').show()
			@emit('switch', this, 'day')
			return
		return picker


	createComponentYear: ->
		picker = new YearPicker
			visible: false
			activeDate: @activeDate
			startDate: @startDate
			endDate: @endDate
			selectedDate: @selectedDate
		picker.on 'selected', =>
			picker.hide()
			@get('month').activate(picker.selectedDate)
			@get('month').show()
			@emit('switch', this, 'month')
			return
		return picker


	activate: (year, month) ->
		@get('day').activate(year, month)
		return


	select: (date, silent) ->
		@get('day').select(date, silent)
		return


	setDate: (date, silent) ->
		@get('day').setDate(date, silent)
		return


	setStartDate: (date) ->
		@getComponents().each (picker)-> picker.setStartDate(date)
		return


	setEndDate: (date) ->
		@getComponents().each (picker)-> picker.setEndDate(date)
		return


	setTodayBtn: (@todayBtn) ->
		@getElement('.todayBtn').setVisible(@todayBtn) if @rendered
		return


	setClearBtn: (@clearBtn) ->
		@getElement('.clearBtn').setVisible(@clearBtn) if @rendered
		return


	getDate: ->
		return @get('day').getDate()


	setType: (type = 'date') ->
		@type = type
		return


	doRender: ->
		super
		table = new Element('table', {parent: @el, cls: 'table-condensed datepicker-footer'})
		tbody = new Element('tbody', {parent: table})
		tr = new Element('tr', {parent: tbody})

		td = new Element('td', {html: miwo.tr('miwo.picker.today'), cls:'todayBtn', parent:tr})
		td.setVisible(@todayBtn)

		td = new Element('td', {html: miwo.tr('miwo.picker.clear'), cls:'clearBtn', parent:tr})
		td.setVisible(@clearBtn)
		return


	afterRender: ->
		super
		@get('day').show()
		@getElement('.todayBtn').on 'click', => @setDate(new Date())
		@getElement('.clearBtn').on 'click', => @setDate(null)
		return


module.exports = DatePicker