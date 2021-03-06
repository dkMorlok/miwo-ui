class Tooltip extends Miwo.Object

	selector: '[data-toggle="tooltip"]'
	tooltip: @inject('tooltip')


	init: (body) ->
		body.on "mouseenter:relay(#{@selector})", (e, target) =>
			@tooltip.show(target)
			return
		return


module.exports = Tooltip