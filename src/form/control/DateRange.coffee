BaseControl = require './BaseControl'
DateRangeInput = require '../../input/DateRange'


class DateRangeControl extends BaseControl

	xtype: "daterange"
	readonly: false
	startDate: null
	endDate: null
	pickerBtn: false
	todayBtn: false
	clearBtn: false
	resettable: false
	editable: false # by default is not editable, only by picker


	afterInit: ->
		super
		@addResetButton() if @resettable
		return


	onDirtyChange: (isDirty) ->
		@getButton('reset').setDisabled(!isDirty) if @resettable
		return


	createInput: ->
		input = new DateRangeInput
			id: @id+'-input'
			name: @name
			disabled: @disabled
			readonly: @readonly
			startDate: @startDate
			endDate: @endDate
			todayBtn: @todayBtn || @pickerBtn
			clearBtn: @clearBtn || @pickerBtn
		input.on 'changed', (picker, value) =>
			@setValue(value)
			return
		return input


	setValue: (value) ->
		@input.setValue(value)
		super(value)
		return


	setDisabled: (disabled) ->
		@input.setDisabled(disabled)
		super(disabled)
		return


	afterRenderControl: ->
		super
		@input.el.addClass('has-append')  if @resettable
		return


module.exports = DateRangeControl