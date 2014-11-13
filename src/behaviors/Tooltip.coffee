class Tooltip extends Miwo.Object

	@inject: ['tooltip']

	selector: '[data-toggle="tooltip"]'
	tooltip: null


	init: (body) ->
		body.on "mouseenter:relay(#{@selector})", (e, target) =>
			@tooltip.show(target)
			return
		return


	apply: (element) ->
		# not supported
		return


module.exports = Tooltip