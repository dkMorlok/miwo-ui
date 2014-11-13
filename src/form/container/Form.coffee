BaseContainer = require './BaseContainer'


class Form extends BaseContainer

	xtype: 'form'
	buttonsEl: null
	record: null
	submitBtn: null
	renderer: null
	rendererType: 'horizontal'
	rendererOptions: null


	beforeInit: () ->
		super
		@form = this
		@el = 'form'
		return


	addedComponentDeep: (component) ->
		super(component)
		if component.isFormControl || component.isFormContainer
			component.form = this.form

		if component.isSubmitButton
			@mon(component, 'click', 'onSubmitButtonClick')
		else if component.isResetButton
			@mon(component, 'click', 'onResetButtonClick')
		return


	removedComponentDeep: (component) ->
		super(component)
		if component.isFormControl || component.isFormContainer
			component.form = null

		if component.isSubmitButton
			this.mun(component)
		else if component.isResetButton
			this.mun(component)
		return


	onSubmitButtonClick: (btn) ->
		@submit(btn)
		return


	onResetButtonClick: (btn) ->
		@reset()
		@emit('reset', this, btn)
		return


	loadRecord: (record) ->
		@record = record
		values = record.getValues()
		@setOriginals(values)
		@setValues(values)
		@reset()
		return


	unloadRecord: () ->
		@record = null
		@setOriginals({}, true)
		@setValues({})
		@reset()
		return


	updateRecord: (record) ->
		record = record || @record
		if !record
			throw new Error("Undefined record. First you must call 'loadRecord' or pass record in this method")

		values = @getValues(true, true) # get dirty values for model
		for name of record.fields
			if values.hasOwnProperty(name)
				record.set(name, values[name])

		return record


	editRecord: (record) ->
		record = record || @record
		if !record
			throw new Error("Undefined record. First you must call 'loadRecord' or pass record in this method")

		record.beginEdit()
		@updateRecord(record)
		record.endEdit()

		return record


	submit: (btn) ->
		@submitBtn = btn
		isValid = @validate()
		@emit('submit', this, isValid)
		@onSubmit()

		if isValid
			@emit('success', this)
			@onSuccess()
		else
			@emit('failure', this)
			@onFailure()
		return


	onSuccess: ->

	onFailure: ->

	onSubmit: ->


	renderContainer: () ->
		super
		contentEl = @getContentEl()
		@getRenderer().renderForm(this)

		# find rendered labels
		for el in @getElements("[miwo-label]")
			control = @get(el.getAttribute("miwo-label"), true)
			control.labelEl = el
			control.labelRendered = true

		# find rendered form-groups
		for el in @getElements("[miwo-group]")
			control = @get(el.getAttribute("miwo-group"), true)
			control.groupEl = el
			control.el = el
			control.parentEl = contentEl

		# find rendered input controls
		for el in @getElements("[miwo-controls]")
			control = @get(el.getAttribute("miwo-controls"), true)
			control.controlsEl = el
			@detectControlGroupEl(control, el, contentEl)

		# find rendered input control
		for el in @getElements("[miwo-control]")
			control = @get(el.getAttribute("miwo-control"), true)
			control.controlEl = el
			control.controlsRendered = true
			@detectControlGroupEl(control, el, contentEl)

		# find rendered inputs
		for el in @getElements("[miwo-input]")
			control = @get(el.getAttribute("miwo-input"), true)
			control.inputEl = el
			control.controlsRendered = true
			control.controlRendered = true
			@detectControlGroupEl(control, el, contentEl)

		# render controls and sub-containers
		controls = @findComponents(false, {isFormControl: true, isFormContainer: true})
		for control in controls
			if control.isFormControl
				@getRenderer().renderGroup(control, contentEl)
				control.groupEl.set('miwo-name', control.name)
				control.afterRender()
				control.rendered = true
			else
				control.render(contentEl)

		# render buttons
		buttons = @findComponents(false, {isButton: true})
		if buttons.length > 0
			@getRenderer().renderButtons(buttons, @getButtonsEl())
		return


	detectControlGroupEl: (control, el, contentEl) ->
		if (controlEl = el.getParent('.form-group'))
			control.el = controlEl
			control.parentEl = contentEl
			if !control.groupEl then control.groupEl = controlEl
		return


	getButtonsEl: () ->
		if !@buttonsEl
			ct = new Element 'div',
				parent: @getContentEl()
				cls: 'form-group'
			@buttonsEl = new Element 'div',
				parent: ct
			# internal property to prevent add renderer classes
			@buttonsEl.generated = true
		return @buttonsEl


	getRenderer: () ->
		if !@renderer
			@renderer = miwo.service('formRendererFactory').create(@rendererType, @rendererOptions)
		return @renderer



module.exports = Form