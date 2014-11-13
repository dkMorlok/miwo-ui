BaseSelectControl = require './BaseSelectControl'
Select = require '../../input/Select'


class SelectControl extends BaseSelectControl

	xtype: 'selectbox'
	requirePromptItem: true


	createInput: () ->
		return new Select
			id: @id


module.exports = SelectControl