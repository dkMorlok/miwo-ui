Button = require '../buttons/Button'
Popover = require '../tip/Popover'
ColorPicker = require '../picker/Color'


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
		if @popover then return
		@popover = @createPicker()
		@popover.show()
		return


	closePicker: () ->
		if !@popover then return
		@popover.close()
		@popover = null
		return


	createPicker: () ->
		popover = new Popover
			title: 'Select color'
			target: @inputEl
			styles: {maxWidth: 500}

		popover.on "close", () =>
			@closePicker()
			return

		picker = @popover.add('picker', new ColorPicker())
		picker.setColor(@getValue())

		picker.on "colorchange", (picker, hex) =>
			@emit("colorchange", this, hex)
			@setValue("#" + hex)
			return

		picker.on "selected", (picker, hex) =>
			@emit('changed', this, hex)
			@setValue("#" + hex)
			@closePicker()
			return

		return popover


	getInputEl: () ->
		return @inputEl


	getInputId: () ->
		return @id+'-input'


module.exports = ColorInput