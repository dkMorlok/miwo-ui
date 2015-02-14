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
			'<span class="checker">'+
				'<i miwo-reference="iconEl" class="fa"></i>'+
				'<input miwo-reference="inputEl" type="radio" id="'+@getInputId()+'" name="'+@radioName+'" value="'+@name+'" >'+
			'</span>'+
			'<span miwo-reference="textEl" class="label-text">'+@label+'</span>'+
		'</label>'
		return


	afterRender: ->
		super
		@inputEl.on 'change', =>
			if @disabled then return
			@setChecked(@isChecked())
			@emit('change', this, @name)
			return

		@inputEl.on 'focus', =>
			if @disabled then return
			@el.addClass('focus')
			@emit('focus', this)
			return

		@inputEl.on 'blur', =>
			if @disabled then return
			@el.removeClass('focus')
			@emit('blur', this)
			return

		@setDisabled(@disabled)
		@setChecked(@checked)
		return


	setChecked: (@checked) ->
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