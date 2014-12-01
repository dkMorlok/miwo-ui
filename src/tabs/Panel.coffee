class Panel extends Miwo.Container

	tab: null
	baseCls: 'tab-pane'
	visible: false


	setTitle: (@title) ->
		@tab.set('html', title) if @tab
		return


	markActive: (active) ->
		@setVisible(active)
		@el.toggleClass('active', active)
		@tab.toggleClass('active', active)
		return


	setActive: ->
		@getParent().setActive(@name)
		return


	afterRender: ->
		super
		@el.set('role', 'tabpanel')
		return


module.exports = Panel