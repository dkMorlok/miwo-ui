class Popover extends Miwo.Object

	selector: '[data-toggle="popover"]'
	popover: @inject('popover')


	init: (body) ->
		body.on "mouseenter:relay(#{@selector})", (e, target) =>
			@popover.show(target)
			return
		return


	apply: (element) ->
		# not supported
		return


module.exports = Popover