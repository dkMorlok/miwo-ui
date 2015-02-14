class OptionGroup extends Miwo.Object

	select: null
	label: null


	constructor: (@select, config) ->
		super(config)
		@el = new Element('optgroup', {label: @label})
		return


	setLabel: (label) ->
		@el.set('label', label)
		return this


	addOption: (value, text) ->
		option = new Element('option', {value:value, html:text})
		option.inject(@el)
		return this



class SelectInput extends Miwo.Component

	xtype: 'selectinput'
	isInput: true
	el: 'select',
	componentCls: 'form-control'


	addOption: (value, text) ->
		option = new Element('option', {value:value, html:text})
		option.inject(@el)
		return


	addGroup: (title) ->
		return OptionGroup(this, {label: title})


	clear: ->
		@el.empty()
		return


	setDisabled: (disabled) ->
		super(disabled)
		@el.toggleClass('disabled', disabled)
		return


	setValue: (value) ->
		@el.set('value', value)
		return this


	getValue: ->
		return @el.get('value')


	getInputEl: ->
		return @el


	getInputId: ->
		return @id


module.exports = SelectInput