import test from 'ava'
import {Tinter} from './app/tinter'

let tinter = new Tinter()

test('rgbArrayToStr', t => {
  t.is(tinter.rgbArrayToStr([0x12, 0x34, 0x56]), '#123456')
  t.is(tinter.rgbArrayToStr([0xff, 0x00, 0xff]), '#ff00ff')
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

test('hslToRGB', t => {
  t.is(tinter.rgbArrayToStr(tinter.hslToRGB([300, 1, 0.5])), '#ff00ff')
})

