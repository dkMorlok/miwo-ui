BaseInputControl = require './BaseInputControl'
TextInput = require '../../input/Text'


class BaseTextControl extends BaseInputControl

	placeholder: null
	minLength: null
	maxLength: null
	length: null
	autocomplete: null
	pattern: null
	readonly: null
	notifyInputChange: false
	setValueInputChange: true
	validateOnKeyUp: false
	resetFormOnEsc: false
	value: ''
	type: null
	inputCls: null
	editable: true


	initRules: ->
		super()
		@rules.addRule("minLength", null, @minLength)  if @minLength
		@rules.addRule("maxLength", null, @maxLength)  if @maxLength
		@rules.addRule("length", null, @length)  if @length
		return


	createInput: ->
		return new TextInput
			id: @id+'Input'
			type: @type || 'text'
			name: 'input'
			cls: @inputCls
			inputName: @name
			autocomplete: @autocomplete
			placeholder: @placeholder
			readonly: @readonly
			disabled: @disabled


	afterRenderControl: ->
		super()
		inputEl = @input.getInputEl()
		inputEl.set("minlength", @minLength) if @minLength isnt null
		inputEl.set("maxlength", @maxLength) if @maxLength isnt null
		inputEl.set("required", true) if @isRequired()

		@mon(inputEl, 'keydown', 'onInputKeydown')
		@mon(inputEl, 'keyup', 'onInputKeyup')
		@mon(inputEl, 'change', 'onInputChange')
		@mon(inputEl, 'focus', 'onInputFocus')
		@mon(inputEl, 'blur', 'onInputBlur')

		@focusEl = inputEl
		return


	onInputChange: ->
		@setValue(@getRawValue(), true)  if @setValueInputChange
		@emit("inputchange", this, @getRawValue())  if @notifyInputChange
		return


	onInputKeydown: (e) ->
		if !@editable
			e.preventDefault() if e.key.length is 1
			return
		if e.key.length is 1
			@onKeydown(this, e.key, e)
			@emit("keydown", this, e.key, e)
			if @pattern and !@pattern.test(e.key) then e.stop()
		else
			if @resetFormOnEsc && e.key is 'esc' then @getForm().reset()
			@onSpecialkey(this, e.key, e)
			@emit("specialkey", this, e.key, e)
		return


	onInputKeyup: (e) ->
		@notifyErrors = true # after any keyup enable error notification
		@emit("inputchange", this, @getRawValue())

		if e.key.length is 1
			@onKeyup(this, e.key, e)
			@emit("keyup", this,e.key,e)
			e.stop() # captured by control, dont propagate up
		else
			@onSpecialkeyup(this, e.key, e)
			@emit("specialkeyup", this, e.key, e)

		# change value after every keydown if control has errors
		if @hasErrors()
			@validateOnKeyUp = true
			@setValue(@getRawValue(), true)

		# if error ocourse, validate always if key up
		if @validateOnKeyUp
			@setValue(@getRawValue(), true)
			@validate()
		return


	onSpecialkey: (control, key, e) ->
		return


	onKeydown: (control, key, e) ->
		return


	onSpecialkeyup: (control, key, e) ->
		return


	onKeyup: (control, key, e) ->
		return


module.exports = BaseTextControl