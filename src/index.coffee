miwo.registerExtension('miwoui', require './DiExtension')

MiwoUi = {}
global.MiwoUi = MiwoUi

# di
MiwoUi.DiExtension = require './DiExtension'

# buttons
MiwoUi.buttons = require './buttons'

# dropdown
MiwoUi.dropdown = require './dropdown'

# inputs
MiwoUi.input = require './input'

# pickers
MiwoUi.picker = require './picker'

# form
MiwoUi.form = require './form'
MiwoUi.Form = MiwoUi.form.container.Form

# window
MiwoUi.window = require './window'
MiwoUi.Window = MiwoUi.window.Window
MiwoUi.FormWindow = MiwoUi.window.FormWindow

# tabs
MiwoUi.tabs = require './tabs'
MiwoUi.Tabs = MiwoUi.tabs.Tabs

# selections
MiwoUi.selection = require './selection'

# grid
MiwoUi.grid = require './grid'
MiwoUi.Grid = MiwoUi.grid.Grid

# utils
MiwoUi.utils = require './utils'

# tips, toolbars, popover
MiwoUi.tip = require './tip'