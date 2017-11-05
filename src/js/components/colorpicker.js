
/*
 * Creation credit to Dario Corsi (reference: https://codepen.io/dariocorsi/pen/WwOWPE?editors=0010)
 * Uses tinycolor.js (reference: https://github.com/bgrins/TinyColor)
 * Hidden until triggered by clicking the paintbrush icon
 * A pop-up box appears allowing the user select colors and get corresponding HEX/RGB/HSL codes
*/

/* ************************************************************************
COLOR PICKER MODEL
************************************************************************* */

(function makeColorPickerModel() {
  var modeToggle = document.getElementById('mode-toggle');
  var colorIndicator = document.getElementById('color-indicator');

  var spectrumCanvas = document.getElementById('spectrum-canvas');
  var spectrumCursor = document.getElementById('spectrum-cursor');
  var spectrumRect = spectrumCanvas.getBoundingClientRect();

  var hueCanvas = document.getElementById('hue-canvas');
  var hueCursor = document.getElementById('hue-cursor');
  var hueRect = hueCanvas.getBoundingClientRect();

  var hue = 0;
  var saturation = 1;
  var lightness = 0.5;

  var rgbFields = document.getElementById('rgb-fields');
  var hexField = document.getElementById('hex-field');
  var hslFields = document.getElementById('hsl-fields');

  var red = document.getElementById('red');
  var blue = document.getElementById('blue');
  var green = document.getElementById('green');
  var hex = document.getElementById('hex');
  var huedisplay = document.getElementById('huedisplay');
  var saturationdisplay = document.getElementById('saturationdisplay');
  var lightnessdisplay = document.getElementById('lightnessdisplay');

  function colorToHue(color) {
    var color = tinycolor(color);
    var hueString = tinycolor('hsl '+ color.toHsl().h + ' 1 .5').toHslString();
    return hueString;
  }

  function setColorValues(color) {
    // convert to tinycolor object
    var color = tinycolor(color);
    var rgbValues = color.toRgb();
    var hexValue = "#" + color.toHex();
    var hslValues = color.toHsl();
    // set inputs
    red.value = rgbValues.r;
    green.value = rgbValues.g;
    blue.value = rgbValues.b;
    hex.value = hexValue;
    huedisplay.value = Math.round(hslValues.h);
    saturationdisplay.value = Math.round(hslValues.s * 100);
    lightnessdisplay.value = Math.round(hslValues.l * 100);
  }

  function setCurrentColor(color) {
    color = tinycolor(color);
    colorIndicator.style.backgroundColor = color;
    spectrumCursor.style.backgroundColor = color;
    hueCursor.style.backgroundColor = 'hsl('+ color.toHsl().h +', 100%, 50%)';
  }

  function updateHueCursor(y) {
    hueCursor.style.top = y + 'px';
  }

  function updateSpectrumCursor(x, y) {
    // assign position
    spectrumCursor.style.left = x + 'px';
    spectrumCursor.style.top = y + 'px';
  }

  window.app.colorpickerModel = {
    modeToggle,
    spectrumCanvas,
    spectrumCursor,
    spectrumRect,
    hueCanvas,
    hueCursor,
    hueRect,
    hue,
    saturation,
    lightness,
    rgbFields,
    hexField,
    hslFields,
    red,
    blue,
    green,
    hex,
    huedisplay,
    saturationdisplay,
    lightnessdisplay,
    colorToHue,
    setColorValues,
    setCurrentColor,
    updateHueCursor,
    updateSpectrumCursor,
  };
}());

/* ************************************************************************
COLOR PICKER VIEW
************************************************************************* */
(function makeColorPickerView() {
  const colorpicker = $('.color-picker-panel');

  function toggleColorPicker(e) {
    if (colorpicker.is(':visible') && !colorpicker.find(e.target).length && e.target !== colorpicker[0]) {
      colorpicker.fadeOut();
    } else if (!colorpicker.is(':visible') && e.target === $('.fa-paint-brush')[0]) {
      colorpicker.fadeIn();
    }
  }

  function createShadeSpectrum(color) {
    const canvas = document.getElementById('spectrum-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!color) { color = '#f00'; }
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    whiteGradient.addColorStop(0, '#fff');
    whiteGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    blackGradient.addColorStop(0, 'transparent');
    blackGradient.addColorStop(1, '#000');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function createHueSpectrum() {
    const canvas = document.getElementById('hue-canvas');
    const ctx = canvas.getContext('2d');
    const hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    hueGradient.addColorStop(0.00, 'hsl(0,100%,50%)');
    hueGradient.addColorStop(0.17, 'hsl(298.8, 100%, 50%)');
    hueGradient.addColorStop(0.33, 'hsl(241.2, 100%, 50%)');
    hueGradient.addColorStop(0.50, 'hsl(180, 100%, 50%)');
    hueGradient.addColorStop(0.67, 'hsl(118.8, 100%, 50%)');
    hueGradient.addColorStop(0.83, 'hsl(61.2,100%,50%)');
    hueGradient.addColorStop(1.00, 'hsl(360,100%,50%)');
    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  window.app.colorpickerView = {
    toggleColorPicker,
    createShadeSpectrum,
    createHueSpectrum,
  };
}());
