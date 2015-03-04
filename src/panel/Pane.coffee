Scrollable = require './Scrollable'


class Pane extends Miwo.Container

	# @var {boolean}
	scrollable: false

	# @var {ScrollerPlugin|Object}
	scrollableOptions: null


	beforeInit: ->
		super
		@contentEl = 'div'
		return


	doInit: ->
		super
		@installPlugin('scrollable', new Scrollable(this, @scrollableOptions))  if @scrollable
		return


	# Scrolls the scrollable area to the topmost position
	scrollTop: ->
		@getPlugin('scrollable').scrollTop() if @scrollable
		return


	# Scrolls the scrollable area to the bottommost position
	scrollBottom: ->
		@getPlugin('scrollable').scrollBottom() if @scrollable
		return


	afterRender: ->
		super
		@el.addClass('pane')
		@contentEl.addClass('pane-ct')
		return


module.exports = Pane