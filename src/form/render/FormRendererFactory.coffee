class FormRendererFactory

	defines: null


	constructor: () ->
		@defines = {}


	register: (name, fn) ->
		@defines[name] = fn
		return


	create: (type, options) ->
		if !@defines[type]
			throw new Error("Required form renderer '#{type}' is not registered in FormRendererFactory")
		return new @defines[type](options)


module.exports = FormRendererFactory