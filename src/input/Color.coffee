Button = require '../buttons/Button'


class ColorInput extends Miwo.Component

	xtype: "colorinput"
	value: '#ffffff'
	resetable: true

	resetBtn: null
	popover: null


	doRender: () ->
		@el.addClass('colorfield')

		@inputEl = new Element 'input',
			id: @getInputId()
			cls: 'form-control'
			type: 'color'
		@inputEl.inject(@el)

		@resetBtn = new Button
			icon: 'remove'
			handler: => @emit('reset', this)
		@resetBtn.render(@el)

		@inputEl.on 'click', (event) =>
			event.stop()
			@openPicker()
			return
		return


	afterRender: () ->
		super()
		@setDisabled(@disabled) if @disabled
		@setResetable(@resetable) if @resetable
		return


	setValue: (@value) ->
		if !@rendered then return
		@inputEl.set("value", value)
		return


	getValue: () ->
		return if @rendered then @inputEl.get("value") else @value


	setDisabled: (disabled) ->
		super(disabled)
		if !@rendered then return
		@inputEl.toggleClass('disabled', disabled)
		@resetBtn.setDisabled(disabled) if @resetBtn
		return


	setResetable: (@resetable) ->
		if !@rendered then return
		@resetBtn.setVisible(resetable)  if @resetBtn
		return


	openPicker: ->
		@popover = @createPicker()  if !@popover
		@popover.target = @inputEl
		@popover.show()
		picker = @popover.get('picker')
		picker.setColor(@getValue())
		@mon picker, 'colorchange', 'onPickerColorChange'
		@mon picker, 'selected', 'onPickerColorSelected'
		return


	hidePicker: () ->
		@popover.hide()
		picker = @popover.get('picker')
		@mun picker, 'colorchange', 'onPickerColorChange'
		@mun picker, 'selected', 'onPickerColorSelected'
		return


	createPicker: () ->
		# use shared picker from pickerManager
		return miwo.pickers.get('color')


	onPickerColorChange: (picker, hex) ->
		@emit("colorchange", this, hex)
		@setValue("#" + hex)
		return


	onPickerColorSelected: (picker, hex) ->
		@emit('changed', this, hex)
		@setValue("#" + hex)
		@hidePicker()
		return


	getInputEl: () ->
		return @inputEl


	getInputId: () ->
		return @id+'-input'


	doDestroy: () ->
		@popover = null
		super


module.exports = ColorInput