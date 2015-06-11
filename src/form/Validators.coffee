Validators =

	emailRe: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	urlRe: /^(ftp|http|https)?:\/\/[A-Za-z0-9\.-]{1,}\.[A-Za-z]{2}/
	intRe: /^\d+$/
	colorRe: /^\#[a-z0-9A-Z]{6}/
	dateRe: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
	numberRe: /^-{0,1}\d*\.{0,1}\d+$/


	registerValidator: (name, validator) ->
		this[name] = validator
		return


	equal: (control, arg) ->
		arg = control.getForm().getField(arg)  if Type.isString(arg)
		return control.getStringValue() is arg.getStringValue()


	filled: (control) ->
		return control.isFilled()


	valid: (control) ->
		return control.rules.validate(true)


	minLength: (control, length) ->
		return control.getStringValue().length >= length


	maxLength: (control, length) ->
		return control.getStringValue().length <= length


	length: (control, range) ->
		range = [range, range] if !Type.isArray(range)
		len = control.getStringValue().length
		return len >= range[0] and len <= range[1]


	date: (control) ->
		return @dateRe.test(control.getStringValue())


	email: (control) ->
		return @emailRe.test(control.getStringValue())


	url: (control) ->
		return @urlRe.test(control.getStringValue())


	pattern: (control, pattern) ->
		return pattern.test(control.getStringValue())


	number: (control) ->
		return @numberRe.test(control.getStringValue())


	integer: (control) ->
		return @intRe.test(control.getStringValue())


	float: (control) ->
		return @numberRe.test(control.getStringValue())


	range: (control, range) ->
		range = [range, range]  if !Type.isArray(range)
		return control.getValue() >= range[0] and control.getValue() <= range[1]


	min: (control, length) ->
		return control.getValue() >= length


	max: (control, length) ->
		return control.getValue() <= length


	color: (control) ->
		return @colorRe.test(control.getStringValue())


module.exports = Validators
