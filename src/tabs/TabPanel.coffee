Pane = require '../panel/Pane'


class TabPanel extends Pane

	tab: null
	baseCls: 'tab-pane'
	visible: false
	role: 'tabpanel'


	setTitle: (@title) ->
		@tab.set('html', title) if @tab
		return


	markActive: (active) ->
		@setVisible(active)
		@el.toggleClass('active', active)
		@tab.toggleClass('active', active)
		@emit('active', this, active)
		return


	setActive: ->
		@getParent().setActive(@name)
		return



module.exports = TabPanel