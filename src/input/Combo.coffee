ScreenMask = require '../utils/ScreenMask'


class Combo extends Miwo.Component

	isInput: true
	xtype: 'combo'
	hideSelected: true
	multiple: false
	height: null
	placeholder: ''
	prompt: false

	items: null
	disabled: false
	opened: false
	inputEl: null
	resetEl: null
	dropdownEl: null
	dropdownItemsEl: null
	activeItemIndex: -1
	activeValueIndex: -1
	active: false
	screenMask: null


	constructor: (config) ->
		super(config)
		@items = []
		return


	afterInit: () ->
		super()
		# create layout
		@el.set 'html',
		'<div class="combo-input">'+
			'<span class="combo-input-text">'+@placeholder+'</span>'+
			'<span class="combo-input-reset" style="display: none;"><i class="glyphicon glyphicon glyphicon-remove"></i></span>'+
			'<span class="combo-input-arrow"><i class="glyphicon glyphicon-chevron-down"></i></span>'+
		'</div>'+
		'<input class="screen-off" id="'+@id+'Input" type="text" role="button" aria-haspopup="true" aria-labelledby="'+@id+'Input" >'

		# references
		@control = @el.getElement('.combo-input')
		@inputEl = @el.getElement('input')
		@textEl = @el.getElement('.combo-input-text')
		@resetEl = @el.getElement('.combo-input-reset')

		@screenMask = new ScreenMask () => @close()

		# create dropdown list
		@dropdownEl = new Element 'div',
			cls: 'combo-dropdown'
		@dropdownItemsEl = new Element 'div',
			cls: 'combo-dropdown-items'
			parent: @dropdownEl
		return


	doRender: ->
		@el.addClass('form-control combo combo-empty')
		@el.setStyle('height', @height) if @height
		@el.addClass('disabled') if @disabled

		# bind events
		@el.on 'click', (event) =>
			if @disabled then return
			@open()
			return
		@dropdownEl.on 'click:relay(.combo-dropdown-item)', (event, target) =>
			event.stop()
			val = target.get('data-value')
			@setValue((if @multiple then @getValue().include(val) else val))
			@close()
			return
		@dropdownEl.on 'mouseenter:relay(.combo-dropdown-item)', (event, target) =>
			event.stop()
			@activateItem(target.get('data-index'))
			return
		@textEl.on 'click:relay(.combo-input-text li)', (event, target) =>
			if @disabled then return
			event.stop()
			val = target.get('data-value')
			@setValue(@getValue().erase(val))
			return
		@textEl.on 'mouseenter:relay(li)', (event, target) =>
			if @disabled then return
			event.stop()
			@activateValue(parseInt(target.get('data-index')))
			return
		@textEl.on 'mouseleave:relay(li)', (event, target) =>
			if @disabled then return
			event.stop()
			@activateValue(-1)
			return
		@resetEl.on 'click', (event) =>
			if @disabled then return
			event.stop()
			@setValue()
			return
		@inputEl.on 'focus', (event) =>
			if @disabled then return
			@setFocus(true)
			return

		@keyListener = new Miwo.utils.KeyListener(miwo.body, 'keydown')
		@keyListener.on 'esc', () =>
			if @disabled then return
			@close()
			return true
		@keyListener.on 'up', () =>
			if @disabled then return
			@open()
			@activatePrevItem()
			return true
		@keyListener.on 'down', () =>
			if @disabled then return
			@open()
			@activateNextItem()
			return true
		@keyListener.on 'left', () =>
			if @disabled then return
			@activatePrevValue() if @multiple
			return true
		@keyListener.on 'right', () =>
			if @disabled then return
			@activateNextValue() if @multiple
			return true
		@keyListener.on 'backspace', () =>
			if @disabled then return
			if !@opened
				if (item = @getActiveValue())
					val = item.get('data-value')
					@setValue(@getValue().erase(val))
				else
					@activeteLastValue()
					if (item = @getActiveValue())
						val = item.get('data-value')
						@setValue(@getValue().erase(val))
			return true
		@keyListener.on 'enter', () =>
			if @disabled then return
			if @opened
				if (item = @getActiveItem())
					val = item.get('data-value')
					@setValue((if @multiple then @getValue().include(val) else val))
					@close()
			else if !@opened
				if (item = @getActiveValue())
					val = item.get('data-value')
					@setValue(@getValue().erase(val))
				else
					@open()
			return true
		@keyListener.pause()
		return


	getInputEl: () ->
		return @inputEl


	getInputId: () ->
		return @id+'Input'


	setFocus: (silent) ->
		@active = true
		@el.addClass('active')
		@el.setFocus() if !silent
		@keyListener.resume()
		miwo.body.on('click', @bound('onBodyClick'))
		return


	blur: (silent) ->
		@active = false
		@el.removeClass('active')
		@el.blur() if !silent
		@keyListener.pause()
		miwo.body.un('click', @bound('onBodyClick'))
		return


	setValue: (value) ->
		if value is undefined || value is null
			value = ''

		if !Type.isArray(value)
			value = [value]

		# setup displayed values
		if @multiple
			content = '<ul>'
			content += '<li class="combo-value" data-index="'+i+'" data-value="'+v+'" >'+@getItemText(v)+'<i class="glyphicon glyphicon-remove"></i></li>' for v,i in value
			content += '</ul>'
			inputValue = value.join(',')
		else
			content = @getItemText(value[0])
			inputValue = value[0]

		@el.toggleClass('combo-empty', !inputValue)
		@textEl.set('html', if inputValue then content else @placeholder)

		if @inputEl.get('value') isnt inputValue
			@inputEl.set('value', inputValue)
			@inputEl.emit('change')

		@activeValueIndex = -1

		# update dropdown list
		if @hideSelected
			for item in @items
				selected = value.indexOf(item.get('data-value')) >= 0
				item.setVisible(!selected)
				item.toggleClass('selected', selected)

		# show reset button if value set
		@resetEl.setVisible(!@disabled && @prompt && value[0] isnt undefined && value[0] isnt '')
		return


	getValue: () ->
		value = @inputEl.get('value')
		return if @multiple then (if value then value.split(',') else []) else value


	getItemText: (value) ->
		el = @dropdownEl.getElement('[data-value="'+value+'"]')
		return if el then el.comboText else ''


	addOption: (value, text, content) ->
		item = new Element('div', {cls: 'combo-dropdown-item', 'data-value': value, html: content||text, 'data-index': @items.length})
		item.comboText = text;
		item.inject(@dropdownItemsEl)
		@items.push(item)
		if !@prompt && @getValue() is '' then @setValue(value)
		return


	addOptions: (items) ->
		for item in items
			@addOption(item.value, item.text, item.content)
		return


	setOptions: (items) ->
		@clear()
		@setOptions(items)
		return


	setPrompt: (text) ->
		@prompt = text
		return


	clear: () ->
		@items.empty()
		@dropdownItemsEl.empty()
		return


	setDisabled: (disabled) ->
		super(disabled)
		@el.toggleClass('disabled', disabled)
		return


	open: () ->
		if @opened then return
		@opened = true
		@setFocus()

		@el.addClass('combo-open')
		@screenMask.show()
		@dropdownEl.inject(miwo.body)
		@dropdownEl.addClass('active')

		pos = @el.getPosition()
		size = @el.getSize()
		@dropdownEl.setStyles
			top: pos.y + size.y
			left: pos.x
			width: size.x

		if @activeItemIndex < 0
			@activateNextItem()
		return


	close: () ->
		if !@opened then return
		@opened = false
		@el.removeClass('combo-open')
		@dropdownEl.removeClass('active')
		@dropdownEl.dispose()
		@screenMask.hide()
		return


	getActiveItem: () ->
		return @items[@activeItemIndex] || null


	activateItem: (index) ->
		if @activeItemIndex >= 0
			@items[@activeItemIndex].removeClass('active')
			@activeItemIndex = -1
		if index >= 0 && index < @items.length
			@items[index].addClass('active')
			@activeItemIndex = index
		return


	activatePrevItem: () ->
		activateIndex = null
		for item,index in @items
			if !item.hasClass('selected') && index < @activeItemIndex
				activateIndex = index
		if activateIndex isnt null
			@activateItem(activateIndex)
		return


	activateNextItem: () ->
		activateIndex = null
		for item,index in @items
			if !item.hasClass('selected') && index > @activeItemIndex
				activateIndex = index
				break
		if activateIndex isnt null
			@activateItem(activateIndex)
		return


	getValueElAt: (index) ->
		return @textEl.getElement('li:nth-child('+(index+1)+')')


	getActiveValue: () ->
		return @getValueElAt(@activeValueIndex) || null


	activateValue: (index) ->
		if @activeValueIndex >= 0
			activeItem = @getValueElAt(@activeValueIndex)
			activeItem.removeClass('active')
		if index >= 0 && index < @getValue().length
			item = @getValueElAt(index)
			item.addClass('active')
			@activeValueIndex = index
		return


	activatePrevValue: () ->
		if @activeValueIndex < 0
			index = @getValue().length-1
		else
			index = if @activeValueIndex is 0 then @getValue().length-1 else @activeValueIndex-1
		@activateValue(index)
		return


	activateNextValue: () ->
		if @activeValueIndex < 0
			index = 0
		else
			index = if @getValue().length is @activeValueIndex+1 then 0 else @activeValueIndex+1
		@activateValue(index)
		return


	activeteLastValue: () ->
		@activateValue(@getValue().length-1)
		return


	onBodyClick: (event) ->
		parents = event.target.getParents()
		if parents.indexOf(@el)<0 && parents.indexOf(@dropdownMaskEl)<0
			@blur()
		return


	doDestroy: () ->
		@screenMask.destroy()
		@keyListener.destroy()
		miwo.body.un('click', @bound('onBodyClick'))
		super


module.exports = Combo