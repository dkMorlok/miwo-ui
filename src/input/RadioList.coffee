Radio = require './Radio'


class RadioList extends Miwo.Container

	xtype: 'radioboxlist'
	isInput: true
	inline: false
	radioName: null
	componentCls: 'radiolist'


	setChecked: (name) ->
		@components.each (radio)=>
			radio.setChecked(radio.name is name)
			return
		return


	setDisabled: (name, disabled) ->
		if Type.isString(name)
			@get(name).setDisabled(disabled)
		else
			disabled = name
			@components.each (checkbox)=>
				checkbox.setDisabled(disabled)
				return
		return


	setValue: (value) ->
		@components.each (checkbox, name)=>
			checkbox.setChecked(value is name)
			return
		return


	getValue: () ->
		value = null
		@components.each (radio, name)=>
			if radio.isChecked() && !radio.disabled
				value = name
			return
		return value


	addItem: (name, label) ->
		@add(name, @createRadio(name, label))
		return


	createRadio: (name, label) ->
		radio = new Radio
			id: @id+'-'+name
			name: name
			radioName: @radioName
			label: label
			cls: if @inline then 'radio-inline' else null

		radio.on 'change',  =>
			if @disabled then return
			@setChecked(name)
			@emit('change')
			return

		radio.on 'blur', =>
			if @disabled then return
			@emit('blur')
			return

		radio.on 'focus', =>
			if @disabled then return
			@emit('focus')
			return

		return radio


	clear: () ->
		@components.each (component, name) =>
			@removeComponent(name)
			component.destroy()
			return
		return


module.exports = RadioList