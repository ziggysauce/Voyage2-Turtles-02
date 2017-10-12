/*
The general software architecture pattern used here is known as Model-View-Controller (aka MVC).
reference: https://www.youtube.com/watch?v=fa8eUcu30Lw

Each individual component (Model, View or Controller)
is designed using the Revealing Module Pattern.
reference: https://www.youtube.com/watch?v=pOfwp6VlnlM
*/

/* ************************************************************************
POMODORO MODEL
************************************************************************ */
(function makePomodoroModel() {
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
  window.app.pomodoroModel = { // creates model object as property of app
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
POMODORO VIEW
************************************************************************* */
(function makePomodoroView() {
  const button = $('.toggle-pomodoro button');
  const display = $('.time-display p');

  function togglePomodoro(pomodoroIsActive) {
    if (pomodoroIsActive) {
      button.text('Stop Pomodoro Cycle');
    } else if (!pomodoroIsActive) {
      button.text('Start Pomodoro Cycle');
    }
  }

  function updateTime(time) {
    display.text(time);
  }

  function updateCountdown(countdown, task) {
    display.text(`${countdown} ${task}`);
  }

  window.app.pomodoroView = {
    togglePomodoro,
    updateTime,
    updateCountdown,
  };
}());
/* ************************************************************************
USER GREETING MODEL
************************************************************************* */
(function makeGreetingModel() {
  const setUserName = name => localStorage.setItem('userName', name);
  const getUserName = () => localStorage.getItem('userName');

  window.app.greetingModel = {
    setUserName,
    getUserName,
  };
}());
/* ************************************************************************
USER GREETING VIEW
************************************************************************* */
(function makeGreetingView() {
  const nameForm = $('#name-form');
  const nameInput = $('#name-input');
  const greeting = $('.user-greeting h1');

  function showGreeting(userName) {
    if (userName) {
      greeting.html(`Hello, <button>${userName}</button>.`);
    } else {
      greeting.html('Hello. What\'s your <button>name</button>?');
    }
    nameForm.hide();
    nameInput.val('').blur();
    greeting.show();
  }

  function showNameInput() {
    nameForm.show();
    nameInput.focus();
    greeting.hide();
  }

  function toggleNameInput(userName) {
    return function handler(e) {
      if (nameInput.is(':visible') && e.target !== nameInput[0]) {
        showGreeting(userName);
      } else if (!nameInput.is(':visible') && e.target === $('.user-greeting button')[0]) {
        showNameInput();
      }
    };
  }

  window.app.greetingView = {
    showGreeting,
    showNameInput,
    toggleNameInput,
  };
}());
/* ************************************************************************
NEWSFEED MODEL
************************************************************************* */
(function makeNewsfeedModel() {
  const APIKey = 'dcbb5b4e58ce4a95941e5a3f5ba1c9b8';
  const sources = ['hacker-news', 'recode', 'techcrunch'];
  const articlesList = [];

  window.app.newsfeedModel = {
    APIKey,
    sources,
    articlesList,
  };
}());
/* ************************************************************************
NEWSFEED VIEW
************************************************************************* */
(function makeNewsfeedView() {
  const newsfeedWrapper = $('.newsfeed-wrapper');

  function toggleNewsfeed(e) {
    if (newsfeedWrapper.is(':visible') && e.target !== newsfeedWrapper[0]) {
      newsfeedWrapper.fadeOut();
    } else if (!newsfeedWrapper.is(':visible') && e.target === $('.fa-newspaper-o')[0]) {
      newsfeedWrapper.fadeIn();
    }
  }

  function generateArticle(source, url, image, title, author) {
    author = author == null ? 'unnamed author' : author.toLowerCase().replace(/^by/, '');
    image = image == null ? './assets/img/scuba-turtle.png' : image;

    return `
      <li class="article">
      <a class="article-image" href="${url}" style="background-image: url(${image})" target="_blank">
      </a>
      <div class"artcle-body">
        <a class="headline" href="${url}" target="_blank">${title}</a>
        <p class="source">${author} - ${source}</p>
      </div>
    </li>
    `;
  }

  function append(sourceArticles) {
    $('.newsfeed').append(`${sourceArticles}`);
  }

  window.app.newsfeedView = {
    toggleNewsfeed,
    generateArticle,
    append,
  };
}());
/* ************************************************************************
CONTROLLER
************************************************************************* */
(function makeController(
  pomodoroModel,
  pomodoroView,
  greetingModel,
  greetingView,
  newsfeedModel,
  newsfeedView,
) {
/* ***** POMODORO SECTION ******** */

  function togglePomodoro() {
    pomodoroModel.togglePomodoro();
    pomodoroView.togglePomodoro(pomodoroModel.getPomodoroStatus().isActive);
  }

  // continuous loop that updates clock display. reference https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  function clocksHandler() {
    if (!pomodoroModel.getPomodoroStatus().isActive) {
      pomodoroView.updateTime(pomodoroModel.getTime());
      requestAnimationFrame(clocksHandler);
    } else if (pomodoroModel.getPomodoroStatus().isActive) {
      const countdown = pomodoroModel.minutesAndSeconds(pomodoroModel.pomodoroCycle());
      const task = pomodoroModel.getPomodoroStatus().isOnBreak ? 'break' : 'work';

      pomodoroView.updateCountdown(countdown, task);

      if (countdown == '0:00') {
        pomodoroModel.triggerSound(pomodoroModel.alarm);
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
    const audioUrl = './assets/audio/alarm.mp3';

    request.open('GET', audioUrl);
    request.responseType = 'arraybuffer';
    request.onload = function onload() {
      pomodoroModel.audio.decodeAudioData(request.response, (buffer) => {
        pomodoroModel.alarm = buffer;
      });
    };
    request.send();
  }

  /* ***** USER GREETING SECTION ******** */

  function setUserName(e) {
    e.preventDefault();
    greetingModel.setUserName($('#name-input').val());
    greetingView.showGreeting(greetingModel.getUserName());
  }

  function toggleNameInput() {
    return greetingView.toggleNameInput(greetingModel.getUserName());
  }

  /* ******** NEWSFEED SECTION ******* */

  function loadNewsArticles() {
    newsfeedModel.sources.forEach((source) => {
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://newsapi.org/v1/articles?source=${source}&sortBy=top&apiKey=${newsfeedModel.APIKey}`,
        method: 'GET',
      };

      $.ajax(settings).done((response) => {
        const content = response.articles.map((article) => {
          return newsfeedView.generateArticle(
            response.source,
            article.url,
            article.urlToImage,
            article.title,
            article.author,
          );
        });
        newsfeedView.append(`${content.filter((item, index) => index < 3).join('\r\n')}`);
      });
    });
  }

  /* ********* GENERAL ************ */

  function setupEventListeners() {
    $(window).on('click', toggleNameInput())
      .on('click', newsfeedView.toggleNewsfeed);
    $('#name-form').on('submit', setUserName);
    $('.toggle-pomodoro button').on('click', togglePomodoro);
  }

  function initialize() {
    greetingView.showGreeting(greetingModel.getUserName());
    $('.time-display p').text(pomodoroModel.getTime());
    setupEventListeners();
    loadSounds();
    loadNewsArticles();
    clocksHandler();
  }

  window.app.controller = {
    initialize,
  };
}(
  window.app.pomodoroModel,
  window.app.pomodoroView,
  window.app.greetingModel,
  window.app.greetingView,
  window.app.newsfeedModel,
  window.app.newsfeedView,
));

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
var hslFields = document.getElementById('hsl-fields');

var red = document.getElementById('red');
var blue = document.getElementById('blue');
var green = document.getElementById('green');
var hex = document.getElementById('hex');
var huedisplay = document.getElementById('huedisplay');
var saturationdisplay = document.getElementById('saturationdisplay');
var lightnessdisplay = document.getElementById('lightnessdisplay');

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

hex.addEventListener('change', () => {
  let color = tinycolor('#' + hex.value );
  colorToPos(color);
});

huedisplay.addEventListener('change', () => {
  const color = tinycolor('hsl ' + huedisplay.value + ' ' + saturationdisplay.value + ' ' + lightnessdisplay.value );
  colorToPos(color);
});

saturationdisplay.addEventListener('change', () => {
  const color = tinycolor('hsl ' + huedisplay.value + ' ' + saturationdisplay.value + ' ' + lightnessdisplay.value );
  colorToPos(color);
});

lightnessdisplay.addEventListener('change', () => {
  const color = tinycolor('hsl ' + huedisplay.value + ' ' + saturationdisplay.value + ' ' + lightnessdisplay.value );
  colorToPos(color);
});

modeToggle.addEventListener('click', () => {
  if (rgbFields.classList.contains('active')) {
    rgbFields.classList.remove('active');
    hexField.classList.add('active');
  } else if (hexField.classList.contains('active')) {
    hexField.classList.remove('active');
    hslFields.classList.add('active');
  } else if (hslFields.classList.contains('active')) {
    hslFields.classList.remove('active');
    rgbFields.classList.add('active');
  }
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

// Create click event to open color picker when icon is clicked
$('.color-picker-icon').click((e) => {
  $('.color-picker-panel').fadeToggle(300);
  e.stopPropagation();
  return false;
});

// Create click event to close color picker when clicked anywhere else
$(document).click((e) => {
  if (e.target.className !== 'colorPalette' && !$('.colorPalette').find(e.target).length) {
    $('.color-picker-panel').fadeOut(300);
  }
});

/* ***** Background Image Rotation ******** */

/*
 * Background images change every time tab is opened or page is refreshed
 * Background images categorized into daytime (7AM-6:59PM) and nighttime (7PM-6:59AM)
 * Background image shown depends on user's local time (day/night)
*/

// Store background picture information (day/night, authors, links)
const bgInfo = [
  {
    day: {
      author: 'Eberhard Grossgasteiger',
      url: 'https://www.pexels.com/u/eberhardgross/',
    },
    night: {
      author: 'Unknown',
      url: '',
    },
  },
  {
    day: {
      author: 'unknown',
      url: '',
    },
    night: {
      author: 'skeeze',
      url: 'https://pixabay.com/en/milky-way-night-landscape-1669986/',
    },
  },
  {
    day: {
      author: 'unknown',
      url: '',
    },
    night: {
      author: 'Nout Gons',
      url: 'https://www.pexels.com/u/nout-gons-80280/',
    },
  },
  {
    day: {
      author: 'Alex Mihis',
      url: 'https://www.pexels.com/u/mcraftpix/',
    },
    night: {
      author: 'Josh Sorenson',
      url: 'https://www.pexels.com/u/joshsorenson/',
    },
  },
  {
    day: {
      author: 'Paul Ijsendoorn',
      url: 'https://www.pexels.com/u/paul-ijsendoorn-148531/',
    },
    night: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/maldives-pier-dock-lights-bay-1768714/',
    },
  },
  {
    day: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/bled-slovenia-lake-mountains-1899264/',
    },
    night: {
      author: 'Eberhard Grossgasteiger',
      url: 'https://www.pexels.com/u/eberhardgross/',
    },
  },
  {
    day: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/sand-dunes-ripples-wind-wilderness-1550396/',
    },
    night: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/fog-dawn-landscape-morgenstimmung-1494433/',
    },
  },
  {
    day: {
      author: 'Mateusz Dach',
      url: 'https://www.pexels.com/u/mateusz-dach-99805/',
    },
    night: {
      author: 'Ales Krivec',
      url: 'https://www.pexels.com/u/ales-krivec-166939/',
    },
  },
  {
    day: {
      author: 'Matt Read',
      url: 'https://www.pexels.com/u/matt-read-14552/',
    },
    night: {
      author: 'Priseom',
      url: 'https://www.pexels.com/u/priseom-39551/',
    },
  },
  {
    day: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/gleise-old-railroad-tracks-seemed-1555348/',
    },
    night: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/storm-weather-atmosphere-cold-front-2211333/',
    },
  },
  {
    day: {
      author: 'Jonathan Peterson',
      url: 'https://www.pexels.com/u/grizzlybear/',
    },
    night: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/winter-sun-sun-so-sunbeam-sunset-1547273/',
    },
  },
  {
    day: {
      author: 'Jonathan Peterson',
      url: 'https://www.pexels.com/u/grizzlybear/',
    },
    night: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/autumn-fog-colorful-leaves-nature-1127616/',
    },
  },
  {
    day: {
      author: 'Despierres Cecile',
      url: 'https://www.pexels.com/u/despierres-cecile-93261/',
    },
    night: {
      author: 'Nikolai Ulltang',
      url: 'https://www.pexels.com/u/ulltangfilms/',
    },
  },
  {
    day: {
      author: 'Flo Dahm',
      url: 'https://www.pexels.com/u/flo-dahm-154317/',
    },
    night: {
      author: 'Snapwire',
      url: 'https://www.pexels.com/u/snapwire/',
    },
  },
  {
    day: {
      author: 'CC0 Creative Commons',
      url: 'https://pixabay.com/en/beach-rocks-water-sky-east-sunset-1336083/',
    },
    night: {
      author: 'Pixabay',
      url: 'https://www.pexels.com/u/pixabay/',
    },
  },
  {
    day: {
      author: 'Uncoated',
      url: 'https://www.pexels.com/u/uncoated/',
    },
    night: {
      author: 'Kaique Rocha',
      url: 'https://www.pexels.com/u/kaiquestr/',
    },
  },
  {
    day: {
      author: 'Margerretta',
      url: 'https://www.pexels.com/u/margerretta-157232/',
    },
    night: {
      author: 'Pixabay',
      url: 'https://www.pexels.com/u/pixabay/',
    },
  },
  {
    day: {
      author: 'Pixabay',
      url: 'https://www.pexels.com/u/pixabay/',
    },
    night: {
      author: 'Mateusz Dach',
      url: 'https://www.pexels.com/u/mateusz-dach-99805/',
    },
  },
  {
    day: {
      author: 'freestocks',
      url: 'https://www.pexels.com/u/freestocks/',
    },
    night: {
      author: 'Uncoated',
      url: 'https://www.pexels.com/u/uncoated/',
    },
  },
  {
    day: {
      author: 'Daniel Frank',
      url: 'https://www.pexels.com/u/fr3nks/',
    },
    night: {
      author: 'Kaique Rocha',
      url: 'https://www.pexels.com/u/kaiquestr/',
    },
  },
  {
    day: {
      author: 'Alexandre Perotto',
      url: 'https://www.pexels.com/u/alexandre-perotto-44133/',
    },
    night: {
      author: 'Photo Collections',
      url: 'https://www.pexels.com/u/photocollections/',
    },
  },
  {
    day: {
      author: 'Maria Portelles',
      url: 'https://www.pexels.com/u/helioz/',
    },
    night: {
      author: 'Pixabay',
      url: 'https://www.pexels.com/u/pixabay/',
    },
  },
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
    $('body').css('background-image', `url('./assets/img/dayPics/sample${randomNum}.jpeg')`);
    $('.credits p a').attr('href', bgInfo[randomNum].day.url);
    $('#pic-author').text(bgInfo[randomNum].day.author);
  } else {
    $('body').css('background-image', `url('./assets/img/nightPics/sample${randomNum}.jpeg')`);
    $('#pic-author').attr('href', bgInfo[randomNum].night.url);
    $('#pic-author').text(bgInfo[randomNum].night.author);
  }
}

bgChange();
