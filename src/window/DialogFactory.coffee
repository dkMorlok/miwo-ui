Dialog = require './Dialog'
Button = require '../buttons/Button'


class DialogFactory


	createDialog: (title, message, buttons) ->
		dialog = new Dialog()
		dialog.render(miwo.body)
		dialog.setTitle(title)
		dialog.setContent("<p class='text-center'>" + message + "</p>")
		dialog.setButtons(buttons)
		dialog.show()
		return dialog


	alert: (title, message, cb, btnText) ->
		okBtn = new Button
			name: 'ok'
			type: "primary"
			text: (if btnText then btnText else miwo.tr("miwo.dialog.ok"))
			handler: ()->
				if cb then cb(true)
				dialog.close()
				return

		dialog = @createDialog(title, message, [okBtn])
		return dialog


	prompt: (title, message, cb, okBtnText, noBtnText) ->
		okBtn = new Button
			name: 'ok'
			type: "primary"
			text: (if okBtnText then okBtnText else miwo.tr("miwo.dialog.ok"))
			handler: ()->
				if cb then cb(true)
				dialog.close()
				return

		cancelBtn = new Button
			name: 'cancel'
			type: 'default'
			text: (if noBtnText then noBtnText else miwo.tr("miwo.dialog.cancel"))
			handler: ()->
				if cb then cb(false)
				dialog.close()
				return

		dialog = @createDialog(title, message, [okBtn,cancelBtn])
		return dialog


	promptIf: (title, message, cb, okBtnText, noBtnText) ->
		dialog = @prompt title, message, ((state) ->
			if cb and state then cb()
			return
		), okBtnText, noBtnText
		return dialog


module.exports = DialogFactory