class DefaultRenderer extends Miwo.Object

	formCls: 'horizontal'
	baseColSize: 8


	renderForm: (form) ->
		if @formCls
			form.el.addClass('form-'+@formCls)
		if form.preventAutoLogin
			username = new Element('input', {name:'_username', styles:{display:'none'}})
			username.inject(form.el)
			username = new Element('input', {name:'_password', type:'password', styles:{display:'none'}})
			username.inject(form.el)
		return


	renderButtons: (buttons, ct) ->
		ct.addClass('form-actions')
		if ct.generated && @baseColSize
			ct.addClass("col-sm-offset-#{12-@baseColSize}")
			ct.addClass("col-sm-#{@baseColSize}")
		for button in buttons
			button.render(ct)
		return


	renderGroup: (control, ct) ->
		if !control.groupEl
			control.groupEl = control.el
			control.groupEl.inject(ct)
			control.groupEl.addClass('form-group')

		if !control.visible
			control.groupEl.setVisible(false)

		control.el = control.groupEl

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
			labelEl.addClass('control-label')
			if @baseColSize
				labelEl.addClass('col-sm-'+(12-@baseColSize))
		return


	renderControls: (control, ct) ->
		if !control.controlsEl
			controlsEl = new Element('div')
			controlsEl.inject(ct)
			controlsEl.addClass('form-controls')
			if @baseColSize
				controlsEl.addClass('col-sm-'+@baseColSize)
			control.controlsEl = controlsEl
		controlsEl = control.controlsEl

		# label was not rendered
		if !controlsEl.getPrevious('.control-label') && @baseColSize
			controlsEl.addClass('col-sm-offset-'+(12-@baseColSize))

		if control.help
			helpEl = new Element "span",
				parent: controlsEl
				cls: "help-block"
				html: control.help
			control.helpEl = helpEl

		@renderControl(control, controlsEl)

		if control.desc
			descEl = new Element "div",
				parent: controlsEl
				cls: "help-block"
				html: control.desc
			control.descEl = descEl
		return


	renderControl: (control, ct) ->
		if !control.controlEl
			inputCt = new Element('div')
			inputCt.inject(ct)
			control.controlEl = inputCt

		control.renderControl(control.controlEl)
		return


module.exports = DefaultRenderer