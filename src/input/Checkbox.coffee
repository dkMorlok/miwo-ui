BaseInput = require './BaseInput'


class Checkbox extends BaseInput

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
		super()
		@inputEl.on 'change', =>
			if @disabled then return
			@setChecked(@isChecked())
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
				@toggle()
			return

		@inputEl.on 'blur', =>
			if @disabled then return
			@blur()
			return

		@focusEl = @checkerEl
		@setChecked(@checked, true)
		return


	blur: ->
		super()
		@el.removeClass('focus')
		return


	setChecked: (@checked, silent) ->
		@el.toggleClass('checked', @checked)
		@inputEl.set('checked', @checked)
		@updateIconCls()
		@emit('change', this, @checked) if !silent
		return


	isChecked: ->
		return @inputEl.get('checked')


	toggle: (silent) ->
		@setChecked(!@isChecked())
		@emit('change', this, @isChecked()) if !silent
		return


	setDisabled: (@disabled) ->
		@el.toggleClass('disabled', @disabled)
		@inputEl.set('disabled', @disabled)
		@checkerEl.set('tabindex', -@disabled)
		@updateIconCls()
		return


	updateIconCls: ->
		@iconEl.removeClass('fa-check-square-o').removeClass('fa-square-o').removeClass('fa-check-square').removeClass('fa-square')
		if @disabled
			@iconEl.addClass(if @checked then 'fa-check-square' else 'fa-square')
		else
			@iconEl.addClass(if @checked then 'fa-check-square-o' else 'fa-square-o')
		return


	setLabel: (label) ->
		@textEl.set('text', label)
		return


	setValue: (checked, silent) ->
		@setChecked(!!checked, silent)
		return


	getValue: ->
		return @isChecked()


module.exports = Checkbox