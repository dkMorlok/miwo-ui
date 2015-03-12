Item = require './Item'
DropdownList = require '../dropdown/List'


class NavbarDropdownItem extends Item

	dropdown: null


	afterRender: ->
		super
		@el.set('aria-haspopup', true)
		@el.set('aria-expanded', false)
		return


	getDropdown: ->
		if !@dropdown
			@dropdown = new DropdownList({target: @el})
			@dropdown.el.set('aria-labelledby', @id)
			@dropdown.on 'show', (dropdown) =>
				DropdownList.dropdown = dropdown
				document.on('click', @bound('onBodyClick'))
				return
			@dropdown.on 'hide', (dropdown)=>
				DropdownList.dropdown = null
				document.un('click', @bound('onBodyClick'))
				return
		return @dropdown


	addItem: (name, text, handler) ->
		return @getDropdown().addItem name,
			text: text
			handler: handler


	addDivider: ->
		return @getDropdown().addDivider()


	doRender: ->
		super
		caret = new Element "span",
			cls: 'caret'
		caret.inject(@getContentEl())
		return


	click: (e) ->
		if DropdownList.dropdown && DropdownList.dropdown isnt @dropdown then DropdownList.dropdown.hide()
		@getDropdown().toggle()
		return


	onBodyClick: (e) ->
		if @dropdown
			dropdown = e.target.getParent('#'+@dropdown.id)
			if !dropdown then @dropdown.hide()
		return


	doDestroy: ->
		@dropdown.destroy() if @dropdown
		super()


module.exports = NavbarDropdownItem