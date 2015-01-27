BaseTipManager = require './BaseTipManager'
Tooltip = require './Tooltip'


class TooltipManager extends BaseTipManager


	create: (target, config={}) ->
		title = config.title or target.get("data-title") or target.get("title")
		container = config.container or target.get("data-container")
		placement = config.placement or target.get("data-placement") or @placement
		distance = config.distance or target.get("data-distance") or @distance
		delay = config.delay or target.get("data-delay") or @delay

		if !title && (selector = target.get('data-title-el')) && (item = target.getElement(selector))
			title = item.get('html')

		if !title
			return

		tooltip = new Tooltip
			target: target
			text: title
			placement: placement
			distance: distance

		return tooltip



module.exports = TooltipManager