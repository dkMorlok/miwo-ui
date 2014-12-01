Button = require './Button'
DropdownList = require '../dropdown/List'


class DropdownButton extends Button

	dropdown: null


	afterInit: ->
		super
		document.on('click', @bound('onBodyClick'))
		return


	afterRender: ->
		super
		@el.set('aria-haspopup', true)
		@el.set('aria-expanded', false)
		return


	getDropdown: () ->
		if !@dropdown
			@dropdown = new DropdownList({target: @el})
			@dropdown.el.set('aria-labelledby', @id)
			@dropdown.on 'show', (dropdown)=>
				DropdownButton.dropdown = dropdown
			@dropdown.on 'hide', (dropdown)=>
				DropdownButton.dropdown = null
		return @dropdown


	addItem: (name, text, handler) ->
		return @getDropdown().addItem name,
			text: text
			handler: handler


	addDivider: () ->
		return @getDropdown().addDivider()


	renderText: () ->
		text = super()
		text += ' ' if text
		text += '<span class="caret"></span>'
		return text


	click: (e) ->
		if DropdownButton.dropdown && DropdownButton.dropdown isnt @dropdown then DropdownButton.dropdown.hide()
		@getDropdown().toggle()
		return


	onBodyClick: (e) ->
		if @dropdown
			dropdown = e.target.getParent('#'+@dropdown.id)
			if !dropdown then @dropdown.hide()
		return


	doDestroy: () ->
		@dropdown.destroy() if @dropdown
		document.un('click', @bound('onBodyClick'))
		super()


module.exports = DropdownButton