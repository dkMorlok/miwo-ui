BaseInput = require './BaseInput'


class OptionGroup extends Miwo.Object

	select: null
	label: null


	constructor: (@select, config) ->
		super(config)
		@el = new Element('optgroup', {label: @label, parent: @select.el})
		return


	setLabel: (label) ->
		@el.set('label', label)
		return this


	addOption: (value, text) ->
		option = new Element('option', {value:value, html:text})
		option.inject(@el)
		return this



class SelectInput extends BaseInput

	xtype: 'selectinput'
	el: 'select',
	componentCls: 'form-control'


	afterRender: ->
		super()
		@el.on 'change', ()=> @emit('change', this, @getValue())
		return


	addOption: (value, text) ->
		option = new Element('option', {value:value, html:text})
		option.inject(@el)
		return this


	addGroup: (title) ->
		return new OptionGroup(this, {label: title})


	clear: ->
		@el.empty()
		return this


	setDisabled: (disabled) ->
		super(disabled)
		@el.toggleClass('disabled', disabled)
		return this


	setValue: (value) ->
		@el.set('value', value)
		return this


	getValue: ->
		return @el.get('value')


	getInputEl: ->
		return @el


module.exports = SelectInput