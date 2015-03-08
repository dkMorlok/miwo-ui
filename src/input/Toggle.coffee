class ToggleInput extends Miwo.Component

	xtype: 'toggleinput'
	isInput: true
	baseCls: 'toggle'
	onState: 'success'
	offState: 'default'
	onText: 'ON'
	offText: 'OFF'
	value: false
	disabled: false
	readonly: false
	size: 'md'


	beforeInit: ->
		super
		@onText = miwo.tr('miwo.inputs.switchOn')
		@offText = miwo.tr('miwo.inputs.switchOff')
		return


	toggle: ->
		@setValue(!@getValue())
		return


	setValue: (value, silent) ->
		if !silent
			@preventChange = false
			@emit('beforechange', this)
			if @preventChange then return

		oldValue = @value
		@value = value

		if @rendered
			@inputEl.set('checked', value)
			@textEl.set('html', if value then @onText else @offText)
			@el.toggleClass('toggle-on', value)
			.toggleClass('toggle-off', !value)
			.toggleClass('toggle-'+@onState, value)
			.toggleClass('toggle-'+@offState, !value)

		if !silent && oldValue isnt value
			@emit('change', this, value)
		return


	getValue: ->
		return if @rendered then @inputEl.get('checked') else @value


	setDisabled: (@disabled) ->
		if !@rendered then return
		@el.toggleClass('disabled', @disabled)
		@el.set('tabindex', -@disabled)
		@inputEl.set('disabled', @disabled)
		return


	setReadonly: (@readonly) ->
		if !@readonly then return
		@el.toggleClass('readonly', @readonly)
		return


	getInputEl: ->
		return @inputEl


	getInputId: ->
		return @id+'-input'


	doRender: ->
		@el.addClass('input-'+@size)
		@el.addClass('form-control')
		@el.set('tabindex', 0)
		@el.set 'html', """
			<div miwo-reference="textEl" class='toggle-text'></div>
			<div miwo-reference="handleEl" class='toggle-handle'></div>
			<input id="#{@getInputId()}" type="checkbox" tabindex="-1" miwo-reference="inputEl" class='screen-off'>
		"""
		return


	afterRender:  ->
		super
		@el.on 'click', (e)=>
			e.stop()
			if @disabled then return
			@toggle()
			return

		@el.on 'keydown', (e)=>
			if @disabled then return
			if e.key is 'left' || e.key is 'right' || e.key is 'space'
				e.stop()
				if e.key is 'left' then @setValue(false)
				if e.key is 'right' then @setValue(true)
				if e.key is 'space' then @toggle()
			return

		@inputEl.on 'focus', =>
			if @disabled then return
			@setFocus()
			return

		@setValue(@value, true)
		@setDisabled(@disabled)
		@setReadonly(@readonly)
		return


module.exports = ToggleInput