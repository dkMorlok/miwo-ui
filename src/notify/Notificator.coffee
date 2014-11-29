Notification = window.Notification


class Notificator extends Miwo.Object

	notification: null


	initialize: (config) ->
		super(config)
		window.on "beforeunload", ()=>
			@notification.close()  if @notification
			return
		return


	requestPermission: () ->
		if Notification && Notification.permission is 'default'
			Notification.requestPermission();
		return


	notify: (config) ->
		if !Notification or Notification.permission isnt "granted"
			return null

		notification = new Notification config.title,
			body: config.message
			icon: config.icon

		notification.handler = config.callback

		notification.onclick = ()=>
			config.callback()  if config.callback
			notification.close()
			return

		notification.onshow = ()=>
			if @notification is notification
				@notification.close()
			@notification = notification
			return

		notification.onclose = ()=>
			if @notification is notification
				delete @notification
			return

		if config.timeout
			setTimeout ()=>
				notification.close()
				return
			, @timeout

		@notification = notification
		return notification



module.exports = Notificator