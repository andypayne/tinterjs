////////////////////////////////////////////////////////////////////////////////

let max3 = (x, y, z) => {
  if (x > y) {
    if (x > z) {
      return x
    } else {
      return z
    }
  } else if (y > z) {
    return y
  } else {
    return z
  }
}

let min3 = (x, y, z) => {
  if (x < y) {
    if (x < z) {
      return x
    } else {
      return z
    }
  } else if (y < z) {
    return y
  } else {
    return z
  }
}


////////////////////////////////////////////////////////////////////////////////

class Tinter {
  Tinter() {
  }

  rgbLightness(rgb) {
    let rs = rgb.substr(0, 2)
    let gs = rgb.substr(2, 2)
    let bs = rgb.substr(4, 2)
    let r01 = parseInt(rs, 16) / 255.0
    let g01 = parseInt(gs, 16) / 255.0
    let b01 = parseInt(bs, 16) / 255.0
    let maxC = max3(r01, g01, b01)
    let minC = min3(r01, g01, b01)
    return ((maxC + minC) / 2.0)
   }

  rgbHSLSaturation(rgb) {
    let rs = rgb.substr(0, 2)
    let gs = rgb.substr(2, 2)
    let bs = rgb.substr(4, 2)
    let r01 = parseInt(rs, 16) / 255.0
    let g01 = parseInt(gs, 16) / 255.0
    let b01 = parseInt(bs, 16) / 255.0
    let maxC = max3(r01, g01, b01)
    let minC = min3(r01, g01, b01)
    let chroma = maxC - minC
    let lightness = this.rgbLightness(rgb)
    if (chroma < 0.0001) {
      // TODO: ?
      return 0
    } else {
      return chroma / (1 - Math.abs(2 * lightness - 1))
    }
  }

  rgbHue(rgb) {
    let rs = rgb.substr(0, 2)
    let gs = rgb.substr(2, 2)
    let bs = rgb.substr(4, 2)
    let r01 = parseInt(rs, 16) / 255.0
    let g01 = parseInt(gs, 16) / 255.0
    let b01 = parseInt(bs, 16) / 255.0
    let maxC = max3(r01, g01, b01)
    let minC = min3(r01, g01, b01)
    let chroma = maxC - minC
    if (chroma < 0.0001) {
      // TODO: ?
      return 0
    } else if (maxC === r01) {
      return (((g01 - b01) / chroma) % 6.0)
    } else if (maxC === g01) {
      return ((b01 - r01) / chroma + 2.0)
    } else if (maxC === b01) {
      return ((r01 - g01) / chroma + 4.0)
    }
  }

  rgbToHSL(rgb) {
    if (rgb[0] === '#') {
      rgb = rgb.substr(1)
    }
    let hue = this.rgbHue(rgb)
    if (hue < 0) {
      hue += 6
    }
    //return [60.0 * this.rgbHue(rgb), this.rgbHSLSaturation(rgb), this.rgbLightness(rgb)]
    return [60.0 * hue, this.rgbHSLSaturation(rgb), this.rgbLightness(rgb)]
  }

  octetToStr(n) {
    let ns = n.toString(16)
    return (n < 0xA ? '0' + ns : ns)
  }

  rgbArrayToStr(rgb) {
    return '#' + rgb.map((v) => { return this.octetToStr(Math.trunc(v)) }).join('')
  }

  hslToRGB(hsl) {
    let hp = hsl[0] / 60.0
    let chroma = hsl[1] * (1 - Math.abs(2 * hsl[2] - 1))
    let x = chroma * (1 - Math.abs((hp % 2) - 1))
    let m = hsl[2] - (0.5 * chroma)
    let ir
    //if (hsl[0] === 0) ir = [0, 0, 0]
    //else
    if (hp >= 0 && hp < 1) ir = [chroma, x, 0]
    else if (hp >= 1 && hp < 2) ir = [x, chroma, 0]
    else if (hp >= 2 && hp < 3) ir = [0, chroma, x]
    else if (hp >= 3 && hp < 4) ir = [0, x, chroma]
    else if (hp >= 4 && hp < 5) ir = [x, 0, chroma]
    else if (hp >= 5 && hp < 6) ir = [chroma, 0, x]
    return ir.map((v, i) => {
      return 255.0*(v + m)
    })
  }

  // Tint (lighten) or shade (darken) by amt
  // Amt should be from [-1 to +1]
  // Negative values indicate a shade and positive values indicate a tint
  // 1 = 100%, -1 = -100%
  // The amount is added to or subtracted from the lightness
  // The RGB hex string is returned
  tintShade(rgb, amt) {
    let hsl = this.rgbToHSL(rgb)
    hsl[2] += amt
    // clamp
    if (hsl[2] > 1.0) {
      hsl[2] = 1.0
    } else if (hsl[2] < 0.0) {
      hsl[2] = 0.0
    }
    return this.rgbArrayToStr(this.hslToRGB(hsl))
  }

  hslComplement(hsl) {
    return [(hsl[0] + 180.0) % 360, hsl[1], hsl[2]]
  }

  complementary(rgb) {
    return this.rgbArrayToStr(this.hslToRGB(this.hslComplement(this.rgbToHSL(rgb))))
  }

  // Given an RGB triple, returns the remaining two 120-degree colors of the triad.
  triadColors(rgb) {
    let hsl = this.rgbToHSL(rgb)
    let t120 = this.rgbArrayToStr(this.hslToRGB([(hsl[0] + 120.0) % 360, hsl[1], hsl[2]]))
    let t240 = this.rgbArrayToStr(this.hslToRGB([(hsl[0] + 240.0) % 360, hsl[1], hsl[2]]))
    return [t120, t240]
  }

  // Given an RGB triple, returns the two 30-degree split complementary colors.
  splitComplementaries(rgb) {
    let hsl = this.rgbToHSL(rgb)
    let t150 = this.rgbArrayToStr(this.hslToRGB([(hsl[0] + 150.0) % 360, hsl[1], hsl[2]]))
    let t210 = this.rgbArrayToStr(this.hslToRGB([(hsl[0] + 210.0) % 360, hsl[1], hsl[2]]))
    return [t150, t210]
  }

  zeroHue(rgb) {
    let hsl = this.rgbToHSL(rgb)
    let zh = this.rgbArrayToStr(this.hslToRGB([0, hsl[1], hsl[2]]))
  }
}


////////////////////////////////////////////////////////////////////////////////

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { Tinter }
} else {
  window.Tinter = Tinter
}

