class PagerInfo extends Miwo.Component

	xtype: 'pagerinfo'
	el: 'p'
	baseCls: 'pager-info'


	setStore: (store) ->
		@store = store

		@mon store, 'load', =>
			@redraw() if @rendered
			return

		@redraw() if @rendered && store.loaded
		return


	doRender: ->
		store = @store
		from = (store.page-1) * store.pageSize
		to = Math.min(store.totalCount, from + store.pageSize)
		@el.set 'html', miwo.tr('miwo.pagination.pageInfo').substitute
			visible: from + ' - ' + to
			total: store.totalCount
		return


module.exports = PagerInfo