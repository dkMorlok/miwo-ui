BaseControl = require './BaseControl'
ButtonGroup = require '../../buttons/ButtonGroup'


class ButtonGroupControl extends BaseControl

	xtype: "buttongroupfield"
	items: null
	toggle: 'radio', # checkbox


	setValue: (value) ->
		super(value)
		if @input.toggle is 'radio'
			@input.setActive(value, true, true)
		else
			@input.setActiveAll(false, true) # deactivate all
			if Type.isArray(value)
				@input.setActive(v, true, true)  for v in value
			else
				@input.setActive(value, true, true)
		return


	createInput: () ->
		return new ButtonGroup
			toggle: @toggle


	setItems: (items) ->
		@input.removeComponents()
		for name,text of items
			@input.addButton name,
				text: text
		return


	afterRenderControl: () ->
		@setItems(@items)
		@input.on 'active', ()=>
			value = []
			@input.getActiveButtons().each (btn)=> value.push(btn.name)
			@setValue(value)
		return


module.exports = ButtonGroupControl