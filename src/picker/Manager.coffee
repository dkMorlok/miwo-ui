Popover = require '../tip/Popover'
ColorPicker = require './Color'
DatePicker = require './Date'


class PickerManager


	createPopoverPicker: (type, config) ->
		factory = 'create'+type.capitalize()+'Picker'
		if !this[factory]
			throw new Error("Undefined factory function for '#{type}' picker")
		return this[factory](config)


	createColorPicker: (config) ->
		popover = new Popover
			target: config.target
			closeMode: config.closeMode || 'close'
			title: miwo.tr('miwo.pickers.selectColor')
			styles: {maxWidth: 500}
		popover.add('picker', new ColorPicker(config))
		return popover


	createDatePicker: (config) ->
		popover = new Popover
			target: config.target
			closeMode: config.closeMode || 'close'
			title: ''
			styles: {width:260}
		picker = new DatePicker(config)
		picker.on 'switch', =>
			popover.updatePosition()
			return
		popover.add('picker', picker)
		return popover


module.exports = PickerManager