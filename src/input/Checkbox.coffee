class Checkbox extends Miwo.Component

	isInput: true
	xtype: 'checkbox'
	label: ''
	disabled: false
	checked: false

	inputEl: null
	iconEl: null
	labelEl: null
	textEl: null


	doRender: ->
		@el.addClass('checkbox')
		@el.set 'html',
		'<label miwo-reference="labelEl" for="'+@getInputId()+'">'+
			'<span class="checker">'+
				'<i miwo-reference="iconEl" class="fa"></i>'+
				'<input miwo-reference="inputEl" type="checkbox" id="'+@getInputId()+'">'+
			'</span>'+
			'<span miwo-reference="textEl" class="label-text">'+@label+'</span>'+
		'</label>'
		return


	afterRender: ->
		super
		@inputEl.on 'change', ()=>
			if @disabled then return
			@setChecked(this.getValue())
			@emit('change', this, this.getValue())
			return

		@inputEl.on 'focus', ()=>
			if @disabled then return
			@el.addClass('focus')
			@emit('focus', this)
			return

		@inputEl.on 'blur', ()=>
			if @disabled then return
			@el.removeClass('focus')
			@emit('blur', this)
			return

		@setChecked(@checked)
		return


	setChecked: (@checked) ->
		if !@rendered then return
		@el.toggleClass('checked', checked)
		@inputEl.set('checked', checked)
		@iconEl.removeClass('fa-check-square-o').removeClass('fa-square-o')
		@iconEl.addClass(if checked then 'fa-check-square-o' else 'fa-square-o')
		return


	isChecked: () ->
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



module.exports = Checkbox