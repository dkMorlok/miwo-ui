Pane = require '../panel/Pane'


class TabPanel extends Pane

	tab: null
	baseCls: 'tab-pane'
	visible: false
	role: 'tabpanel'


	doInit: ->
		super()
		@tab = new Element('li', {role: 'presentation'})
		return


	doRender: ->
		super()
		link = new Element('a', {'aria-controls': @id, href:'#'+@name, role:'tab', html:@title})
		link.inject(@tab)
		return


	setTitle: (@title) ->
		@tab.set('html', title)
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


	doDestroy: ->
		@tab.destroy()
		super()



module.exports = TabPanel