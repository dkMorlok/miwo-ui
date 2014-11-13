Action = require './Action'
Button = require '../buttons/Button'
Select = require '../input/Select'
PopoverSubmit = require './utils/PopoverSubmit'


class Operations extends Miwo.Component

	componentCls: 'grid-operations'
	actions: null
	select: null
	submit: null


	constructor: (@grid, config)->
		super(config)
		@actions = {}


	addAction: (name, config) ->
		action = new Action(config)
		action.name = name
		@actions[name] = action
		return action


	doRender: () ->
		@select = new Select({id:@id+'-operation'})
		@select.render(@el)
		@select.addOption(action.name, action.text)  for name,action of @actions

		@submit = new Button
			text: Locale.get("miwo.grid.execute") || 'Do'
			handler: =>
				action = @actions[@select.getValue()]
				@onOperationSubmit(action)
				return
		@submit.render(@el)
		return


	onOperationSubmit: (action) ->
		if !action.confirm
			@grid.onOperationSubmit(action)
		else
			@popover = new PopoverSubmit
				renderTo: @grid.el
				target: @submit.el
				title: Locale.get("miwo.grid.confirm") || 'Confirm',
				placement: action.confirmPlacement
				onSubmit: () => @grid.onOperationSubmit(action)
			@popover.show()
		return


module.exports = Operations