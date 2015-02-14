DateInput = require './Date'


class DateRangeInput extends Miwo.Container

	xtype: 'daterangeinput'
	isInput: true
	placeholder: 'yyyy-mm-dd'
	readonly: false
	startDate: null
	endDate: null
	todayBtn: false
	clearBtn: false
	baseCls: 'daterange'


	doInit: ->
		super
		@value = [null, null]
		@startDate = @parseDate(@startDate)
		@endDate = @parseDate(@endDate)
		@add('start', @createStartDate())
		@add('end', @createEndDate())
		return


	setDisabled: (disabled) ->
		@get('start').setDisabled(disabled)
		@get('end').setDisabled(disabled)
		return


	setValue: (value) ->
		value = [null, null] if !value # false to reset ranges
		@get('start').setValue(value[0])
		@get('end').setValue(value[1])
		@get('start').setRange(value[0], value[1])
		@get('end').setRange(value[0], value[1])
		return


	setStartDate: (date) ->
		@startDate = @parseDate(date)
		@onDateLimitsChanged()
		return


	setEndDate: (date) ->
		@endDate = @parseDate(date)
		@onDateLimitsChanged()
		return


	getValue: ->
		return [@get('start').getValue(), @get('end').getValue()]


	getRange: ->
		value = @getValue()
		return [@parseDate(value[0]), @parseDate(value[1])]


	getInputEl: ->
		return @get('start').el


	getInputId: ->
		return @get('start').id


	createStartDate: ->
		input = @createInput('start')
		input.on 'changed', (component, value, date) =>
			@emit('changed', this, @getValue())
			@get('end').setRange(date, null, true)
			@onDateLimitsChanged()
			return
		return input


	createEndDate: ->
		input = @createInput('end')
		input.on 'changed', (component, value, date) =>
			@emit('changed', this, @getValue())
			@get('start').setRange(null, date, true)
			@onDateLimitsChanged()
			return
		return input


	createInput: (type) ->
		input = new DateInput
			id: @id+'-'+type
			id: @name+'-'+type
			cls: @getBaseCls(type)
			rangeSelector: type
			disabled: @disabled
			readonly: @readonly
			startDate: @startDate
			endDate: @endDate
			placeholder: @placeholder
			todayBtn: @todayBtn
			clearBtn: @clearBtn
		return input


	onDateLimitsChanged: ->
		range = @getRange()
		@get('end').setStartDate(if @startDate && @startDate > range[0] then @startDate else range[0])
		@get('start').setEndDate(if @endDate && @endDate < range[1] then @endDate else range[1])
		return


	doRender: ->
		@get('start').render(@el)
		(new Element('span', cls:'input-group-addon', html: miwo.tr('miwo.inputs.dateTo'))).inject(@el)
		@get('end').render(@el)
		return


	parseDate: (value) ->
		if !value then return null
		if Type.isDate(value) then return value
		if !value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/) then return null
		parts = value.split('-')
		return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]))


module.exports = DateRangeInput