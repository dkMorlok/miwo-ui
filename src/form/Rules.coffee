Validators = require './Validators'


class Rule

	# @property {boolean}
	isRule: true

	# @property {Miwo.form.Rules} parent rules
	rules: null

	# @property {Miwo.form.control.BaseControl}
	control: null

	# @property {string} name of rule
	name: null

	# @property {string|function}
	operation: null

	# @property {boolean}
	isNegative: false

	# @property {mixed}
	param: null

	# @property {string}
	message: null


	constructor: (@rules, config = {}) ->
		@control = @rules.control
		for n,v of config then this[n] = v

		if !@message
			if Type.isString(@operation)
				@message = miwo.tr("miwo.rules." + @operation) || "Error"
			else
				@message = ""

		if Type.isString(@operation)
			if @operation[0] is "!"
				@isNegative = true
				@operation = @operation.replace("!", "")
			@name = @operation
			if !Validators[@operation]
				throw new Error("Undefined validator '" + @operation + "' for control '" + @control.name + "'")
			@operation = (control, param) => Validators[@name](control, param)
		else
			@name = "callback"

		if !Type.isFucntion(@operation)
			throw new Error("Unknown operation '" + @operation + "' for control '" + @control.name + "'")
		return


	validate: ->
		if !@control.required && !@control.isFilled() then return true
		result = @operation(@control, @param)
		return (if @isNegative then !result else result)


	getControl: ->
		return @control




class Condition extends Rule

	# @property {boolean}
	isCondition: true

	# @property {Rules}
	subRules: null


	constructor: (rules, config) ->
		super(rules, config)
		@subRules = new Rules(@control, rules)
		return




class Rules

	@formatMessage: (rule) ->
		message = rule.message

		# replace macros
		message = message.replace("%name", rule.control.getName())
		message = message.replace("%label", rule.control.label)
		message = message.replace("%value", rule.control.getValue())

		# replace params
		params = {param: rule.param}
		if Type.isArray(rule.param)
			params['param'+i] = value  for value,i in rule.param
		message = message.substitute(params)
		return message


	parent: null
	control: null
	rules: null
	condition: null


	constructor: (control, @parent) ->
		@control = control
		@rules = []


	setRules: (rules) ->
		@rules = []
		@addRules(rules)
		return


	addRules: (rules) ->
		for rule in rules
			if rule.type is "condition"
				subRules = @addConditionOn(rule.conditionOn or this, rule.operation, rule.param)
				subRules.setRules(rule.rules)  if rule.rules
				if rule.elseRules
					elseRules = @elseCondition()
					elseRules.setRules(rule.elseRules)
			else
				@addRule(rule.operation, rule.message, rule.param)
		return


	addRule: (operation, message, param) ->
		rule = new Rule this,
			operation: operation
			message: message
			param: param
		@rules.push(rule)
		return this


	hasRule: (name) ->
		return !!@rules.some((rule) -> rule.name is name)


	addCondition: (operation, param) ->
		return @addConditionOn(@control, operation, param)


	addConditionOn: (control, operation, param) ->
		rule = new Condition this,
			operation: operation
			param: param
		@condition = rule
		@rules.push(rule)
		return rule.subRules


	elseCondition: ->
		rule = new Condition this,
			operation: @condition.operation
			isNegative: !@condition.isNegative
			param: @condition.param
		@rules.push(rule)
		return rule.subRules


	endCondition: ->
		return @parent


	validate: ->
		errors = []
		for rule in @rules
			if rule.getControl().isDisabled()
				continue
			success = rule.validate()
			if rule.isCondition and success
				errors.append(rule.subRules.validate())
			else if rule.isRule and !success
				errors.push(Rules.formatMessage(rule))
		return errors


module.exports = Rules