UtilPaginator = require '../utils/Paginator'


class Paginator extends Miwo.Component

	nestedCount: 2
	remoteCount: 2
	size: null
	el: 'nav'
	paginator: null


	doInit: ->
		super
		@paginator = new UtilPaginator()
		@paginator.on 'page', =>
			if !@rendered then return
			@renderPages()
			return
		return


	setStore: (@store) ->
		@mon store, 'beforeload', ()=>
			@setDisabled(true)
			return

		@mon store, 'load', ()=>
			@setDisabled(false)
			@syncPaginator()
			return

		if store.loading
			@setDisabled(true)
		else if store.loaded
			@syncPaginator()
		return


	syncPaginator: ->
		@paginator.setItemsPerPage(@store.pageSize)
		@paginator.setItemCount(@store.totalCount)
		@paginator.setPage(@store.page)
		@redraw()
		return


	doRender: ->
		@el.empty()
		if @paginator.itemCount is null then return
		if @paginator.getPageCount() < 2 then return

		min = Math.max(@paginator.getFirstPage(), @page-@nestedCount)
		max = Math.min(@paginator.getLastPage(), @page+@nestedCount)
		steps = [min..max]
		quotient = (@paginator.getPageCount() - 1)/@remoteCount
		for i in [0..@remoteCount] then steps.include(Math.round(quotient*i)+@paginator.getFirstPage())
		steps.sort (a,b)->a-b

		ul = new Element('ul', {cls:'pagination'}).inject(@el)
		ul.addClass('pagination-'+@size) if @size

		text = '<span class="sr-only">'+miwo.tr('miwo.nav.prev')+'</span><span aria-hidden="true">&laquo;</span>'
		li = new Element('li').inject(ul)
		a = new Element('a', {html:text, href:'#', 'data-page':1, role:'button'}).inject(li)
		if @paginator.isFirst() then li.addClass('disabled')

		for step in steps
			li = new Element('li').inject(ul)
			li.addClass('active')  if step is @page
			text = '<span>'+step+'</span>'
			text = step+'<span class="sr-only">('+miwo.tr('miwo.nav.current')+')</span>' if step is @page
			a = new Element('a', {html:text, href:'#', 'data-page':step, role:'button'}).inject(li)

		text = '<span aria-hidden="true">&raquo;</span><span class="sr-only">'+miwo.tr('miwo.nav.next')+'</span>'
		li = new Element('li').inject(ul)
		a = new Element('a', {html:text, href:'#', 'data-page':@paginator.getLastPage(), role:'button'}).inject(li)
		if @paginator.isLast() then li.addClass('disabled')
		return


	afterRender: ->
		super
		@mon(@el, 'click:relay(a)', 'onClick')
		return


	onClick: (event, el) ->
		event.preventDefault()
		if @disabled then return
		if el.getParent('li').hasClass('disabled') then return
		page = parseInt(el.get('data-page'))
		@emit('page', this, page)
		if @store then @store.loadPage(page)
		return


module.exports = Paginator