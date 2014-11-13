Window = require './Window'


class Dialog extends Window

	xtype: 'dialog'


	beforeInit: () ->
		super()
		@closeOnClickOut = true
		@closeMode = "close"
		@componentCls = "miwo-dialog"
		return


	afterRender: ->
		super()
		@keyListener.on 'enter', () =>
			for button in @buttons
				if button.type is 'primary'
					button.click()
					break
			return
		return


module.exports = Dialog