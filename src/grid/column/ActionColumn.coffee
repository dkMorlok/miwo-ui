Column = require './Column'
Action = require '../Action'
Button = require '../../buttons/Button'
DropdownButton = require '../../buttons/DropdownButton'
PopoverSubmit = require '../utils/PopoverSubmit'


class ActionColumn extends Column

	xtype: 'actioncolumn'
	actions: null
	align: 'right'
	colClass: 'actions'
	isActionColumn: true
	btnSize: 'sm'

	# disable update cell if row is updated
	preventUpdateCell: true

	popover: null
	popoverCell: null


	constructor: () ->
		@actions = {}


	attachedContainer: (grid) ->
		@btnSize = grid.actionBtnSize || 'sm'
		return


	addAction: (name, config) ->
		action = new Action(config)
		action.name = name
		@actions[name] = action
		return action


	removeAction: (name) ->
		delete @actions[name]
		return this


	onRenderCell: (td, value, record, rowIndex) ->
		inline = []
		list = []
		buttons = []

		for name, action of @actions
			if action.inline
				inline.push(action)
			else
				list.push(action)

		for action in inline
			btn = new Button
				size: @btnSize
				name: action.name
				text: action.text
				handler: (btn) =>
					@onActionClick(@actions[btn.name], record, td, btn)
					return
			btn.render(td)
			buttons.push(btn)

		if list.length > 0
			btn = new DropdownButton
				size: @btnSize
			for action in list
				btn.addDivider() if action.divider
				btn.addItem action.name, action.text, (item)=>
					@onActionClick(@actions[item.name], record, td, btn)
					return
			btn.render(td)
			buttons.push(btn)

		td.store('buttons', buttons)
		return


	onDestroyCell: (td) ->
		buttons = td.retrieve('buttons')
		for button in buttons then button.destroy()
		td.eliminate('buttons')
		if @popoverCell && @popoverCell is td then @closePopover()
		return


	onActionClick: (action, record, td, btn) ->
		if !action.confirm
			@getGrid().onActionSubmit(action, record)
		else
			@closePopover()
			@popover = new PopoverSubmit
				renderTo: miwo.body
				target: btn.el
				title: miwo.tr("miwo.grid.confirm")
				placement: action.confirmPlacement || 'left'
				onSubmit: ()=> @getGrid().onActionSubmit(action, record)
				onCancel: ()=> @closePopover()
			@popover.show()
			@popoverCell = td
		return


	closePopover: () ->
		if !@popover then return
		@popover.destroy()
		@popover = null
		@popoverCell = null
		return

module.exports = ActionColumn