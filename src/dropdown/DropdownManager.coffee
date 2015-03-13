class DropdownManager extends Miwo.Object

	active: null


	constructor: ->
		super
		document.on('mousedown', @bound('onBodyClick'))
		document.on('keyup', @bound('onBodyKeyup'))
		return


	register: (component) ->
		@mon(component, 'show', 'onShow')
		@mon(component, 'hide', 'onHide')
		return


	unregister: (component) ->
		@mun(component, 'show', 'onShow')
		@mun(component, 'hide', 'onHide')
		return


	onShow: (component) ->
		@active.hide() if @active
		@active = component
		return


	onHide: (component) ->
		@active = null
		return


	onBodyClick: (e) ->
		if @active
			dropdown = e.target.getParent('#'+@active.id)
			if !dropdown then @active.hide()
		return


	onBodyKeyup: (e) ->
		if @active && e.key is 'esc'
			e.stop()
			@active.hide()
		return


module.exports = DropdownManager