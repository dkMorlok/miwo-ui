# windows
DialogFactory = require './window/DialogFactory'
WindowManager = require './window/WindowManager'

# forms
FormRendererFactory = require './form/render/FormRendererFactory'
HorizontalRenderer = require './form/render/HorizontalRenderer'
InlineRenderer = require './form/render/InlineRenderer'

# behaviors
TooltipManager = require './tip/TooltipManager'
PopoverManager = require './tip/PopoverManager'
BehaviorManager = require './behaviors/BehaviorManager'
TooltipBehavior = require './behaviors/Tooltip'
PopoverBehavior = require './behaviors/Popover'
TabsBehavior = require './behaviors/Tabs'

# selections
SelectorFactory = require './selection/SelectorFactory'
CheckSelector = require './selection/CheckSelector'
RowSelector = require './selection/RowSelector'

# utils
Notificator = require './notify/Notificator'

# pickers
PickerManager = require './picker/Manager'


class MiwoUiExtension extends Miwo.InjectorExtension


	init: () ->
		@setConfig
			behaviors:
				tooltip: TooltipBehavior,
				popover: PopoverBehavior
				tabs: TabsBehavior
			selectors:
				row: RowSelector
				check: CheckSelector
		return


	build: (injector) ->
		# windows
		injector.define('dialogFactory', DialogFactory)
			.setGlobal('dialog')
		injector.define('windowMgr', WindowManager)
			.setGlobal()


		# forms
		injector.define 'formRendererFactory', FormRendererFactory, (service)=>
			service.register('horizontal', HorizontalRenderer)
			service.register('inline', InlineRenderer)
			return


		# tooltips
		injector.define 'tooltip', TooltipManager
			.setGlobal()
		injector.define 'popover', PopoverManager
			.setGlobal()

		# behaviors & tooltips
		injector.define 'behavior', BehaviorManager
			.setGlobal()
			.setup (service)=>
				for name,value of @config.behaviors
					if Type.isFunction(value)
						service.install(name, injector.createInstance(value))
					else
						throw new Error("Behavior must be function (constructor).")
				return

		# selections
		injector.define 'selectorFactory', SelectorFactory, (service)=>
			for name,klass of @config.selectors
				service.register(name,klass)
			return

		# utils
		injector.define 'notificator', Notificator
			.setGlobal()

		# pickers
		injector.define 'pickers', PickerManager
			.setGlobal()
		return


	update: (injector) ->
		# connect components with behaviors
		injector.update('componentMgr').setup (service)=>
			behavior = injector.get('behavior')
			service.on 'afterrender', (component)=>
				behavior.apply(component.el)
				return
			return

		injector.update('translator').setup (service)=>
			service.setTranslates('en', 'miwo', require('./translates'))
			return
		return


module.exports = MiwoUiExtension