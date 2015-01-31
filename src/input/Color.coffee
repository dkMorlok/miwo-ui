Button = require '../buttons/Button'


class ColorInput extends Miwo.Component

	xtype: "colorinput"
	value: '#ffffff'
	resettable: false

	resetBtn: null
	popover: null


	doRender: ->
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
			if @disabled then return
			@openPicker()
			return
		return


	afterRender: ->
		super()
		@setDisabled(@disabled)
		@setResettable(@resettable)
		return


	setValue: (@value) ->
		if !@rendered then return
		@inputEl.set("value", value)
		return


	getValue: ->
		return if @rendered then @inputEl.get("value") else @value


	setDisabled: (disabled) ->
		super(disabled)
		if !@rendered then return
		@inputEl.toggleClass('disabled', disabled)
		@resetBtn.setDisabled(disabled) if @resetBtn
		return


	setResettable: (@resettable) ->
		if !@rendered then return
		@resetBtn.setVisible(resettable)  if @resetBtn
		return


	openPicker: ->
		@popover = @createPicker() if !@popover
		@popover.show()
		@popover.get('picker').setColor(@getValue())
		return


	hidePicker: ->
		@popover.close()
		return


	createPicker: ->
		popover = miwo.pickers.createPicker 'color',
			target: @inputEl
		picker = popover.get('picker')
		picker.on 'changed', (picker, hex) =>
			@emit("changed", this, hex)
			@setValue("#" + hex)
			return
		picker.on 'selected', (picker, hex) =>
			@emit('changed', this, hex)
			@setValue("#" + hex)
			@hidePicker()
			return
		popover.on 'close', =>
			@popover = null
			return
		return popover


	getInputEl: ->
		return @inputEl


	getInputId: ->
		return @id+'-input'


	doDestroy: ->
		@popover.destroy() if @popover
		super


module.exports = ColorInput