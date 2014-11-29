miwo.registerExtension('miwoui', require './DiExtension')

Miwo.ui = {}

# notifications
Miwo.notify = require './notify'

# buttons
Miwo.buttons = require './buttons'

# dropdown
Miwo.dropdown = require './dropdown'

# inputs
Miwo.input = require './input'

# pickers
Miwo.picker = require './picker'

# form
Miwo.form = require './form'
Miwo.Form = Miwo.form.container.Form

# window
Miwo.window = require './window'
Miwo.Window = Miwo.window.Window
Miwo.FormWindow = Miwo.window.FormWindow

# tabs
Miwo.tabs = require './tabs'
Miwo.Tabs = Miwo.tabs.Tabs

# selections
Miwo.selection = require './selection'

# grid
Miwo.grid = require './grid'
Miwo.Grid = Miwo.grid.Grid

# tips, toolbars, popover
Miwo.tip = require './tip'

# di
Miwo.ui.DiExtension = require './DiExtension'

# utils
Miwo.ui.utils = require './utils'