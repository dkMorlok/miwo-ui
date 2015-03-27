Paginator = require '../utils/Paginator'


class Pager extends Miwo.Component

	el: 'nav'
	paginator: null
	navigate: false


	doInit: ->
		super
		@paginator = new Paginator()
		@paginator.on 'page', =>
			if !@rendered then return
			@prevEl.toggleClass('disabled', @paginator.isFirst())
			@nextEl.toggleClass('disabled', @paginator.isLast())
			return
		return


	setStore: (store) ->
		@store = store
		@mon store, 'beforeload', =>
			@setDisabled(true)
			return

		@mon store, 'load', =>
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
		return


	doRender: ->
		ul = new Element('ul', {cls:'pager'}).inject(@el)

		text = '<span>'+miwo.tr('miwo.nav.prev')+'</span>'
		text = '<span aria-hidden="true">&larr;</span> '+text if @navigate
		li = new Element('li').inject(ul)
		li.toggleClass('disabled', @paginator.isFirst())
		li.addClass('previous') if @navigate
		a = new Element('a', {html:text, href:'#', 'data-page':'prev', role:'button'}).inject(li)
		@prevEl = li

		text = '<span>'+miwo.tr('miwo.nav.next')+'</span>'
		text = text+' <span aria-hidden="true">&rarr;</span>' if @navigate
		li = new Element('li').inject(ul)
		li.setStyle('padding-left', '10px')
		li.toggleClass('disabled', @paginator.isLast())
		li.addClass('next') if @navigate
		a = new Element('a', {html:text, href:'#', 'data-page':'next', role:'button'}).inject(li)
		@nextEl = li
		return


	afterRender: ->
		super
		@mon(@el, 'click:relay(a)', 'onClick')
		return


	onClick: (event, el)->
		event.preventDefault()
		if @disabled then return
		page = el.get('data-page')
		@emit('page', this, page)
		if @store then @store.loadNestedPage(page)
		return


	doDestroy: ->
		@paginator.destroy()
		super



module.exports = Pager