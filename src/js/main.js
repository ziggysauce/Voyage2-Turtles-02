/*
The general software architecture pattern used here is known as Model-View-Controller (aka MVC).
reference: https://www.youtube.com/watch?v=fa8eUcu30Lw

Each individual component (Model, View or Controller)
is designed using the Revealing Module Pattern.
reference: https://www.youtube.com/watch?v=pOfwp6VlnlM
*/

/* ************************************************************************
MODEL
************************************************************************* */

(function makeModel() {
  const pomodoroStatus = {
    isActive: false, // whether or not the pomodoro clock is on or off
    isOnBreak: false, // whether or not the pomodoro clock is in work mode or break mode
  };

  // allows controller to access these variables
  function getPomodoroStatus() {
    return pomodoroStatus;
  }

  let pomodoroStartTime;

  function togglePomodoro() {
    pomodoroStatus.isActive = !pomodoroStatus.isActive;
    if (pomodoroStatus.isActive) {
      pomodoroStatus.isOnBreak = false;
      pomodoroStartTime = performance.now();
    }
  }

  // converts milliseconds into minutes and seconds
  function minutesAndSeconds(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return seconds == 60 ? `${minutes + 1}:00` : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const workPeriod = 60000; // eventually these variables will be set by user
  const breakPeriod = 60000;

  // basic pomodoro functionality
  function pomodoroCycle() {
    const period = pomodoroStatus.isOnBreak ? breakPeriod : workPeriod;
    const countdown = period - (performance.now() - pomodoroStartTime);
    if (countdown < 1000) {
      pomodoroStatus.isOnBreak = !pomodoroStatus.isOnBreak;
      pomodoroStartTime = performance.now() + 3500;
      return 0;
    }
    return countdown;
  }

  function getTime() {
    const time = new Date();
    return time.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  // basic web audio API context. reference: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
  const audio = new AudioContext();

  // basic web audio API playback function. reference: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
  function triggerSound(buffer) {
    const source = audio.createBufferSource();
    source.buffer = buffer;
    source.connect(audio.destination);
    source.start(0);
  }

  window.app = {}; // creates app object as porperty of global object
  window.app.model = { // creates model object as property of app
    getPomodoroStatus,
    togglePomodoro,
    minutesAndSeconds,
    pomodoroCycle,
    getTime,
    audio,
    triggerSound,
  };
}());

/* ************************************************************************
VIEW
************************************************************************* */

(function makeView() {
  function togglePomodoro(pomodoroIsActive) {
    if (pomodoroIsActive) {
      $('.toggle-pomodoro button').text('Stop Pomodoro Cycle');
    } else if (!pomodoroIsActive) {
      $('.toggle-pomodoro button').text('Start Pomodoro Cycle');
    }
  }

  function updateTime(time) {
    $('.time-display p').text(time);
  }

  function updateCountdown(countdown, task) {
    $('.time-display p').text(`${countdown} ${task}`);
  }

  window.app.view = {
    togglePomodoro,
    updateTime,
    updateCountdown,
  };
}());

/* ************************************************************************
CONTROLLER
************************************************************************* */

(function makeController(model, view) {
/* ***** pomodoro section ******** */

  function togglePomodoro() {
    model.togglePomodoro();
    view.togglePomodoro(model.getPomodoroStatus().isActive);
  }

  // continuous loop that updates clock display. reference https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  function clocksHandler() {
    if (!model.getPomodoroStatus().isActive) {
      view.updateTime(model.getTime());
      requestAnimationFrame(clocksHandler);
    } else if (model.getPomodoroStatus().isActive) {
      const countdown = model.minutesAndSeconds(model.pomodoroCycle());
      const task = model.getPomodoroStatus().isOnBreak ? 'break' : 'work';

      view.updateCountdown(countdown, task);

      if (countdown == '0:00') {
        model.triggerSound(model.alarm);
        setTimeout(() => {
          requestAnimationFrame(clocksHandler);
        }, 3000);
      } else {
        requestAnimationFrame(clocksHandler);
      }
    }
  }

  // basic web audio API audio loading function. reference: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
  // free sound effects from soundbible.com
  function loadSounds() {
    const request = new XMLHttpRequest();
    const audioUrl = '/assets/audio/alarm.mp3';

    request.open('GET', audioUrl);
    request.responseType = 'arraybuffer';
    request.onload = function onload() {
      model.audio.decodeAudioData(request.response, (buffer) => {
        model.alarm = buffer;
      });
    };
    request.send();
  }

  /* ***** user greeting section ******** */

  const userName = () => localStorage.getItem('userName');
  const nameInput = $('#name-input');
  const greeting = $('.user-greeting h1');

  function showGreeting() {
    if (userName()) {
      $('.user-greeting h1').html(`Hello, <button>${userName()}</button>.`);
    } else {
      $('.user-greeting h1').html('Hello. What\'s your <button>name</button>?');
    }
    nameInput.hide().val('').blur();
    greeting.show();
  }

  function showNameInput() {
    nameInput.show().focus();
    greeting.hide();
  }

  function setUserName(e) {
    if (e.keyCode == 13) { // 'enter' key
      localStorage.setItem('userName', $(e.target).val()); // set local storage item to value of text input
      showGreeting();
    }
  }

  function toggleNameInput(e) {
    if (nameInput.is(':visible') && e.target !== nameInput[0]) {
      showGreeting();
    } else if (!nameInput.is(':visible') && e.target === $('.user-greeting button')[0]) {
      showNameInput();
    }
  }

  function setupEventListeners() {
    $(window).on('click', toggleNameInput);
    $('#name-input').on('keyup', setUserName);
    $('.toggle-pomodoro button').on('click', togglePomodoro);
  }

  function initialize() {
    showGreeting();
    $('.time-display p').text(model.getTime());
    setupEventListeners();
    loadSounds();
    clocksHandler();
  }

  window.app.controller = {
    initialize,
  };
}(window.app.model, window.app.view));

window.app.controller.initialize();

/* ***** color picker section ******** */

/*
 * Creation credit to Dario Corsi (reference: https://codepen.io/dariocorsi/pen/WwOWPE?editors=0010)
 * Uses tinycolor.js (reference: https://github.com/bgrins/TinyColor)
 * Hidden until triggered by clicking the paintbrush icon
 * A pop-up box appears allowing the user select colors and get corresponding HEX/RGB codes
*/

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

var red = document.getElementById('red');
var blue = document.getElementById('blue');
var green = document.getElementById('green');
var hex = document.getElementById('hex');

function refreshElementRects() {
  spectrumRect = spectrumCanvas.getBoundingClientRect();
  hueRect = hueCanvas.getBoundingClientRect();
}

function colorToHue(color) {
  var color = tinycolor(color);
  var hueString = tinycolor('hsl '+ color.toHsl().h + ' 1 .5').toHslString();
  return hueString;
}

function setColorValues(color) {
  // convert to tinycolor object
  var color = tinycolor(color);
  var rgbValues = color.toRgb();
  var hexValue = color.toHex();
  // set inputs
  red.value = rgbValues.r;
  green.value = rgbValues.g;
  blue.value = rgbValues.b;
  hex.value = hexValue;
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

function getSpectrumColor(e) {
  // reference: http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
  e.preventDefault();
  // get x/y coordinates
  let x = e.pageX - spectrumRect.left;
  let y = e.pageY - spectrumRect.top;
  // constrain x max
  if (x > spectrumRect.width) { x = spectrumRect.width; }
  if (x < 0) { x = 0; }
  if (y > spectrumRect.height) { y = spectrumRect.height; }
  if (y < 0) { y = 0.1; }
  // convert between hsv and hsl
  const xRatio = (x / spectrumRect.width) * 100;
  const yRatio = (y / spectrumRect.height) * 100;
  const hsvValue = 1 - (yRatio / 100);
  const hsvSaturation = xRatio / 100;
  lightness = (hsvValue / 2) * (2 - hsvSaturation);
  saturation = (hsvValue * hsvSaturation) / (1 - Math.abs((2 * lightness) - 1));
  const color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness);
  setCurrentColor(color);
  setColorValues(color);
  updateSpectrumCursor(x, y);
}

function endGetSpectrumColor() {
  spectrumCursor.classList.remove('dragging');
  window.removeEventListener('mousemove', getSpectrumColor);
}

const startGetSpectrumColor = (e) => {
  getSpectrumColor(e);
  spectrumCursor.classList.add('dragging');
  window.addEventListener('mousemove', getSpectrumColor);
  window.addEventListener('mouseup', endGetSpectrumColor);
};

function createShadeSpectrum(color) {
  const canvas = spectrumCanvas;
  const ctx = spectrumCtx;
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

  canvas.addEventListener('mousedown', (e) => {
    startGetSpectrumColor(e);
  });
}

function getHueColor(e) {
  e.preventDefault();
  let y = e.pageY - hueRect.top;
  if (y > hueRect.height) { y = hueRect.height; }
  if (y < 0) { y = 0; }
  const percent = y / hueRect.height;
  hue = 360 - (360 * percent);
  const hueColor = tinycolor('hsl '+ hue + ' 1 .5').toHslString();
  const color = tinycolor('hsl '+ hue + ' ' + saturation + ' ' + lightness).toHslString();
  createShadeSpectrum(hueColor);
  updateHueCursor(y, hueColor)
  setCurrentColor(color);
  setColorValues(color);
}

function endGetHueColor() {
  hueCursor.classList.remove('dragging');
  window.removeEventListener('mousemove', getHueColor);
}

function startGetHueColor(e) {
  getHueColor(e);
  hueCursor.classList.add('dragging');
  window.addEventListener('mousemove', getHueColor);
  window.addEventListener('mouseup', endGetHueColor);
}

function createHueSpectrum() {
  const canvas = hueCanvas;
  const ctx = hueCtx;
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
  canvas.addEventListener('mousedown', (e) => {
    startGetHueColor(e);
  });
}

function colorToPos(color) {
  var color = tinycolor(color);
  const hsl = color.toHsl();
  hue = hsl.h;
  const hsv = color.toHsv();
  const x = spectrumRect.width * hsv.s;
  const y = spectrumRect.height * (1 - hsv.v);
  const hueY = hueRect.height - ((hue / 360) * hueRect.height);
  updateSpectrumCursor(x, y);
  updateHueCursor(hueY);
  setCurrentColor(color);
  createShadeSpectrum(colorToHue(color));
}

// Add event listeners

red.addEventListener('change', () => {
  const color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value );
  colorToPos(color);
});

