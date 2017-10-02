/*
The general software architecture pattern used here is known as Model-View-Controller (aka MVC).
reference: https://www.youtube.com/watch?v=fa8eUcu30Lw
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
  let pomodoroStartTime;

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
  app.model = { // creates model object as property of app
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
          requestAnimationFrame(clocksHandler)
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

  function setupEventListeners() {
    $('.toggle-pomodoro button').on('click', togglePomodoro);
  }

  function initialize() {
    loadSounds();
    setupEventListeners();
    clocksHandler();
    $('.time-display p').text(model.getTime());
  }

  window.app.controller = {
    initialize,
  };
}(window.app.model, window.app.view));

window.app.controller.initialize();
