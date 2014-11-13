class Popover extends Miwo.Object

	@inject: ['popover']

	selector: '[data-toggle="popover"]'
	popover: null


	init: (body) ->
		body.on "mouseenter:relay(#{@selector})", (e, target) =>
			@popover.show(target)
			return
		return


	apply: (element) ->
		# not supported
		return


module.exports = Popover