green.addEventListener('change', () => {
  const color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value );
  colorToPos(color);
});

blue.addEventListener('change', () => {
  const color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value );
  colorToPos(color);
});

modeToggle.addEventListener('click', () => {
  if (rgbFields.classList.contains('active') ? rgbFields.classList.remove('active') : rgbFields.classList.add('active'));
  if (hexField.classList.contains('active') ? hexField.classList.remove('active') : hexField.classList.add('active'));
});

window.addEventListener('resize', () => {
  refreshElementRects();
});

function ColorPicker() {
  createShadeSpectrum();
  createHueSpectrum();
}

ColorPicker();
$('.color-picker-panel').hide();

// Create click event for color picker button
$('.color-picker-icon').click(() => {
  $('.color-picker-panel').fadeToggle(300);
});

/* ***** Background Image Rotation ******** */

/*
 * Background images change every time tab is opened or page is refreshed
 * Background images categorized into daytime (7AM-6:59PM) and nighttime (7PM-6:59AM)
 * Background image shown depends on user's local time (day/night)
*/

// Store background picture information (day/night, authors, links)
const dayPicAuthors = [
  'Eberhard Grossgasteiger',
  'Unknown',
  'Unknown',
  'Alex Mihis',
  'Paul Ijsendoorn',
  'CC0 Creative Commons',
  'CC0 Creative Commons',
  'Mateusz Dach',
  'Matt Read',
  'CC0 Creative Commons',
  'Jonathan Peterson',
  'Jonathan Peterson',
  'Despierres Cecile',
  'Flo Dahm',
  'CC0 Creative Commons',
  'Uncoated',
  'Margerretta',
  'Pixabay',
  'freestocks',
  'Daniel Frank',
  'Alexandre Perotto',
  'Maria Portelles',
];
const dayPicLinks = [
  'https://www.pexels.com/u/eberhardgross/',
  '',
  '',
  'https://www.pexels.com/u/mcraftpix/',
  'https://www.pexels.com/u/paul-ijsendoorn-148531/',
  'https://pixabay.com/en/bled-slovenia-lake-mountains-1899264/',
  'https://pixabay.com/en/sand-dunes-ripples-wind-wilderness-1550396/',
  'https://www.pexels.com/u/mateusz-dach-99805/',
  'https://www.pexels.com/u/matt-read-14552/',
  'https://pixabay.com/en/gleise-old-railroad-tracks-seemed-1555348/',
  'https://www.pexels.com/u/grizzlybear/',
  'https://www.pexels.com/u/grizzlybear/',
  'https://www.pexels.com/u/despierres-cecile-93261/',
  'https://www.pexels.com/u/flo-dahm-154317/',
  'https://pixabay.com/en/beach-rocks-water-sky-east-sunset-1336083/',
  'https://www.pexels.com/u/uncoated/',
  'https://www.pexels.com/u/margerretta-157232/',
  'https://www.pexels.com/u/pixabay/',
  'https://www.pexels.com/u/freestocks/',
  'https://www.pexels.com/u/fr3nks/',
  'https://www.pexels.com/u/alexandre-perotto-44133/',
  'https://www.pexels.com/u/helioz/',
];

