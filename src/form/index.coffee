exports =
	# containers
	container:
		BaseContainer: require './container/BaseContainer'
		Fieldset: require './container/Fieldset'
		Form: require './container/Form'

	# renderer
	render:
		FormRendererFactory: require './render/FormRendererFactory'
		DefaultRenderer: require './render/DefaultRenderer'
		InlineRenderer: require './render/InlineRenderer'

	# controls
	control:
		BaseControl: require './control/BaseControl'
		BaseInputControl: require './control/BaseInputControl'
		BaseTextControl: require './control/BaseTextControl'
		Checkbox: require './control/Checkbox'
		CheckboxList: require './control/CheckboxList'
		RadioList: require './control/RadioList'
		Select: require('./control/Select')
		Combo: require('./control/Combo')
		Color: require('./control/Color')
		Date: require('./control/Date')
		DateRange: require('./control/DateRange')
		Number: require('./control/Number')
		Slider: require('./control/Slider')
		Text: require('./control/Text')
		TextArea: require('./control/TextArea')
		Toggle: require('./control/Toggle')
		DropSelect: require('./control/DropSelect')
		ButtonGroup: require('./control/ButtonGroup')
		Button: require('./control/Buttons').ButtonControl
		SubmitButton: require('./control/Buttons').SubmitButton
		ResetButton: require('./control/Buttons').ResetButton


# register add method
BaseContainer = exports.container.BaseContainer
BaseContainer.registerControl('container', BaseContainer)
BaseContainer.registerControl('date', exports.control.Date)
BaseContainer.registerControl('dateRange', exports.control.DateRange)
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
BaseContainer.registerControl('toggle', exports.control.Toggle)
BaseContainer.registerControl('dropSelect', exports.control.DropSelect)
BaseContainer.registerControl('buttonGroup', exports.control.ButtonGroup)
BaseContainer.registerControl('button', exports.control.Button)
BaseContainer.registerControl('submit', exports.control.SubmitButton)
BaseContainer.registerControl('reset', exports.control.ResetButton)

module.exports = exports