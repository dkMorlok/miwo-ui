Button = require '../../buttons/Button'
Rules = require '../Rules'


class BaseControl extends Miwo.Component

	xtype: 'control'
	isFormControl: true
	label: null
	value: null
	defaultValue: undefined
	required: false
	prepend: null
	append: null
	tip: null
	help: null
	desc: null
	controlCls: null
	inputTag: "input"
	inputName: null
	inputCls: null
	inputWidth: null
	attributes: null

	# @cfg {Boolean} disabled
	# True to disable the field. Disabled Fields will not be submitted
	disabled: false

	# @cfg {Boolean} omitted
	# Setting this to false will prevent the field from being submitted even when it is not disabled.
	omitted: false

	# @cfg {Boolean} validateOnChange
	# Specifies whether this field should be validated immediately whenever a change in its value is detected.
	# If the validation results in a change in the field's validity, a {@link #validitychange} event will be fired.
	# This allows the field to show feedback about the validity of its contents immediately as the user is typing.
	# When set to false, feedback will not be immediate. However the form will still be validated before submitting if
	# the clientValidation option to is enabled, or if the field or form are validated manually.
	validateOnChange: true

	buttons: null
	rules: null
	form: null
	labelEl: null
	labelTextEl: null
	input: null
	controlsEl: null
	descEl: null
	tipEl: null
	helpEl: null
	preventRenderControl: false
	suspendCheckChange: true
	originalValue: undefined
	lastValue: undefined
	wasDirty: false
	wasValid: true
	submitValue: true


	afterInit: ->
		super()
		@errors = []
		@defaultValue = @originalValue = @lastValue = @value

		if !Type.isInstance(@rules)
			rules = Array.from(@rules)
			@rules = new Rules(this)
			@initRules()
			@rules.addRules(rules)

		if @width
			@inputWidth = @width
			@width = null

		items = @buttons
		@buttons = new Miwo.utils.Collection()
		if items then for button in items then @addButton(button.name, button)
		return


	initRules: ->
		if @required then @rules.addRule("filled")
		return


	###
		Returns the current data value of the field. The type of value returned
		is particular to the type of the particular field
		@return {Object} value The field value
	###
	getValue: ->
		return @value


	###
		Returns the current data value of the fields input.
		@return {Object} The fields input value
	###
	getRawValue: ->
		return (if @input then @input.getValue() else undefined)


	getStringValue: ->
		val = @getValue()
		return (if val isnt null and val isnt `undefined` then val.toString() else "")


	###
		Sets a data value into the field and runs the change detection and validation.
		@param {Object} value The value to set
	###
	setValue: (value) ->
		@value = value
		@checkChange()
		return this


	setOriginalValue: (value) ->
		@originalValue = value
		@checkDirty()
		return this


	setDefaultValue: (value) ->
		@defaultValue = value  if value
		@setValue(@defaultValue)
		return this


	setFocus: ->
		super()
		@emit("focus", this)
		return this


	isDisabled: ->
		return @disabled


	setDisabled: (@disabled) ->
		@input.setDisabled(@disabled)
		return this


	isFilled: ->
		return @getStringValue() isnt ""


	###
		Returns whether two field {@link #getValue values} are logically equal. Field implementations may override this
		to provide custom comparison logic appropriate for the particular field's data type.
		@param {Object} value1 The first value to compare
		@param {Object} value2 The second value to compare
		@return {Boolean} True if the values are equal, false if not equal.
	###
	isEqual: (value1, value2) ->
		return value1 is value2


	###
		Returns the parameter(s) that would be included in a standard form submit for this field. Typically this will be
		an object with a single name-value pair, the name being this field's {@link #getName name} and the value being
		its current stringified value. More advanced field implementations may return more than one name-value pair.

		Note that the values returned from this method are not guaranteed to have been successfully {@link #validate
		validated}.

		@param {Boolean} submittable Only submittable values
		@return {Object} A mapping of submit parameter names to values; each value should be a string, or an array of
		strings if that particular name has multiple values. It can also return null if there are no parameters to be
		submitted.
	###
	getData: (submittable) ->
		data = null
		if !@disabled and (!submittable or !@omitted) and !@isFileUpload
			data = {}
			data[@getName()] = "" + @getValue()
		return data


	###
		Resets the current field value to the originally loaded value and clears any validation messages.
	###
	reset: ->
		@beforeReset()
		@setValue(@originalValue)
		@clearInvalid()
		return


	beforeReset: ->
		return


	clearInvalid: ->
		delete @wasValid
		@notifyErrors = false
		@wasInputFocused = false
		@clearErrors()
		@updateErrors()
		return this


	###
		Resets the field's {@link #originalValue} property so it matches the current {@link #getValue value}.
	###
	resetOriginalValue: ->
		@originalValue = @getValue()
		@checkDirty()
		return this


	###
		Checks whether the value of the field has changed since the last time it was checked.
		If the value has changed, it:
		1. Fires the {@link #change change event},
		2. Performs validation if the {@link #validateOnChange} config is enabled, firing the validitychange event if the validity has changed, and
		3. Checks the {@link #isDirty dirty state} of the field and fires the dirtychange event if it has changed.
	###
	checkChange: ->
		if @suspendCheckChange
			return
		newVal = @getValue()
		oldVal = @lastValue
		if !@isEqual(newVal, oldVal) and !@isDestroyed
			@lastValue = newVal
			@emit("change", this, newVal, oldVal)
			@onChange(newVal, oldVal)
		return


	###
		@private
		Called when the field's value changes. Performs validation if the {@link #validateOnChange}
		config is enabled, and invokes the dirty check.
	###
	onChange: (newVal, oldVal) ->
		@validate()  if @validateOnChange
		@checkDirty()
		return


	###
		Returns true if the value of this Field has been changed from its {@link #originalValue}.
		Will always return false if the field is disabled.
	###
	isDirty: ->
		return !@disabled and !@isEqual(@getValue(), @originalValue)


	###
		Checks the isDirty state of the field and if it has changed since the last time it was checked,
		fires the dirtychange event.
	###
	checkDirty: ->
		isDirty = @isDirty()
		if isDirty isnt @wasDirty
			@emit("dirtychange", this, isDirty)
			@onDirtyChange(isDirty)
			@wasDirty = isDirty
		return


	###
		@private
		Called when the field's dirty state changes.
		@param {Boolean} isDirty
	###
	onDirtyChange: (isDirty) ->
		return


	getRules: ->
		return @rules


	###
		Returns first error
	###
	getError: ->
		return @errors[0]


	getErrors: ->
		return @errors


	hasErrors: ->
		return @errors.length > 0


	addErrors: (errors) ->
		@errors.append(errors)
		return this


	setErrors: (errors) ->
		@clearErrors()
		@addErrors(errors)
		return this


	clearErrors: ->
		@errors.empty()
		return this


	updateErrors: (silentErrors) ->
		if @input
			@input.el.removeClass('has-error')
			@input.el.addClass('has-error') if @hasErrors()

		if @el.hasClass('form-group')
			@el.removeClass('has-error')
			@el.addClass('has-error') if @hasErrors()

		if @hasErrors() && !silentErrors
			renderTo = @el.getElement('.form-controls') || @el
			@errorTip = miwo.tooltip.create(@errorTargetEl || @input.el, {type:'danger', delay:0, renderTo:renderTo})  if !@errorTip
			@errorTip.setText(@getError())
			@errorTip.show()
		else if @errorTip
			@errorTip.hide()

		@emit("errors:update", this)
		return this


	isValid: (onlyCheck) ->
		if @disabled
			return true
		if @wasValid is null || !onlyCheck
			@setErrors(@getRules().validate()) # collect all errors
		return !@hasErrors()


	###
		Returns whether or not the field value is currently valid by {@link #getErrors validating} the field's current
		value, and fires the {@link #validitychange} event if the field's validity has changed since the last validation.
		Note**: {@link #disabled} fields are always treated as valid.

		Custom implementations of this method are allowed to have side-effects such as triggering error message display.
		To validate without side-effects, use {@link #isValid}.

		@param {Boolean} [onlyCheck] Only check valid state, don't validate control
		@param {Boolean} [silentErrors] True if you don't want show error tip
		@return {Boolean} True if the value is valid, else false
	###
	validate: (onlyCheck, silentErrors) ->
		isValid = @isValid(onlyCheck)
		@updateErrors(silentErrors)
		if isValid isnt @wasValid
			@wasValid = isValid
			@emit("validitychange", this, isValid)
		return isValid


	isRequired: ->
		return @rules.hasRule("filled")


	initializeControl: ->
		@setValue(@value)  if @value isnt null
		@suspendCheckChange = false
		return


	getForm: ->
		if !@form then throw new Error("Component is not attached to Form")
		return @form


	setLabel: (@label) ->
		@labelTextEl.set('text', @label) if @labelTextEl
		return this


	getLabel: ->
		return @label


	getLabelEl: ->
		if !@labelEl
			@labelEl = new Element('label')
		return @labelEl


	getInput: ->
		if !@input
			@input = @createInput()
			if !@input then throw new Error("Input was not created in createInput() in class #{this}")
		return @input


	addButton: (name, config) ->
		button = new Button(config)
		button.getControl = => return this
		button.render(@buttonsCt)  if @buttonsCt
		button.on 'click', (btn, event) =>
			@emit('buttonclick', this, btn, event)
			return
		@buttons.set(name, button)
		return button


	addResetButton: ->
		button = @addButton 'reset',
			disabled: true
			icon: 'remove'
			handler: => @reset()
		return button


	getButton: (name) ->
		return @buttons.get(name)


	createInput: ->
		# must implement in child
		return


	doRender: ->
		@renderControl(@el)
		return


	renderLabel: (ct) ->
		labelEl = @getLabelEl()
		labelEl.inject(ct)

		@labelTextEl = new Element('span', {cls:'control-label-text', html:@getLabel()})
		@labelTextEl.inject(labelEl)

		if @isRequired()
			requiredEl = new Element('span', {cls:'control-label-required', html: '*', 'data-toggle':'tooltip', 'data-title':'Required field'})
			requiredEl.inject(labelEl)

		return labelEl


	renderControl: (ct) ->
		input = @getInput()
		if input.rendered
			return input

		if @inputWidth
			@el.addClass('input-fill')
			ct.setStyle('width', @inputWidth)

		if @controlCls
			ct.addClass(@controlCls)

		if @prepend || @append || @buttons.length>0 || @tip
			ct.addClass('input-group')
		else
			ct.addClass('input-control')

		if @prepend
			span = new Element('span', {cls:'input-group-addon', html: @prepend})
			span.inject(ct)
			span.on 'click', (e)=> @emit('prependclick', this, e)

		input.render(ct)
		input.setDisabled(@disabled)

		if @append
			span = new Element('span', {cls:'input-group-addon', html: @append})
			span.inject(ct)
			span.on 'click', (e)=> @emit('appendclick', this, e)

		if @buttons.length isnt 0
			@buttonsCt = new Element('div', {cls:'input-group-btn'})
			@buttonsCt.inject(ct)
			@buttons.each (button) => button.render(@buttonsCt)

		if @tip
			span = new Element('span', {cls:'input-group-addon input-group-addon-tooltip', html: '<span class="glyphicon glyphicon-question-sign" data-title="'+@tip+'" data-toggle="tooltip"></span>'})
			span.inject(ct)
			ct.addClass('input-tooltip')

		return input


	afterRender: ->
		super()
		@afterRenderLabel()
		@afterRenderControl()
		@initializeControl()
		return


	afterRenderLabel: ->
		if @labelEl && @input.getInputId
			@labelEl.set('for', @input.getInputId())
		return


	afterRenderControl: ->
		return


	parentShown: (parent) ->
		super(parent)
		@getInput().parentShown(parent)
		return


	doDestroy: ->
		@input.destroy() if @input
		super()
		return



module.exports = BaseControl