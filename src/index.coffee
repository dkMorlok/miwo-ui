miwo.registerExtension('miwo-ui', require './DiExtension')
miwo.translator.setTranslates('en', 'miwo', require('./translates'))

# classes
Miwo.ui = {}
Miwo.drag = require './drag'
Miwo.notify = require './notify'
Miwo.buttons = require './buttons'
Miwo.navbar = require './navbar'
Miwo.dropdown = require './dropdown'
Miwo.input = require './input'
Miwo.picker = require './picker'
Miwo.pagination = require './pagination'
Miwo.form = require './form'
Miwo.panel = require './panel'
Miwo.window = require './window'
Miwo.tabs = require './tabs'
Miwo.selection = require './selection'
Miwo.grid = require './grid'
Miwo.tip = require './tip'
Miwo.mask = require './mask'
Miwo.progress = require './progress'
Miwo.ui.utils = require './utils'

# shortcuts
Miwo.Form = Miwo.form.container.Form
Miwo.Window = Miwo.window.Window
Miwo.FormWindow = Miwo.window.FormWindow
Miwo.Tabs = Miwo.tabs.Tabs
Miwo.Grid = Miwo.grid.Grid
Miwo.Pane = Miwo.panel.Pane