class ScreenMask


	constructor: (handler) ->
		@el = new Element('div', {cls: 'screen-mask'})
		@el.on 'click', (event) =>
			event.stop()
			handler()
			return
		return


	show: ->
		@el.inject(miwo.body)
		return


	hide: ->
		@el.dispose()
		return


	destroy: ->
		@hide()
		@el.destroy()
		return


module.exports = ScreenMask