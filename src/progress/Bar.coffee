class Bar extends Miwo.Component

	value: 50
	minWidth: null
	desc: ''
	type: null
	hideValue: false
	striped: false
	active: false
	baseCls: 'progress-bar'
	role: 'progressbar'

	progressEl: null
	statusEl: null
	valueEl: null
	descEl: null


	setValue: (@value) ->
		@emit('change', this, value)
		if !@rendered then return
		@el.setStyle('width', value+'%')
		@el.set('aria-valuenow', value)
		@valueEl.set('text', value+'%')
		return


	setDescription: (@desc) ->
		if !@rendered then return
		@descEl.set('html', desc)
		return


	setType: (type) ->
		@el.removeClass('progress-bar-'+@type) if @type
		@el.addClass('progress-bar-'+type) if type
		@type = type
		@emit('type', this, type)
		return


	setActive: (active = true) ->
		@active = active
		@emit('active', this, active)
		if !@rendered then return
		@progressEl.toggleClass('progress-bar-active', active)
		return


	setHideValue: (@hideValue) ->
		if !@rendered then return
		@valueEl.setVisible(!@hideValue)
		return


	getValue: ->
		return @value


	doRender: ->
		@el.set 'html',
		'<span miwo-reference="labelEl" class="progress-bar-label">'+
			'<span miwo-reference="valueEl" class="progress-bar-value">'+@value+'%</span> '+
			'<span miwo-reference="descEl" class="progress-bar-desc">'+@desc+'</span>'+
		'</span>'
		return


	afterRender: ->
		super
		@valueEl.setVisible(!@hideValue)
		@el.addClass('progress-bar-'+@type) if @type
		@el.addClass('progress-bar-striped') if @striped
		@el.addClass('active') if @active
		@el.setStyle('min-width', @minWidth+'em') if @minWidth
		@el.setStyle('width', @value+'%')
		@el.set('aria-valuenow', @value)
		@el.set('aria-valuemin', 0)
		@el.set('aria-valuemax', 100)
		return


module.exports = Bar