Button = require './Button'
DropdownList = require '../dropdown/List'


class DropdownButton extends Button

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
		return @dropdown


	doRender: ->
		super
		caret = new Element('span', {cls: 'caret'})
		caret.inject(@getContentEl())
		return


	click: ->
		@getDropdown().toggle()
		return


	doDestroy: ->
		@dropdown.destroy() if @dropdown
		super


module.exports = DropdownButton