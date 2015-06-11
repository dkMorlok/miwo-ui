BaseTipManager = require './BaseTipManager'
Tooltip = require './Tooltip'


class TooltipManager extends BaseTipManager


	create: (target, config = {}) ->
		config.target = target

		if !config.text
			config.text = target.get("data-title") or target.get("title")

		if !config.placement
			config.placement = target.get("data-placement") or @placement

		if !config.distance
			config.distance = target.get("data-distance") or @distance

		if !config.hasOwnProperty('delay')
			config.delay = target.get("data-delay") or @delay

		if !config.text && (selector = target.get('data-title-el')) && (item = target.getElement(selector))
			config.text = item.get('html')

		tooltip = new Tooltip(config)
		return tooltip



module.exports = TooltipManager