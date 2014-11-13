class WindowManager

	list: null


	constructor: ->
		@list = new Miwo.utils.Collection()
		return


	register: (comp) ->
		comp.windowMgr.unregister(comp)  if comp.windowMgr
		comp.windowMgr = this
		@list.set(comp.id, comp)
		return


	unregister: (comp) ->
		if @list.has(comp.id)
			@list.remove(comp.id)
			delete comp.windowMgr
		return


	get: (id) ->
		return @list.get(id)


	getBy: (name, value) ->
		return @list.getBy(name, value)




module.exports = WindowManager