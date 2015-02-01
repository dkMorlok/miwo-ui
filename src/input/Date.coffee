TextInput = require './Text'

class DateInput extends TextInput

	xtype: 'dateinput'
	type: 'date'
	placeholder: 'yyyy-mm-dd'
	startDate: null
	endDate: null
	todayBtn: false
	clearBtn: false
	popover: null


	afterRender: ->
		super
		@el.set('type', 'text')
		@el.on 'click', => @openPicker()
		return


	setValue: (value) ->
		if Type.isDate(value) then value = @formatDate(value)
		super(value)
		return


	openPicker: ->
		if @disabled || @readonly then return
		@popover = @createPicker() if !@popover
		@popover.show()
		@popover.get('picker').setDate(@parseDate(@getValue()), true)
		return


	hidePicker: ->
		@popover.close()
		return


	createPicker: ->
		popover = miwo.pickers.createPopoverPicker 'date',
			target: @el
			type: @type
			startDate: @startDate
			endDate: @endDate
			todayBtn: @todayBtn
			clearBtn: @clearBtn
		popover.get('picker').on 'selected', (picker, date) =>
			@setValue(date)
			@hidePicker()
			@emit('changed', this, @getValue())
			return
		popover.on 'close', =>
			@popover = null
			return
		return popover


	formatDate: (date) ->
		return date.getFullYear()+ '-' + (date.getMonth()+1).pad(2)+ '-' + date.getDate().pad(2)


	parseDate: (value) ->
		if !value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) then return null
		parts = value.split('-')
		return new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]))


	doDestroy: ->
		@popover.destroy() if @popover
		super


module.exports = DateInput