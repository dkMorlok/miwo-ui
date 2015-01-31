class BaseDatePicker extends Miwo.Component


	startDate: null
	endDate: null
	selectedDate: null
	activeDate: null
	focusedDate: null
	componentCls: 'datepicker'
	moveIndex: null
	items: null


	doInit: ->
		super
		@setActiveDate(@activeDate || new Date())
		@setStartDate(@startDate) if @startDate
		@setEndDate(@endDate) if @endDate
		return


	setStartDate: (startDate) ->
		@startDate = if startDate then new Date(startDate.getFullYear(), startDate.getMonth(), 1) else null
		return


	setEndDate: (endDate) ->
		@endDate = if endDate then new Date(endDate.getFullYear(), endDate.getMonth()+1, 0) else null
		return


	setActiveDate: (activeDate) ->
		@activeDate = new Date(activeDate.getTime())
		@activeDate.setDate(1)
		return


	setDate: (date, silent) ->
		if date
			@select(date, silent)
			@activate(date)
		else
			@select(null, silent)
			@activate(new Date())
		return


	getDate: ->
		return @selectedDate


	select: (date, silent) ->
		if date
			@selectedDate = new Date(date.getTime())
			@focusedDate = new Date(date.getTime())
			@updateCalendar()
		else
			@selectedDate = null
			@focusedDate = null
			@updateCalendar()
		@emit('selected', this, @selectedDate) if !silent
		return


	activate: (year, month) ->
		if Type.isDate(year)
			month = year.getMonth()
			year = year.getFullYear()
		@activeDate.setMonth(month) if month isnt undefined && month isnt null
		@activeDate.setFullYear(year) if year isnt undefined && year isnt null
		@renderCalendar()
		return


	isDayEnabled: (date) ->
		if @startDate && @endDate
			return date >= @startDate && date <= @endDate
		else if @startDate
			return date >= @startDate
		else if date <= @endDate
			return true
		else
			return true


	formatYear: (date) ->
		return date.getFullYear()


	formatMonth: (date) ->
		return if date.format then date.format('B') else date.toString().split(' ')[1]


	doRender: ->
		@renderPanel()
		return


	renderPanel: ->
		@panel = new Element 'table',
			cls: 'table-condensed datepicker-panel'
			tabindex: -1
			parent: @el
			html: '<thead></thead><tbody></tbody>'
		@renderHeader()
		@renderCalendar()
		return


	renderHeader: ->
		tr = new Element 'tr',
			html: '<tr>'+
				'<th class="prev">«</th>'+
				'<th class="switch" colspan="2"></th>'+
				'<th class="next">»</th>'+
			'</tr>'
		tr.inject(@getElement('thead'))
		return


	renderCalendar: ->
		return


	updateCalendar: ->
		return


	afterRender: ->
		super
		@panel.getElement('.prev').on 'click', =>
			@activatePrev()
			return

		@panel.getElement('.next').on 'click', =>
			@activateNext()
			return

		@panel.getElement('.switch').on 'click', =>
			@emit('switch', this)
			return

		@panel.on 'click:relay(tbody td)', (event, target) =>
			if !target.hasClass('disabled')
				item = @items[target.get('data-index')]
				@select(item.date)
				@activate(item.date) if item.foreign
			return

		@panel.on 'mouseenter:relay(tbody td)', (event, target) =>
			item = @items[target.get('data-index')]
			if @isDayEnabled(item.date)
				@focusedIndex = item.index
				@focusedDate = new Date(item.date)
				@updateCalendar()
			return

		@keyListener = new Miwo.utils.KeyListener(@panel, 'keydown')
		@keyListener.pause()
		@keyListener.on 'up', =>
			@tryMoveFocus(@moveIndex.up)
			return true

		@keyListener.on 'down', =>
			@tryMoveFocus(@moveIndex.down)
			return true

		@keyListener.on 'left', =>
			@tryMoveFocus(@moveIndex.left)
			return true

		@keyListener.on 'right', =>
			@tryMoveFocus(@moveIndex.right)
			return true

		@keyListener.on 'enter', =>
			item = @items[@focusedIndex]
			@select(item.date)
			@activate(item.date) if !item.foreign
			return true

		if @selectedDate
			@focusedDate = new Date(@selectedDate.getTime())
		else
			@focusedDate = new Date(@activeDate.getTime())

		if @selectedDate
			@activate(@selectedDate)
		return


	doShow: ->
		super
		@keyListener.resume() if @keyListener
		return


	doHide: ->
		super
		@keyListener.pause() if @keyListener
		return


	doDestroy: ->
		@keyListener.destroy() if @keyListener
		super



module.exports = BaseDatePicker