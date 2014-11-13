BaseTipManager = require './BaseTipManager'
Popover = require './Popover'


class PopoverManager extends BaseTipManager

	selector: '[data-toggle="popover"]'


	create: (target, config={}) ->
		if !target
			throw new Error("Target is not defined")

		title = config.title or target.get("data-title") or target.get("title")
		content = config.content or target.get("data-content") or ''
		container = config.container or target.get("data-container")
		placement = config.placement or target.get("data-placement") or @placement
		distance = config.distance or target.get("data-distance") or @distance
		delay = config.delay or target.get("data-delay") or @delay
		if !title then return

		popover = new Popover
			target: target
			title: title
			content: content
			container: container
			placement: placement
			distance: distance

		return popover



module.exports = PopoverManager