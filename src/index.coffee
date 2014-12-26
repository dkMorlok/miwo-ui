miwo.registerExtension('miwo-ui', require './DiExtension')

# classes
Miwo.ui = {}
Miwo.notify = require './notify'
Miwo.buttons = require './buttons'
Miwo.dropdown = require './dropdown'
Miwo.input = require './input'
Miwo.picker = require './picker'
Miwo.nav = require './nav'
Miwo.form = require './form'
Miwo.window = require './window'
Miwo.tabs = require './tabs'
Miwo.selection = require './selection'
Miwo.grid = require './grid'
Miwo.tip = require './tip'
Miwo.ui.utils = require './utils'

# shortcuts
Miwo.Form = Miwo.form.container.Form
Miwo.Window = Miwo.window.Window
Miwo.FormWindow = Miwo.window.FormWindow
Miwo.Tabs = Miwo.tabs.Tabs
Miwo.Grid = Miwo.grid.Grid