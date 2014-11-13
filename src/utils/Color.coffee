class Color
	r: 0
	g: 0
	b: 0
	h: 0
	s: 0
	v: 0
	hex: ""

	setRgb: (r, g, b) ->
		@r = r  if r isnt null
		@g = g  if g isnt null
		@b = b  if b isnt null
		hsv = Color.rgbToHsv(this)
		@h = hsv.h
		@s = hsv.s
		@v = hsv.v
		@hex = Color.rgbToHex(this)
		return

	setHsv: (h, s, v) ->
		@h = h  if h isnt null
		@s = s  if s isnt null
		@v = v  if v isnt null
		rgb = Color.hsvToRgb(this)
		@r = rgb.r
		@g = rgb.g
		@b = rgb.b
		@hex = Color.rgbToHex(rgb)
		return

	setHex: (hex) ->
		@hex = hex
		rgb = Color.hexToRgb(@hex)
		@r = rgb.r
		@g = rgb.g
		@b = rgb.b
		hsv = Color.rgbToHsv(rgb)
		@h = hsv.h
		@s = hsv.s
		@v = hsv.v
		return



Color.fromRgb = (r, g, b) ->
	object = new Color()
	object.setRgb r, g, b
	return object


Color.fromHsv = (h, s, v) ->
	object = new Color()
	object.setHsv h, s, v
	return object


Color.fromHex = (hex) ->
	object = new Color()
	object.setHex hex
	return object


Color.rgbToHex = (rgb) ->
	return @intToHex(rgb.r) + @intToHex(rgb.g) + @intToHex(rgb.b)


Color.hexToRgb = (hex) ->
	r = "00"
	g = "00"
	b = "00"
	if hex.length is 6
		r = hex.substring(0, 2)
		g = hex.substring(2, 4)
		b = hex.substring(4, 6)
	else
		if hex.length > 4
			r = hex.substring(4, hex.length)
			hex = hex.substring(0, 4)
		if hex.length > 2
			g = hex.substring(2, hex.length)
			hex = hex.substring(0, 2)
		b = hex.substring(0, hex.length)  if hex.length > 0
	return {
		r: @hexToInt(r)
		g: @hexToInt(g)
		b: @hexToInt(b)
	}


Color.hsvToRgb = (hsv) ->
	rgb =
		r: 0
		g: 0
		b: 0

	h = hsv.h
	s = hsv.s
	v = hsv.v
	if s is 0
		if v is 0
			rgb.r = rgb.g = rgb.b = 0
		else
			rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100, 10)
	else
		h = 0  if h is 360
		h /= 60

		# 100 scale
		s = s / 100
		v = v / 100
		i = parseInt(h, 10)
		f = h - i
		p = v * (1 - s)
		q = v * (1 - (s * f))
		t = v * (1 - (s * (1 - f)))
		switch i
			when 0
				rgb.r = v
				rgb.g = t
				rgb.b = p
			when 1
				rgb.r = q
				rgb.g = v
				rgb.b = p
			when 2
				rgb.r = p
				rgb.g = v
				rgb.b = t
			when 3
				rgb.r = p
				rgb.g = q
				rgb.b = v
			when 4
				rgb.r = t
				rgb.g = p
				rgb.b = v
			when 5
				rgb.r = v
				rgb.g = p
				rgb.b = q
		rgb.r = parseInt(rgb.r * 255, 10)
		rgb.g = parseInt(rgb.g * 255, 10)
		rgb.b = parseInt(rgb.b * 255, 10)
	return rgb


Color.rgbToHsv = (rgb) ->
	r = rgb.r / 255
	g = rgb.g / 255
	b = rgb.b / 255
	hsv =
		h: 0
		s: 0
		v: 0

	min = 0
	max = 0
	if r >= g and r >= b
		max = r
		min = (if (g > b) then b else g)
	else if g >= b and g >= r
		max = g
		min = (if (r > b) then b else r)
	else
		max = b
		min = (if (g > r) then r else g)
	hsv.v = max
	hsv.s = (if (max) then ((max - min) / max) else 0)
	unless hsv.s
		hsv.h = 0
	else
		delta = max - min
		if r is max
			hsv.h = (g - b) / delta
		else if g is max
			hsv.h = 2 + (b - r) / delta
		else
			hsv.h = 4 + (r - g) / delta
		hsv.h = parseInt(hsv.h * 60, 10)
		hsv.h += 360  if hsv.h < 0
	hsv.s = parseInt(hsv.s * 100, 10)
	hsv.v = parseInt(hsv.v * 100, 10)
	return hsv


Color.hexToInt = (hex) ->
	return parseInt(hex, 16)


Color.intToHex = (dec) ->
	result = (parseInt(dec, 10).toString(16))
	result = ("0" + result)  if result.length is 1
	return result.toUpperCase()


module.exports = Color