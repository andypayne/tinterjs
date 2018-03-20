import test from 'ava'
import {Tinter} from './app/tinter'

let tinter = new Tinter()

test('rgbArrayToStr', t => {
  t.is(tinter.rgbArrayToStr([0x12, 0x34, 0x56]), '#123456')
  t.is(tinter.rgbArrayToStr([0xff, 0x00, 0xff]), '#ff00ff')
  t.is(tinter.rgbArrayToStr([0x00, 0x00, 0x00]), '#000000')
  t.is(tinter.rgbArrayToStr([0x01, 0x01, 0x01]), '#010101')
  t.is(tinter.rgbArrayToStr([0xb, 0x1, 0x2]), '#0b0102')
})

test('rgbToHSL 1', t => {
  let hsl = tinter.rgbToHSL('#336699')
  t.is(hsl[0], 210)
  t.is(Math.abs(hsl[1] - 0.5) < 0.0001, true)
  t.is(Math.abs(hsl[2] - 0.4) < 0.0001, true)
})

test('rgbToHSL 2', t => {
  let hsl = tinter.rgbToHSL('#ff00ff')
  t.is(hsl[0], 300)
  t.is(Math.abs(hsl[1] - 1) < 0.0001, true)
  t.is(Math.abs(hsl[2] - 0.5) < 0.0001, true)
})

test('rgbToHSL 3', t => {
  let hsl = tinter.rgbToHSL('#c0392b')
  t.is(hsl[0], 6)
  t.is(Math.abs(Math.round(1000*hsl[1])/1000 - 0.634) < 0.0001, true)
  t.is(Math.abs(Math.round(1000*hsl[2])/1000 - 0.461) < 0.0001, true)
})

test('hslToRGB', t => {
  t.is(tinter.rgbArrayToStr(tinter.hslToRGB([300, 1, 0.5])), '#ff00ff')
})

test('addColorsRGB', t => {
  t.is(tinter.addColorsRGB('#333333', '#336699', 0.2), '#333d47')
  t.is(tinter.addColorsRGB('#000000', '#AA3939', 0.2), '#220b0b')
})

test('similarColors', t => {
  t.is(tinter.similarColors('#000000', '#000001'), true)
  t.is(tinter.similarColors('#000000', '#010000'), true)
  t.is(tinter.similarColors('#000000', '#020202'), true)
  t.is(tinter.similarColors('#000000', '#030202'), false)
  t.is(tinter.similarColors('#000000', '#020302'), false)
  t.is(tinter.similarColors('#000000', '#020203'), false)
})

test('analogous', t => {
  let ancs = tinter.analogous('#674172')
  t.is(tinter.similarColors(ancs[0], '#734165'), true)
  t.is(tinter.similarColors(ancs[1], '#4f4173'), true)
})


