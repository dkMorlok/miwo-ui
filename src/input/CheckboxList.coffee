Checkbox = require './Checkbox'


class CheckboxList extends Miwo.Container

	xtype: 'checkboxlistinput'
	isInput: true
	inline: false
	baseCls: 'checkboxlist'


	setChecked: (name, checked) ->
		@get(name).setChecked(checked)
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
			checkbox.setChecked(value.indexOf(name)>=0)
			return
		return


	getValue: ->
		value = []
		@components.each (checkbox, name)=>
			if checkbox.isChecked() && !checkbox.disabled
				value.push(name)
			return
		return value


	addItem: (name, label) ->
		@add(name, @createCheckbox(name, label))
		return


	createCheckbox: (name, label) ->
		checkbox = new Checkbox
			id: @id+'-'+name
			label: label
			cls: if @inline then 'checkbox-inline' else null

		checkbox.on 'change', =>
			if @disabled then return
			@emit('change', this)
			return

		checkbox.on 'blur', =>
			if @disabled then return
			@emit('blur', this)
			return

		checkbox.on 'focus', =>
			if @disabled then return
			@emit('focus', this)
			return

		return checkbox


	clear: ->
		@components.each (component, name) =>
			@removeComponent(name)
			component.destroy()
			return
		return


module.exports = CheckboxList