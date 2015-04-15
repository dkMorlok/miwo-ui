class BaseTipManager extends Miwo.Object

	placement: 'top'
	distance: 3
	delay: 500

	tip: null
	target: null


	show: (target, config) ->
		if @target is target then return
		if @tip is @tipToHide then @tipToHide = null
		if @tip then @hide()

		tip = @create(target, config)
		if !tip then return

		@target = target
		@tip = tip
		@tip.show()
		@tip.on 'mouseleave', => @hide()

		if target.get("title")
			target.set("data-title", target.get("title"))
			target.set("title", null)

		target.on("mouseleave", @bound('onTargetLeave'))
		target.on("mousedown", @bound('onTargetClick'))
		return


	toggle: (target) ->
		if @tip then @hide() else @show(target)
		return


	hide: ->
		if !@tip then return
		@tip.destroy()
		@tip = null
		@target.un("mouseleave", @bound('onTargetLeave'))
		@target.un("click", @bound('onTargetClick'))
		@target = null
		return


	onTargetLeave: ->
		@tipToHide = @tip
		@target.un("mouseleave", @bound('onTargetLeave'))
		# wait until user move by cursor (user can move on tip - tip should not be destroyed)
		setTimeout((=>
			if @tipToHide and !@tipToHide.isHover()
				# if hover on tip, then tip is destroyed when hover is lose
				@hide()
			return
		), 200)
		return


	onTargetClick: ->
		@toggle(@target)
		return


module.exports = BaseTipManager