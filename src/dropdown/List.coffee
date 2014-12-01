Item = require './Item'
Divider = require './Divider'


class DropdownList extends Miwo.Container

	xtype: "dropdownlist"
	el: "ul"
	baseCls: "dropdown-menu"
	target: null
	visible: false


	afterInit: () ->
		super
		@renderTo = miwo.body
		return


	addItem: (name, config) ->
		return @add name, new Item(config)


	addDivider: ->
		return @add new Divider()


	show: ->
		super()
		pos = @target.getPosition()
		pos.y += @target.getSize().y-3
		@setPosition(pos)
		return


	toggle: ->
		if @visible then @hide() else @show()
		return


	doHide: ->
		super()
		@resetRendered(true)
		return


	afterRender: ->
		super
		@el.set('role', 'menu')
		return


module.exports = DropdownList