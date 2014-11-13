class Helpers


	@createSelectItems: (control) ->
		if control.items
			return control.items

		else if control.store
			control.store = miwo.store(control.store)

			if !control.keyProperty
				control.keyProperty = 'id'

			if !control.textProperty
				throw new Error("Undefined text property")

			items = {}
			control.store.each (row) =>
				items[row.get(control.keyProperty)] =
					text: row.get(control.textProperty)
					content: control.buildRowContent(row)

			return items

		else
			return {}


	@setSelectItems: (control, items) ->
		if !control.input then return
		input = control.input

		input.clear()

		if control.prompt && control.requirePromptItem
			input.addOption("", control.prompt)

		if Type.isArray(items)
			for value in items
				input.addOption(value, value)
		else
			for name,value of items
				if Type.isObject(value)
					if value.items
						group = input.addGroup(value.title)
						for iname,ivalue of value.items
							if Type.isObject(ivalue)
								group.addOption(iname, ivalue.text, ivalue.content)
							else
								group.addOption(iname, ivalue)
					else
						input.addOption(name, value.text, value.content)
				else
					input.addOption(name, value)
		return


	@createInputItems: (control) ->
		if control.items
			return control.items

		else if control.store
			control.store = miwo.store(control.store)

			if !control.keyProperty
				control.keyProperty = 'id'

			if !control.textProperty
				throw new Error("Undefined text property")

			items = {}
			control.store.each (row) =>
				items[row.get(control.keyProperty)] =
					text: row.get(control.textProperty)
					content: control.buildRowContent(row)

			return items

		else
			return {}


	@setInputItems: (control, items) ->
		if !control.input then return
		input = control.input
		input.clear()

		if Type.isArray(items)
			for value in items
				input.addItem(value, value)
		else
			for name,value of items
				input.addItem(name, value)
		return


module.exports = Helpers