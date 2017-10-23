/* ***** color picker section ******** */

/*
 * Creation credit to Dario Corsi (reference: https://codepen.io/dariocorsi/pen/WwOWPE?editors=0010)
 * Uses tinycolor.js (reference: https://github.com/bgrins/TinyColor)
 * Hidden until triggered by clicking the paintbrush icon
 * A pop-up box appears allowing the user select colors and get corresponding HEX/RGB codes
*/

/* ************************************************************************
COLOR PICKER MODEL
************************************************************************* */

(function makeColorPickerModel() {
  var modeToggle = document.getElementById('mode-toggle');
  var colorIndicator = document.getElementById('color-indicator');

  var spectrumCanvas = document.getElementById('spectrum-canvas');
  var spectrumCtx = spectrumCanvas.getContext('2d');
  var spectrumCursor = document.getElementById('spectrum-cursor');
  var spectrumRect = spectrumCanvas.getBoundingClientRect();

  var hueCanvas = document.getElementById('hue-canvas');
  var hueCtx = hueCanvas.getContext('2d');
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

  window.app.colorpickerModel = {
    modeToggle,
    colorIndicator,
    spectrumCanvas,
    spectrumCtx,
    spectrumCursor,
    spectrumRect,
    hueCanvas,
    hueCtx,
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
  };
}());

/* ************************************************************************
COLOR PICKER VIEW
************************************************************************* */
(function makeColorPickerView() {
  const colorpicker = $('.color-picker-panel');

  function toggleColorPicker(e) {
    if (colorpicker.is(':visible') && !colorpicker.find(e.target).length) {
      colorpicker.fadeOut();
    } else if (!colorpicker.is(':visible') && e.target === $('.fa-paint-brush')[0]) {
      colorpicker.fadeIn();
    }
  }

  window.app.colorpickerView = {
    toggleColorPicker,
  };
}());
