class SelectionModel extends Miwo.Object

	# @cfg {String} single or multi
	type: "single"
	# @cfg {Boolean} [pruneRemoved=true] Remove records from the selection when they are removed from the store.
	pruneRemoved: true

	locked: false
	selected: []
	lastSelected: null
	store: null
	selectionChanged: false
	emitEvents: true
	selectableIndex: null
	selectableHandler: null


	constructor: (config) ->
		super(config)
		@selected = []
		return


	setStore: (@store) ->
		@mon(store, 'datachanged', 'onStoreDataChanged')
		@mon(store, 'clear', 'onStoreClear')
		@mon(store, 'remove', 'onStoreRemove')
		return

	getStore: ->
		return @store


	onStoreDataChanged: ->
		@refresh()
		return


	onStoreClear: ->
		if @getCount() > 0
			@clearSelections()
			@selectionChanged = true
			@checkSelectionChanged()
		return


	onStoreRemove: (store, rec, index) ->
		if @lastSelected is rec
			@lastSelected = null
		if @isSelected(rec)
			@selected.erase(rec)
			@selectionChanged = true
			@checkSelectionChanged()
		return


	# A fast reset of the selections without firing events, updating the ui, etc. For private usage only.
	# @private
	clearSelections: ->
		@selected.empty()
		@lastSelected = null
		return


	# Returns true if the selections are locked.
	# @return {Boolean}
	isLocked: ->
		return @locked


	# Locks the current selection and disables any changes from happening to the selection.
	# @param {Boolean} locked  True to lock, false to unlock.
	setLocked: (locked) ->
		@locked = !!locked
		return


	# Returns true if the specified row is selected.
	# @param {Miwo.data.Model/Number} record The record or index of the record to check
	# @return {Boolean}
	isSelected: (record) ->
		record = (if Type.isNumber(record) then @store.getAt(record) else record)
		return @selected.indexOf(record) isnt -1


	# Returns true if the specified row is selectable.
	# @param {Miwo.data.Model/Number} record The record or index of the record to check
	# @return {Boolean}
	isSelectable: (record) ->
		if not @selectableIndex and not @selectableHandler
			return true
		else
			record = (if Type.isNumber(record) then @store.getAt(record) else record)
			if @selectableHandler
				return @selectableHandler(record)
			else
				return !!record.get(@selectableIndex)

	getSelection: ->
		return @selected


	getRecords: ->
		rs = []
		rs.push(rec)  for rec in @selected
		return rs


	hasSelection: ->
		return @getCount() > 0


	getFirstSelected: ->
		return (if @hasSelection() then @records[0] else null)


	getLastSelected: ->
		return (if @hasSelection() then @records.getLast() else null)


	getCount: ->
		return @selected.length


	getTotalCount: ->
		return @getStore().getCount()


	getTotalSelectableCount: ->
		count = 0
		@getStore().each (r) =>
			count++  if @isSelectable(r)
			return
		return count


	selectAll: (silent) ->
		records = @store.getRecords()
		@doSelect records, silent
		return

	deselectAll: (silent) ->
		records = [] # nemoze byt predana priamo selekcia
		@getSelection().each (record) ->
			records.push(record)
			return
		@doDeselect(records, silent)
		return


	select: (records, silent) ->
		@deselectAll()  if @type is "single" and @hasSelection()
		@doSelect(records, silent)
		return


	deselect: (records, silent) ->
		@doDeselect(records, silent)
		return


	toggle: (records, silent) ->
		toSelect = []
		toDeselect = []
		for record in Array.from(records)
			if @isSelected(record) then toDeselect.push(record) else toSelect.push(record)
		if toSelect.length > 0
			@select(toSelect, silent)
		if toDeselect.length > 0
			@deselect(toDeselect, silent)
		return


	setSelected: (records, select, silent) ->
		this[(if select then "select" else "deselect")](records, silent)
		return


	setSelectedAll: (select, silent) ->
		this[(if select then "selectAll" else "deselectAll")](silent)
		return


	doSelect: (records, silent) ->
		if @locked or not @store
			return
		if typeof records is "number"
			records = [@store.getAt(records)]

		@selectionChanged = false
		Array.from(records).each (record) =>
			if @isSelectable(record)
				if !@isSelected(record)
					@selectionChanged = true
					@selected.include(record)
					@emit('select', this, record, @store.indexOf(record)) if @emitEvents
				@lastSelected = record
			return

		if !silent
			@checkSelectionChanged()
		return


	doDeselect: (records, silent) ->
		if @locked or not @store
			return
		if typeof records is "number"
			records = [@store.getAt(records)]

		@selectionChanged = false
		Array.from(records).each (record) =>
			if @isSelectable(record)
				if @isSelected(record)
					@selectionChanged = true
					@selected.erase(record)
					@emit('deselect', this, record, @store.indexOf(record)) if @emitEvents
			return

		if !silent
			@checkSelectionChanged()
		return


	checkSelectionChanged: ->
		if @emitEvents and @selectionChanged
			@emit('change', this, @getSelection())
		return


	refresh: ->
		rec = undefined
		toBeSelected = []
		toBeReAdded = []

		# Not been bound yet.
		if !@store
			return

		# Add currently records to the toBeSelected list if present in the Store
		# If they are not present, and pruneRemoved is false, we must still retain the record
		for selection in @selected
			if @store.indexOf(selection) isnt -1
				rec = @store.getById(selection.getId())
				toBeSelected.push(rec)  if rec

			# Selected records no longer represented in Store must be retained
			else if !@pruneRemoved
				# See if a record by the same ID exists. If so, select it
				rec = @store.getById(selection.getId())
				if rec
					toBeSelected.push(rec)
				# If it does not exist, we have to re-add it to the selection
				else
					toBeReAdded.push(selection)

		@emitEvents = false
		@clearSelections()

		# perform the selection again
		if toBeSelected.length
			@doSelect(toBeSelected, true)

		# If some of the selections were not present in the Store, but pruneRemoved is false, we must add them back
		if toBeReAdded.length
			@selection.append(toBeReAdded)
			# No records reselected.
			if !@lastSelected
				@lastSelected = toBeReAdded[toBeReAdded.length - 1]

		@emitEvents = true
		@checkSelectionChanged()
		return


	doDestroy: ->
		@store = null
		super()
		return


module.exports = SelectionModel