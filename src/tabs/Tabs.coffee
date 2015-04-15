TabPanel = require './TabPanel'


class Tabs extends Miwo.Container

	xtype: 'tabs'
	align: 'vertical'
	active: null
	tabsEl: null
	scrollable: false


	doInit: ->
		super()
		if @align is 'vertical'
			@html =
			'<ul miwo-reference="tabsEl" class="nav nav-tabs" role="tablist"></ul>'+
			'<div miwo-reference="contentEl" class="tab-content"></div>'
		else if @align is 'horizontal'
			@html =
			'<div class="row">'+
				'<div class="col-sm-3">'+
					'<ul miwo-reference="tabsEl" class="nav nav-tabs" role="tablist"></ul>'+
				'</div>'+
				'<div class="col-sm-9">'+
					'<div miwo-reference="contentEl" class="tab-content"></div>'+
				'</div>'+
			'</div>'
		return


	setActive: (name) ->
		if !name && @firstChild()
			name = @firstChild().name

		previous = if Type.isString(@active) then null else @active
		next = if name then @get(name) else null

		if previous isnt next
			previous.markActive(false) if previous
			next.markActive(true) if next
			@emit('active', this, next, previous)
			@active = next
		return


	getActive: ->
		return @active


	addPanel: (name, config) ->
		return @add(name, new TabPanel(config))


	addedComponent: (component) ->
		if !component.scrollable && @scrollable
			component.setScrollable(true)
		return


	doRender: ->
		super
		@el.addClass('tabs-'+@align)
		return


	afterRender: ->
		super
		@setActive(@active)
		@mon(@el, 'click:relay(.nav a)', 'onTabClick')
		@tabsEl.set('role','tablist')
		return


	renderComponent: (component) ->
		super(component)
		component.tab.inject(@tabsEl)
		return


	removedComponent: (component) ->
		@setActive()  if @active is component.name
		return


	onTabClick: (event, target) ->
		event.stop()
		@setActive(target.get('href').replace('#', ''))
		return


module.exports = Tabs