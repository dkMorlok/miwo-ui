TextControl = require './Text'
DateInput = require '../../input/Date'


class DateControl extends TextControl

	xtype: "datefield"
	type: 'date'
	validateOnChange: false
	startDate: null
	endDate: null
	pickerBtn: false
	todayBtn: false
	clearBtn: false
	resettable: false
	editable: false # by default is not editable, only by picker

	resetBtn: null


	afterInit: ->
		super
		@append = '<span class="glyphicon glyphicon-calendar"></span>'
		@addResetButton() if @resettable
		return


	onDirtyChange: (isDirty) ->
		@getButton('reset').setDisabled(!isDirty) if @resettable
		return


	createInput: ->
		input = new DateInput
			id: @id+'-input'
			name: @name
			type: @type
			disabled: @disabled
			readonly: @readonly
			placeholder: 'yyyy-mm-dd'
			startDate: @startDate
			endDate: @endDate
			todayBtn: @todayBtn || @pickerBtn
			clearBtn: @clearBtn || @pickerBtn
		input.on 'changed', (picker, value) =>
			@setValue(value)
			return
		input.on 'reset', =>
			@reset()
			return
		return input


	initRules: ->
		super
		@rules.addRule("date")
		return


	afterRenderControl: ->
		super
		@getElement('.glyphicon-calendar').getParent()
			.setStyle('cursor', 'pointer')
			.on 'click', => @getInput().openPicker() # only if not disabled and not readonly
		return


module.exports = DateControl