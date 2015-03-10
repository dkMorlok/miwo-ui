class Composite extends Miwo.Container

	xtype: 'composite'
	componentCls: 'form-composite'
	labelSeparator: ', '


	getInputs: ->
		return @getComponents().toArray()


	setValue: (value) ->
		value = value or {}
		for input in @getInputs()
			if value.hasOwnProperty(input.name)
				input.setValue(value[input.name])
		return


	getValue: ->
		value = {}
		for input in @getInputs()
			value[input.name] = input.getValue()
		return value


	setDisabled: (@disabled) ->
		for input in @getInputs()
			input.setDisabled(@disabled)
		return


	setReadonly: (@readonly) ->
		for input in @getInputs()
			input.setReadonly(@readonly)
		return


module.exports = Composite