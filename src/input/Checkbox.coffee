class Checkbox extends Miwo.Component

	isInput: true
	xtype: 'checkboxinput'
	baseCls: 'checkbox'
	label: ''
	disabled: false
	checked: false

	inputEl: null
	iconEl: null
	checkerEl: null
	labelEl: null
	textEl: null


	doRender: ->
		@el.set 'html', """
		<label miwo-reference="labelEl" for='#{@getInputId()}'>
			<span miwo-reference="checkerEl" class="checker" tabindex="0">
				<i miwo-reference="iconEl" class="fa"></i>
				<input miwo-reference="inputEl" type="checkbox" id='#{@getInputId()}' tabindex="-1">
			</span>
			<span miwo-reference="textEl" class="label-text">#{@label}</span>
		</label>"""
		return


	afterRender: ->
		super
		@inputEl.on 'change', =>
			if @disabled then return
			@setChecked(this.getValue())
			@emit('change', this, this.getValue())
			@setFocus()
			return

		@inputEl.on 'focus', =>
			if @disabled then return
			@setFocus()
			return

		@checkerEl.on 'focus', =>
			if @disabled then return
			@setFocus()
			return

		@checkerEl.on 'keydown', (e) =>
			if @disabled then return
			if e.key is 'space' or e.key is 'enter'
				e.stop()
				@setChecked(!@checked)
			return

		@inputEl.on 'blur', =>
			if @disabled then return
			@el.removeClass('focus')
			@emit('blur', this)
			return

		@focusEl = @checkerEl
		@setChecked(@checked)
		return


	setChecked: (@checked) ->
		if !@rendered then return
		@el.toggleClass('checked', checked)
		@inputEl.set('checked', checked)
		@iconEl.removeClass('fa-check-square-o').removeClass('fa-square-o')
		@iconEl.addClass(if checked then 'fa-check-square-o' else 'fa-square-o')
		return


	isChecked: ->
		return if @rendered then @inputEl.get('checked') else @checked


	setDisabled: (@disabled) ->
		if !@rendered then return
		@el.toggleClass('disabled', @disabled)
		@inputEl.set('disabled', @disabled)
		@checkerEl.set('tabindex', -@disabled)
		return


	setLabel: (@label) ->
		if !@rendered then return
		@textEl.set('text', label)
		return


	setValue: (checked) ->
		@setChecked(checked)
		return


	getValue: ->
		return @isChecked()


	getInputEl: ->
		return @inputEl


	getInputId: ->
		return @id+'-input'



module.exports = Checkbox