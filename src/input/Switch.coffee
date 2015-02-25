class SwitchInput extends Miwo.Component

	xtype: 'switchinput'
	isInput: true
	baseCls: 'switch'
	onState: 'success'
	offState: 'default'
	onText: 'ON'
	offText: 'OFF'
	value: false
	disabled: false
	readonly: false


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
		@el.removeClass('switch-on').removeClass('switch-off').addClass('switch-'+(if value then 'on' else 'off'))
		@inputEl.set('checked', value) if @rendered

		if oldValue isnt value && !silent
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
		@el.set('tabindex', 0)
		@el.set 'html', """
			<div class="switch-container">
				<span miwo-reference="switchOnEl" class="switch-item switch-item-on label label-#{@onState}">#{@onText}</span>
				<span miwo-reference="switchLabelEl" class="switch-item switch-label">&nbsp;</span>
				<span miwo-reference="switchOffEl" class="switch-item switch-item-off label label-#{@offState}">#{@offText}</span>
			</div>
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


module.exports = SwitchInput