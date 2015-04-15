class BehaviorManager

	behaviors: null


	constructor: ->
		@behaviors = {}


	install: (name, plugin) ->
		@behaviors[name] = plugin
		this[name] = plugin
		miwo.ready =>
			if plugin.init
				plugin.init(miwo.body)
			return
		return


	get: (name) ->
		return @behaviors[name]


	apply: (element) ->
		for name,behavior of @behaviors
			if behavior.apply
				behavior.apply(element)
		return



module.exports = BehaviorManager