/**
 * @author kyle / http://nikai.us/
 */

import Canvas from '../Canvas'

/**
 * Category
 * @param {Object} [options]   Available options:
 *                             {Object} gradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)'}
 */
function Intensity (options) {
  options = options || {}
  this.gradient = options.gradient
  this.maxSize = options.maxSize || 35
  this.minSize = options.minSize || 0
  this.max = options.max || 100
  this.min = options.min || 0
  this.initPalette()
}

Intensity.prototype.setMax = function (value) {
  this.max = value || 100
}

Intensity.prototype.setMin = function (value) {
  this.min = value || 0
}

Intensity.prototype.setMaxSize = function (maxSize) {
  this.maxSize = maxSize || 35
}

Intensity.prototype.setMinSize = function (minSize) {
  this.minSize = minSize || 0
}

Intensity.prototype.initPalette = function () {
  var gradient = this.gradient

  var canvas = new Canvas(256, 1)

  var paletteCtx = this.paletteCtx = canvas.getContext('2d')

  var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1)

  gradient.forEach(item => {
    let stopColor = item.color
    if (Object.prototype.toString.call(stopColor) === '[object Array]') {
      stopColor = stopColor[0]
    }

    lineGradient.addColorStop(parseFloat(item.key), stopColor)
  })

  paletteCtx.fillStyle = lineGradient
  paletteCtx.fillRect(0, 0, 256, 1)
}

Intensity.prototype.getColor = function (value) {
  var imageData = this.getImageData(value)
  return 'rgba(' + imageData[0] + ', ' + imageData[1] + ', ' + imageData[2] + ', ' + imageData[3] / 256 + ')'
}

Intensity.prototype.getImageData = function (value) {
  var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data

  if (value === undefined) {
    return imageData
  }

  var max = this.max
  var min = this.min

  if (value > max) {
    value = max
  }

  if (value < min) {
    value = min
  }

  // Math.floor((value - min) / (max - min) * (256 - 1)) 获取当前值占比整个 canvas 长度的比例
  // 1 像素 = 4 个数组元素 r,g,b,a 组成，所以这里乘以 4
  var index = Math.floor((value - min) / (max - min) * (256 - 1)) * 4

  return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]]
}

/**
 * @param Number value
 * @param Number max of value
 * @param Number max of size
 * @param Object other options
 */
Intensity.prototype.getSize = function (value) {
  var size = 0
  var max = this.max
  var min = this.min
  var maxSize = this.maxSize
  var minSize = this.minSize

  if (value > max) {
    value = max
  }

  if (value < min) {
    value = min
  }

  size = minSize + (value - min) / (max - min) * (maxSize - minSize)

  return size
}

Intensity.prototype.getLegend = function (options) {
  var gradient = this.gradient
  var width = options.width || 20
  var height = options.height || 180

  var canvas = new Canvas(width, height)

  var paletteCtx = canvas.getContext('2d')

  var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0)

  console.log(gradient)
  for (var key in gradient) {
    lineGradient.addColorStop(parseFloat(key), gradient[key])
  }

  paletteCtx.fillStyle = lineGradient
  paletteCtx.fillRect(0, 0, width, height)

  return canvas
}

Intensity.prototype.getTextColor = function (splitList, count) {
  return splitList.find(split => {
    if (count >= split.start & count <= split.end) {
      return split.value
    }
  })
}

export default Intensity