const nightPicAuthors = [
  'Unknown',
  'skeeze',
  'Nout Gons',
  'Josh Sorenson',
  'CC0 Creative Commons',
  'Eberhard Grossgasteiger',
  'CC0 Creative Commons',
  'Ales Krivec',
  'Priseom',
  'CC0 Creative Commons',
  'CC0 Creative Commons',
  'CC0 Creative Commons',
  'Nikolai Ulltang',
  'Snapwire',
  'Pixabay',
  'Kaique Rocha',
  'Pixabay',
  'Mateusz Dach',
  'Uncoated',
  'Kaique Rocha',
  'Photo Collections',
  'Pixabay',
];
const nightPicLinks = [
  '',
  'https://pixabay.com/en/milky-way-night-landscape-1669986/',
  'https://www.pexels.com/u/nout-gons-80280/',
  'https://www.pexels.com/u/joshsorenson/',
  'https://pixabay.com/en/maldives-pier-dock-lights-bay-1768714/',
  'https://www.pexels.com/u/eberhardgross/',
  'https://pixabay.com/en/fog-dawn-landscape-morgenstimmung-1494433/',
  'https://www.pexels.com/u/ales-krivec-166939/',
  'https://www.pexels.com/u/priseom-39551/',
  'https://pixabay.com/en/storm-weather-atmosphere-cold-front-2211333/',
  'https://pixabay.com/en/winter-sun-sun-so-sunbeam-sunset-1547273/',
  'https://pixabay.com/en/autumn-fog-colorful-leaves-nature-1127616/',
  'https://www.pexels.com/u/ulltangfilms/',
  'https://www.pexels.com/u/snapwire/',
  'https://www.pexels.com/u/pixabay/',
  'https://www.pexels.com/u/kaiquestr/',
  'https://www.pexels.com/u/pixabay/',
  'https://www.pexels.com/u/mateusz-dach-99805/',
  'https://www.pexels.com/u/uncoated/',
  'https://www.pexels.com/u/kaiquestr/',
  'https://www.pexels.com/u/photocollections/',
  'https://www.pexels.com/u/pixabay/',
];

const randomNum = Math.floor(Math.random() * 22);

/* Function gets user's local time and converts to an integer (1-24)
 * Between 7-19 indicates day time
 * Between 1-7 and 19-24 indicates night time
 * Randomly selects background image and associated author and reference link for page
 */
function bgChange() {
  const curTime = new Date();
  const picTime = parseInt(curTime.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }), 10);
  if (picTime > 6 && picTime < 19) {
    $('body').css('background-image', `url('../assets/img/dayPics/sample${randomNum}.jpeg')`);
    $('.credits p a').attr('href', dayPicLinks[randomNum]);
    $('#pic-author').text(dayPicAuthors[randomNum]);
  } else {
    $('body').css('background-image', `url('../assets/img/nightPics/sample${randomNum}.jpeg')`);
    $('#pic-author').attr('href', nightPicLinks[randomNum]);
    $('#pic-author').text(nightPicAuthors[randomNum]);
  }
}

bgChange();
