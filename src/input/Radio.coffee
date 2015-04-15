class Radio extends Miwo.Component

	xtype: 'radioinput'
	isInput: true

	checked: false
	disabled: false
	inputEl: null
	iconEl: null
	labelEl: null
	radioName: null


	doRender: ->
		@el.addClass('radio')
		@el.set 'html',
		'<label miwo-reference="labelEl" for="'+@getInputId()+'">'+
			'<span miwo-reference="checkerEl" class="checker" tabindex="0">'+
				'<i miwo-reference="iconEl" class="fa"></i>'+
				'<input miwo-reference="inputEl" type="radio" id="'+@getInputId()+'" name="'+@radioName+'" value="'+@name+'" tabindex="-1" >'+
			'</span>'+
			'<span miwo-reference="textEl" class="label-text">'+@label+'</span>'+
		'</label>'
		return


	afterRender: ->
		super
		@inputEl.on 'change', =>
			if @disabled then return
			@setChecked(@isChecked())
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
			if e.key is 'space'
				e.stop()
				@setChecked(!@isChecked())
			return

		@inputEl.on 'blur', =>
			if @disabled then return
			@emit('blur', this)
			return

		@focusEl = @checkerEl
		@setDisabled(@disabled)
		@setChecked(@checked)
		return


	setChecked: (checked, silent) ->
		checkedOld = @checked
		@checked = checked
		@emit('change', this, @name) if !silent && checkedOld isnt checked
		if !@rendered then return
		@el.toggleClass('checked', checked)
		@inputEl.set('checked', checked)
		@iconEl.removeClass('fa-dot-circle-o').removeClass('fa-circle-o')
		@iconEl.addClass(if checked then 'fa-dot-circle-o' else 'fa-circle-o')
		return this


	isChecked: ->
		return if @rendered then @inputEl.get('checked') else @checked


	setDisabled: (@disabled) ->
		if !@rendered then return
		@el.toggleClass('disabled', disabled)
		@inputEl.set('disabled', disabled)
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


module.exports = Radio