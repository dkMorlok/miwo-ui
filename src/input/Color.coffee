Button = require '../buttons/Button'
BaseInput = require './BaseInput'


class ColorInput extends BaseInput

	xtype: "colorinput"
	baseCls: 'colorfield'
	value: '#ffffff'
	readonly: false
	resettable: false
	pickerPlacement: 'bottom'

	popover: null


	doRender: ->
		@el.addClass('clearfix')

		@inputEl = new Element 'input',
			id: @getInputId()
			cls: 'form-control '+@getBaseCls('color')
			type: 'color'
			tabindex: 0
			parent: @el

		@textEl = new Element 'input',
			id: @getInputId('color')
			cls: 'form-control '+@getBaseCls('text')
			type: 'text'
			tabindex: -1
			parent: @el

		@resetBtn = new Button
			icon: 'remove'
			visible: @resettable
			handler: =>
				@emit('reset', this)
				@setFocus()
				return
		@resetBtn.render(@el)

		@inputEl.on 'click', @bound('onInputClick')
		@textEl.on 'mousedown', @bound('onInputClick')
		return


	onInputClick: (event) ->
		event.stop()
		@setFocus() if @focus
		@openPicker()
		return


	afterRender: ->
		super()
		@inputEl.on 'keydown', (event)=>
			if event.key is 'space' or event.key is 'enter'
				event.stop()
				@openPicker()
			return

		@inputEl.on 'focus', =>
			@setFocus()
			return

		@inputEl.on 'blur', =>
			@blur()
			return
		return


	setValue: (value) ->
		@inputEl.set("value", value)
		@textEl.set("value", value)
		return this


	getValue: ->
		return @inputEl.get("value")


	setDisabled: (disabled) ->
		super(disabled)
		@inputEl.set('disabled', disabled)
		@textEl.set('disabled', disabled)
		@resetBtn.setDisabled(disabled)
		return this


	setResettable: (@resettable) ->
		@resetBtn.setVisible(@resettable)
		return this


	openPicker: ->
		if @disabled || @readonly then return
		@popover = @createPicker() if !@popover
		@popover.show()
		@popover.get('picker').setColor(@getValue())
		return


	hidePicker: ->
		@popover.close()
		return


	createPicker: ->
		popover = miwo.pickers.createPopoverPicker 'color',
			target: @inputEl
			placement: @pickerPlacement
		picker = popover.get('picker')
		picker.on 'changed', (picker, hex) =>
			value = @formatColor(hex)
			@emit("changed", this, value)
			return
		picker.on 'selected', (picker, hex) =>
			value = @formatColor(hex)
			@setValue(value)
			@emit('selected', this, value)
			@hidePicker()
			return
		popover.on 'close', =>
			@popover = null
			@setFocus()
			@emit("changed", this, @getValue())
			return
		return popover


	formatColor: (color) ->
		return '#' + color.toLowerCase()


	doDestroy: ->
		@popover.destroy() if @popover
		@resetBtn.destroy() if @resetBtn
		super()


module.exports = ColorInput