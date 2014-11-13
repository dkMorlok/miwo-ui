Color = require '../utils/Color'


class ColorPicker extends Miwo.Component

	xtype: "colorpicker"
	color: "FFFFFF"
	mapColor: null
	colorRe: /^[0-9A-F]{6}$/
	baseCls: 'colorpicker'


	beforeInit: ->
		super()
		this.template =
		'<div miwo-reference="map" class="{baseCls map}">'+
			'<div class="{baseCls panel}"></div>'+
			'<div miwo-reference="point" class="{baseCls point}"></div>'+
		'</div>'+
		'<div class="{baseCls bar}">'+
			'<div miwo-reference="bar" class="bar"></div>'+
		'</div>'+
		'<div class="{baseCls utils}">'+
			'<div miwo-reference="preview" class="{baseCls preview}"></div>'+
			'<input miwo-reference="hexinput" type="text" class="{baseCls hex} form-control" maxlength="7" value="FFFFFF"/>'+
			'<button miwo-events="click:onBtnClick" class="btn btn-default">Select</button>'+
		'</div>'
		return


	afterInit: ->
		super()
		@color = Color.fromHex(@color)
		@mapColor = Color.fromHsv(@color.hue, 100, 100)
		return


	afterRender: ->
		super()
		@hexinput.on "keyup", ()=>
			@setColor(@hexinput.get("value"))
			return

		@map.on "mousedown", (event) =>
			event.stop()
			document.on "mousemove", @bound("onMapMouseMove")
			document.on "mouseup", @bound("onMapMouseUp")
			return

		@map.on "click", (event) =>
			event.stop()
			@updateMapOnMouseEvent(event)
			return

		@bar.on "mousedown", (event)=>
			event.stop()
			document.on "mousemove", @bound("onBarMouseMove")
			document.on "mouseup", @bound("onBarMouseUp")
			return

		@bar.on "click", (event) =>
			event.stop()
			@updateBarOnMouseEvent(event)
			return

		@setColor(@color.hex, true)
		return


	setColor: (color, update) ->
		color = color.toUpperCase()
		color = color.replace("#", "")
		if @isColorValid(color) and (@color.hex isnt color or update)
			@color.setHex(color)
			@mapColor = Color.fromHsv(@color.hue, 100, 100)
			@doSetHue(@color.h)
			@doSetSaturationAndValue(@color.s, @color.v)
			@color.setHex(color)
			@onColorChanged()
		return


	getColor: ->
		return @color.hex


	isColorValid: (hex) ->
		return @colorRe.test(hex)


	onBarMouseUp: (event) ->
		event.stop()
		document.un "mousemove", @bound("onBarMouseMove")
		document.un "mouseup", @bound("onBarMouseUp")
		return


	onBarMouseMove: (event) ->
		event.stop()
		@updateBarOnMouseEvent(event)
		return


	updateBarOnMouseEvent: (e) ->
		pos = @bar.getPosition()
		yValue = Math.min(Math.max(0, e.page.y - pos.y), 256)
		@setHue(360 - Math.round((360 / 256) * yValue))
		return


	setHue: (hue) ->
		if @color.hue isnt hue
			@doSetHue hue
			@onColorChanged()
		return


	doSetHue: (hue) ->
		@color.setHsv(hue, null, null)
		@mapColor.setHsv(hue, 100, 100) # simulate full sat and value
		@map.setStyle "background-color", "#" + @mapColor.hex
		return


	onMapMouseUp: (event) ->
		event.stop()
		document.un "mousemove", @bound("onMapMouseMove")
		document.un "mouseup", @bound("onMapMouseUp")
		return


	onMapMouseMove: (event) ->
		event.stop()
		@updateMapOnMouseEvent(event)
		return


	updateMapOnMouseEvent: (event) ->
		pos = @map.getPosition()
		xValue = Math.min(Math.max(0, event.page.x - pos.x), 256)
		yValue = Math.min(Math.max(0, event.page.y - pos.y), 256)
		s = Math.round((100 / 256) * xValue)
		v = 100 - Math.round((100 / 256) * yValue)
		@setSaturationAndValue(s, v)
		return


	setSaturationAndValue: (s, v) ->
		if @color.s isnt s or @color.v isnt v
			@doSetSaturationAndValue(s, v)
			@onColorChanged()
		return


	doSetSaturationAndValue: (s, v) ->
		@color.setHsv(null, s, v)
		@point.setPosition({
			x: (s / 100) * 256 - 8
			y: 256 - (v / 100) * 256 - 8
		})
		return


	onColorChanged: ->
		@preview.setStyle("background-color", "#" + @color.hex)
		@hexinput.set("value", @color.hex)
		@emit("colorchange", this, @color.hex)
		return


	onBtnClick: ->
		@emit("selected", this, @color.hex)
		return



module.exports = ColorPicker