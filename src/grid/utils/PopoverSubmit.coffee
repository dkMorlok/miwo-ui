Popover = require '../../tip/Popover'
Button = require '../../buttons/Button'


class PopoverSubmit extends Popover

	onSubmit: null
	onCancel: null

	doInit: () ->
		super()
		@el.addClass('grid-popover-submit')

		buttonYes = new Button
			text: 'Yes'
			type: 'primary'
			handler: () =>
				@onSubmit() if @onSubmit
				@close()
				return
		@add('yes', buttonYes)

		buttonNo = new Button
			text: 'No'
			type: 'default'
			handler: () =>
				@onCancel() if @onCancel
				@close()
				return
		@add('no', buttonNo)
		return



module.exports = PopoverSubmit