class InlineRenderer

	options: null


	constructor: () ->
		@options = {}


	renderForm: (form) ->
		form.el.addClass('form-inline')
		return


	renderButtons: (buttons, ct) ->
		for button in buttons then button.render(ct)
		return


	renderControl: (control, ct) ->
		if !control.groupEl
			control.groupEl = control.el
			control.groupEl.inject(ct)
			control.groupEl.addClass('form-group')

		if control.isBoxControl
			control.groupEl.addClass('margin-no')

		if !control.labelRendered
			@renderLabel(control, control.groupEl)

		if !control.controlsRendered
			@renderControls(control, control.groupEl)
		else if !control.controlRendered
			@renderControl(control, control.controlsEl)
		else if !control.inputRendered
			control.getInput().replace(control.inputEl)
		return


	renderLabel: (control, ct) ->
		labelEl = control.renderLabel(ct)
		if labelEl
			labelEl.addClass('sr-only')
		return


	renderControls: (control, ct) ->
		if !control.controlsEl
			controlsEl = new Element('div')
			controlsEl.inject(ct)
			controlsEl.addClass('form-controls')
			control.controlsEl = controlsEl

		@renderControl(control, control.controlsEl)
		return


	renderControl: (control, ct) ->
		if !control.controlEl
			inputCt = new Element('div')
			inputCt.inject(ct)
			control.controlEl = inputCt

		control.renderControl(control.controlEl)
		return


module.exports = InlineRenderer