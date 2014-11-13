class SelectorFactory

	defines: null


	constructor: () ->
		@defines = {}


	register: (name, klass) ->
		@defines[name] = klass
		return


	create: (name, config) ->
		if !@defines[name]
			throw new Error("Selector with name #{name} is not defined")
		return new @defines[name](config)



module.exports = SelectorFactory