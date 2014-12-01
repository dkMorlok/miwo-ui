class Paginator extends Miwo.Object

	base: 1
	itemsPerPage: 1
	page: null
	itemCount: null


	getFirstPage: ->
		return @base


	getLastPage: ->
		return if @itemCount is null then null else @base + Math.max(0, @getPageCount()-1)


	isFirst: ->
		return @page is 1 || @page is null


	isLast: ->
		return if @itemCount is null then true else @page is @getLastPage()


	getPageCount: ->
		return if @itemCount is null then null else Math.ceil(@itemCount / @itemsPerPage)


	setItemsPerPage: (itemsPerPage)->
		@itemsPerPage = Math.max(1, parseInt(itemsPerPage))
		@emit('itemsperpage', this, @itemsPerPage)
		return this


	setItemCount: (itemCount)->
		@itemCount = Math.max(0, parseInt(itemCount))
		@emit('itemcount', this, @itemCount)
		return this


	setPage: (page) ->
		page = parseInt(page)
		if page isnt @page
			@page = page
			@emit('page', this, @page)
		return this


module.exports = Paginator