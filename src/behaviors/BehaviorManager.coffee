class BehaviorManager

	behaviors: null


	constructor: ->
		@behaviors = {}


	install: (name, plugin) ->
		@behaviors[name] = plugin
		this[name] = plugin
		miwo.ready ()=> plugin.init(miwo.body)
		return


	get: (name) ->
		return @behaviors[name]


	apply: (element) ->
		# todo
		return



module.exports = BehaviorManager