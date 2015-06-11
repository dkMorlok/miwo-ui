class BaseContainer extends Miwo.Container

	form: null
	notifyErrors: true
	isFormContainer: true
	disabled: false
	readonly: false
	wasDirty: false
	wasValid: true
	controls: null
	layout: 'form'


	@registerControl: (controlName, fn) ->
		if !fn then throw new Error("Error in registry control #{controlName}, constructor is undefined")
		addMethod = 'add'+controlName.capitalize()
		@prototype[addMethod] = (name, config = {}) ->
			return @add(name, new fn(config))
		return


	beforeInit: ->
		super()
		@controls = []
		return


	addedComponent: (component) ->
		super(component)
		if component.isFormControl
			component.form = this.form
			@controls.push(component)
			@mon component, 'validitychange', 'checkValidity'
			@mon component, 'dirtychange', 'checkDirty'
			@mon component, 'focus', 'onInputFieldFocus'
		else if component.isFormContainer
			component.form = this.form
			@mon component, 'inputfocus', 'onInputFieldFocus'
		if @disabled
			component.setDisabled(@disabled)
		if @readonly
			component.setReadonly(@readonly)
		return


	removedComponent: (component) ->
		super(component)
		if component.isFormControl
			component.form = null
			@controls.erase(component)
			@mun(component)
		else if component.isFormContainer
			component.form = null
			@mun(component)
		return


	setDisabled: (disabled) ->
		@disabled = disabled
		@getComponents().each (component) ->
			if component.setDisabled
				component.setDisabled(disabled)
			return
		return


	setReadonly: (readonly) ->
		@readonly = readonly
		@getComponents().each (component) ->
			if component.setReadonly
				component.setReadonly(readonly)
			return
		return


	getControls: ->
		return @controls


	getControl: (name) ->
		for control in @controls
			if control.name is name
				return control
		throw new Error("Control #{name} not found")
		return


	getFocusControl: ->
		for control in @controls
			if !control.disabled
				return control
		return null


	onInputFieldFocus: (form, input) ->
		@emit("inputfocus", this, input||form)
		return


	getValues: (dirtyOnly, submittable) ->
		values = {}
		for control in @controls
			if (!submittable or control.submitValue) and !control.disabled
				if !dirtyOnly or control.isDirty()
					values[control.getName()] = control.getValue()
		return values


	getRawValues: (dirtyOnly, submittable) ->
		values = {}
		for control in @controls
			if (!submittable or control.submitValue) and not control.disabled
				if !dirtyOnly or control.isDirty()
					values[control.getName()] = control.getRawValue()
		return values


	getOriginalValues: ->
		values = {}
		for control in @controls
			values[control.getName()] = control.getRawValue()
		return values


	getErrors: ->
		errors = []
		for control in @controls
			errors.append(control.getErrors())
		return errors


	setValues: (values, erase, setOriginals) ->
		for control in @controls
			name = control.getName()
			if values.hasOwnProperty(name)
				control.setValue(values[name])
				control.setOriginalValue(values[name]) if setOriginals
			else if erase
				control.setValue(null)
				control.setOriginalValue(null) if setOriginals
		return


	setOriginals: (values, erase) ->
		if !values
			values = @getValues()
		for control in @controls
			name = control.getName()
			if values.hasOwnProperty(name)
				control.setOriginalValue(values[name])
			else if erase
				control.setOriginalValue(null)
		return


	resetOriginals: ->
		for control in @controls
			control.resetOriginalValue()
		return


	setDefaults: (values, onlySet) ->
		for control in @controls
			name = control.getName()
			if values
				if values.hasOwnProperty(name)
					control.setDefaultValue(values[name])
				else if !onlySet
					control.setDefaultValue()
			else
				control.setDefaultValue()
		return


	reset: (resetOriginalValues) ->
		if resetOriginalValues
			@setOriginals({}, true)
		for control in @controls
			control.reset()
		return


	###
    	Returns true if client-side validation on the form is successful. Any invalid controls will be
		marked as invalid. If you only want to determine overall form validity without marking anything,
		set param onlyCheck to True
		@param {Boolean} [onlyCheck] True to ignore validation, only test validity state
		@return {Boolean}
    ###
	isValid: (onlyCheck) ->
		valid = true
		for control in @controls
			if !control.validate(onlyCheck, !(@notifyErrors && valid)) # notify only first control
				valid = false
				if onlyCheck then break
		return valid


	###
    	Returns true if client-side validation on the form is successful. Any invalid controls will be
		marked as invalid.
    	@return {Boolean}
	###
	validate: ->
		return @isValid()



	###
    	Check whether the validity of the entire form has changed since it was last checked, and
		if so fire the {@link #validitychange validitychange} event. This is automatically invoked
		when an individual control's validity changes.
    ###
	checkValidity: ->
		valid = @isValid(true)
		if valid isnt @wasValid
			@emit("validitychange", this,valid)
			@wasValid = valid
		return


	###
    	Check whether the dirty state of the entire form has changed since it was last checked, and
		if so fire the {@link #dirtychange dirtychange} event. This is automatically invoked
		when an individual control's `dirty` state changes.
    ###
	checkDirty: ->
		dirty = @isDirty()
		if dirty isnt @wasDirty
			@emit("dirtychange", this, dirty)
			@wasDirty = dirty
		return


	###
		Returns `true` if any controls in this form have changed from their original values.
		@return {Boolean}
	###
	isDirty: ->
		for control in @controls
			if control.isDirty()
				return true
		return false


module.exports = BaseContainer