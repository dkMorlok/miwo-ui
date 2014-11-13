exports =
	# containers
	container:
		BaseContainer: require './container/BaseContainer'
		Fieldset: require './container/Fieldset'
		Form: require './container/Form'

	# renderers
	render:
		FormRendererFactory: require './render/FormRendererFactory'
		HorizontalRenderer: require './render/HorizontalRenderer'
		InlineRenderer: require './render/InlineRenderer'

	# controls
	control:
		BaseControl: require './control/BaseControl'
		BaseTextControl: require './control/BaseTextControl'
		Checkbox: require './control/Checkbox'
		CheckboxList: require './control/CheckboxList'
		RadioList: require './control/RadioList'
		Select: require('./control/Select')
		Combo: require('./control/Combo')
		Color: require('./control/Color')
		Date: require('./control/Date')
		Number: require('./control/Number')
		Slider: require('./control/Slider')
		TextArea: require('./control/TextArea')
		ButtonGroup: require('./control/ButtonGroup')
		Button: require('./control/Buttons').ButtonControl
		SubmitButton: require('./control/Buttons').SubmitButton
		ResetButton: require('./control/Buttons').ResetButton


# register add method
BaseContainer = exports.container.BaseContainer
BaseContainer.registerControl('date', exports.control.Date)
BaseContainer.registerControl('text', exports.control.Text)
BaseContainer.registerControl('textarea', exports.control.TextArea)
BaseContainer.registerControl('color', exports.control.Color)
BaseContainer.registerControl('number', exports.control.Number)
BaseContainer.registerControl('slider', exports.control.Slider)
BaseContainer.registerControl('combo', exports.control.Combo)
BaseContainer.registerControl('select', exports.control.Select)
BaseContainer.registerControl('checkbox', exports.control.Checkbox)
BaseContainer.registerControl('checkboxList', exports.control.CheckboxList)
BaseContainer.registerControl('radioList', exports.control.RadioList)
BaseContainer.registerControl('button', exports.control.Button)
BaseContainer.registerControl('submit', exports.control.SubmitButton)
BaseContainer.registerControl('reset', exports.control.ResetButton)


module.exports = exports