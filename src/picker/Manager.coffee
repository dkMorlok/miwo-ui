Popover = require '../tip/Popover'
ColorPicker = require './Color'


class PickerManager

	pickers: null


	constructor: () ->
		@pickers = {}


	get: (type) ->
		if !@pickers[type]
			@pickers[type] = @createPicker(type)
		return @pickers[type]


	createPicker: (type) ->
		factory = 'create'+type.capitalize()+'Picker'
		if !this[factory]
			throw new Error("Undefined factory function for '#{type}' picker")
		return this[factory]()


	createColorPicker: ->
		popover = new Popover
			title: 'Select color'
			styles: {maxWidth: 500}
			closeMode: 'hide'
		popover.add('picker', new ColorPicker())
		return popover


	createDatePicker: ()->

		return


module.exports = PickerManager