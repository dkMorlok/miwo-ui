Window = require './Window'
Form = require '../form/container/Form'


class FormWindow extends Window

	# @event submit FormWindow, Form
	# @event success FormWindow, Form
	# @event failure FormWindow, Form

	@getter 'form', () -> @getForm()


	doInit: ->
		super
		form = @add 'form', new Form
		form.on('submit', (form, isValid)=> @emit('submit', this, form, isValid))
		form.on('success', (form)=> @emit('success', this, form))
		form.on('failure', (form)=> @emit('failure', this, form))
		return


	getForm: ->
		return @get('form')


	setFocus: ->
		super()
		@getForm().getFocusControl().setFocus()
		return


	addSubmitButton: (text) ->
		return @addButton 'submit',
			text: text
			type: 'primary'
			handler: () => @getForm().submit()


module.exports = FormWindow