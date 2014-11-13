BaseContainer = require './BaseContainer'


class Fieldset extends BaseContainer

	legend: ''


	beforeInit: () ->
		super
		@xtype = 'fieldset'
		@element = 'fieldset'
		return


	beforeRender: () ->
		super
		this.legendEl = new Element 'legend',
			parent: @el
			html: @legend
		this.contentEl = new Element 'div',
			parent:this.el
			cls:'fieldset-content'
		return



# create add method
BaseContainer.registerControl('fieldset', Fieldset)


module.exports = Fieldset