Scrollable = require './Scrollable'


class Pane extends Miwo.Container

	# @var {boolean}
	scrollable: false

	# @var {ScrollerPlugin|Object}
	scrollableOptions: null

	# @var {string}
	contentEl: 'div'


	doInit: ->
		super
		@setScrollable(@scrollable)
		return


	setScrollable: (@scrollable) ->
		if @scrollable && !@hasPlugin('scrollable')
			@installPlugin('scrollable', new Scrollable(this, @scrollableOptions))
		else if !@scrollable && @hasPlugin('scrollable')
			@uninstallPlugin('scrollable')
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