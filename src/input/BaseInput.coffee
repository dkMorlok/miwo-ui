class BaseInput extends Miwo.Component

	isInput: true


	getInputEl: ->
		return @inputEl


	getInputId: (name = 'input')->
		return @id+'-'+name


	afterRender: ->
		super()
		@focusEl = @getInputEl() if !@focusEl
		@setDisabled(@disabled)
		return


module.exports = BaseInput