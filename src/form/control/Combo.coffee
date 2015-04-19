BaseSelectControl = require './BaseSelectControl'
Combo = require '../../input/Combo'


class ComboControl extends BaseSelectControl

	xtype: 'combobox'
	hideSelected: false
	multiple: false
	height: null
	placeholder: ''
	prompt: false


	createInput: ->
		return new Combo
			id: @id+'Input'
			hideSelected: @hideSelected
			multiple: @multiple
			height: @height
			placeholder: @placeholder
			prompt: @prompt


module.exports = ComboControl