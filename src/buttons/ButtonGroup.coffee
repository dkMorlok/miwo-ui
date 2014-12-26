Button = require './Button'
DropdownButton = require './DropdownButton'



class ButtonGroup extends Miwo.Container

	xtype: "buttongroup"
	toggle: null # checkbox, radio
	size: null
	label: null
	role: 'group'


	beforeInit: ->
		super()
		@layout = "auto"
		@baseCls = "btn-group"
		return


	validateChildComponent: (component) ->
		if !component.isButton
			throw new Error("Child component must by instance of Miwo.button.Button")
		return


	addedComponent: (component) ->
		component.setToggled(!!@toggle)
		@mon(component, "active", "onButtonActive")
		return


	removedComponent: (component) ->
		@mun(component)
		return


	onButtonActive: (btn) ->
		if @toggle is "radio"
			@getActiveButtons().each (pbtn) ->
				pbtn.setActive(false, true)  if pbtn isnt btn
				return
		@emit('active', this, btn)
		return


	setDisabled: (disabled, silent) ->
		@getComponents().each (component) ->
			component.setDisabled(disabled, silent)
			return
		return


	setActive: (name, active, silent) ->
		@get(name).setActive(active, silent)
		return


	setActiveAll: (active) ->
		@getComponents().each (component) ->
			component.setActive(active, true)
			return
		return


	getActiveButtons: ->
		active = []
		@getComponents().each (component) ->
			active.push(component)  if component.isActive()
			return
		return active


	getActiveButton: ->
		active = null
		@getComponents().each (component) ->
			if component.isActive()
				active = component
				return false
		return active


	addButton: (name, config) ->
		return @add(name, new Button(config))


	addDropdownButton: (name, config) ->
		return @add(name, new DropdownButton(config))


	afterRender: ->
		super
		@el.set('aria-label', @label) if @label
		@el.addClass('btn-group-'+@size) if @size
		return


module.exports = ButtonGroup