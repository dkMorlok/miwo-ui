class LoadingMaskFactory

	instanceCls: null


	create: (target) ->
		if target instanceof Miwo.Component
			target = target.el
		return new @instanceCls({renderTo:target})


	show: (target) ->
		mask = @create(target)
		mask.show()
		return mask


module.exports = LoadingMaskFactory