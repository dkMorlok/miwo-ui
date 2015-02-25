class DropSelectInput extends Miwo.Component

	xtype: 'dropselectinput'
	store: null
	keyProperty: 'id'
	textProperty: null
	sourceTitle: ''
	targetTitle: ''
	sourceEmpty: ''
	targetEmpty: ''
	baseCls: 'dropselect'


	afterInit: ->
		super
		@store = miwo.store(@store)
		if !@textProperty then throw new Error("Undefined textProperty attribute")
		return


	setDisabled: (disabled) ->
		# not supported yet
		return


	setValue: (value, silent) ->
		@loadItems(value, silent)
		return


	getValue: ->
		return @getTargetKeys()


	doRender: ->
		listCls = @getBaseCls('list')
		sourceCls = @getBaseCls('source')
		targetCls = @getBaseCls('target')
		buttonsCls = @getBaseCls('buttons')

		container = new Element 'div',
			parent: @el
			cls: 'controls row'
			html: """
			<div class='col-md-5'>
				<div class='#{listCls} #{sourceCls}'>
					<h5>#{@sourceTitle}</h4>
					<div class="items"></div>
					<div class="empty"><span>#{@sourceEmpty}</span></div>
				</div>
			</div>
			<div class='col-md-2 #{buttonsCls} text-center'>
				<button class="btn btn-default" name="removeAll"> << </button>
				<button class="btn btn-default" name="addAll"> >> </button>
			</div>
			<div class='col-md-5'>
				<div class='#{listCls} #{targetCls}'>
					<h5>#{@targetTitle}</h4>
					<div class="items"></div>
					<div class="empty"><span>#{@targetEmpty}</span></div>
				</div>
			</div>
			"""

		source = container.getElement('.'+sourceCls)
		target = container.getElement('.'+targetCls)
		@sourceEmptyCt = source.getElement('.empty')
		@targetEmptyCt = target.getElement('.empty')
		@sourceEl = source = source.getElement('.items')
		@targetEl = target = target.getElement('.items')

		container.on 'click:relay(.item)', (event, target) =>
			event.stop()
			target[if target.hasClass('selected') then 'removeClass' else 'addClass'] 'selected'
			return

		source.on 'click:relay(.item)', (event, item) =>
			event.stop()
			@addItem(item)
			return
		target.on 'click:relay(.item)', (event, item) =>
			event.stop()
			@removeItem(item)
			return

		target.on 'click', (event) =>
			if event.target.hasClass(listCls)
				target.getElements('.item.selected').removeClass('selected')
			return
		source.on 'click', (event) =>
			if event.target.hasClass(listCls)
				source.getElements('.item.selected').removeClass('selected')
			return

		container.getElement('button[name="addAll"]').on 'click', (e) =>
			e.stop()
			@addAll()
			return
		container.getElement('button[name="removeAll"]').on 'click', (e) =>
			e.stop()
			@removeAll()
			return
		return


	afterRender: ->
		super
		@loadItems()
		return


	addItem: (source) ->
		source.inject(@targetEl)
		source.removeClass('selected')
		@onItemsChanged()
		return


	addAll: ->
		for item in @sourceEl.getElements('.item')
			item.inject(@targetEl)
			item.removeClass('selected')
		@onItemsChanged()
		return


	addSelected: ->
		for item in @sourceEl.getElements('.selected')
			item.inject(@targetEl)
			item.removeClass('selected')
		@onItemsChanged()
		return


	removeItem: (item) ->
		item.inject(@sourceEl)
		item.removeClass('selected')
		@onItemsChanged()
		return


	removeAll: ->
		for item in @targetEl.getElements('.item')
			item.inject(@sourceEl)
			item.removeClass('selected')
		@onItemsChanged()
		return


	removeSelected: ->
		for item in @targetEl.getElements('.selected')
			item.inject(@sourceEl)
			item.removeClass('selected')
		@onItemsChanged()
		return


	loadItems: (values, silent) ->
		@sourceEl.empty()
		@targetEl.empty()

		@store.each (record) =>
			item = new Element 'div',
				cls: 'item'
				parent: @sourceEl
				'data-id': record.get(@keyProperty)
				html: record.get(@textProperty)
			return

		if values
			for item in @sourceEl.getElements('.item')
				id = item.get('data-id')
				if values.indexOf(id) >= 0
					item.inject(@targetEl)

		@onItemsChanged(silent)
		return


	getSourceKeys: ->
		keys = []
		for item in @sourceEl.getElements('.item')
			keys.push item.get('data-id')
		return keys


	getTargetKeys: ->
		keys = []
		for item in @targetEl.getElements('.item')
			keys.push item.get('data-id')
		return keys


	onItemsChanged: (silent) ->
		@sourceEmptyCt.setVisible(@sourceEl.getElements('.item').length == 0)
		@targetEmptyCt.setVisible(@targetEl.getElements('.item').length == 0)
		@emit('change', this) if !silent
		return


module.exports = DropSelectInput