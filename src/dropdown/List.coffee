Item = require './Item'
Divider = require './Divider'


class DropdownList extends Miwo.Container

	xtype: "dropdownlist"
	el: "ul"
	baseCls: "dropdown-menu"
	target: null
	visible: false
	role: 'menu'
	zIndexManage: true


	afterInit: ->
		super
		miwo.dropdownMgr.register(this)
		@renderTo = miwo.body
		return


	addItem: (name, config) ->
		return @add(name, new Item(config))


	addDivider: ->
		return @add(new Divider())


	doShow: ->
		super
		pos = @target.getPosition()
		pos.y += @target.getSize().y-3
		@setPosition(pos)
		@toFront()
		return


	toggle: ->
		if @visible then @hide() else @show()
		return


	doHide: ->
		super
		@resetRendered(true)
		@toBack()
		return


	doDestroy: ->
		miwo.dropdownMgr.unregister(this)
		super


module.exports = DropdownList