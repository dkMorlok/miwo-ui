Button = require './Button'


class CloseButton extends Button

	baseCls: 'close'
	text: '<span aria-hidden="true">×</span>'


module.exports = CloseButton