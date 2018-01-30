/* ************************************************************************
CLOCKS MODEL
************************************************************************ */
(function makeClocksModel() {
  // converts milliseconds into minutes and seconds
  function minutesAndSeconds(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return seconds == 60 ? `${minutes + 1}:00` : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const status = {
    isActive: false, // whether or not the pomodoro clock is on or off
    isOnBreak: false, // whether or not the pomodoro clock is in work mode or break mode
    isPaused: false,
    startTime: null,
    elapsedTime: 0,
    pauseTime: 0,
  };

  function initClockSettings() {
    let settings;
    if (typeof localStorage.getItem('clockSettings') !== 'string') {
      settings = {
        workPeriod: 1500000,
        breakPeriod: 300000,
        timeFormat: 12,
      };
      localStorage.setItem('clockSettings', JSON.stringify(settings));
    } else {
      settings = JSON.parse(localStorage.getItem('clockSettings'));
    }
    status.workPeriod = settings.workPeriod;
    status.breakPeriod = settings.breakPeriod;
    status.timeFormat = settings.timeFormat;
  }

  function getStatus() {
    return status;
  }

  function setStatus(key, value) {
    const settings = JSON.parse(localStorage.getItem('clockSettings'));
    settings[key] = value;
    status[key] = value;
    localStorage.setItem('clockSettings', JSON.stringify(settings));
  }

  function getTime() {
    // was using toLocaleString() before, but it was causing a memory leak - jmbothe
    const time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    if (status.timeFormat == 12) {
      const timeOfDay = hours < 12 ? 'AM' : 'PM';
      hours = hours === 0 || hours === 12 ? 12 : hours % 12;
      return `${hours}:${minutes} ${timeOfDay}`;
    }
    hours = hours < 10 ? `0${hours}` : hours;
    return `${hours}:${minutes}`;
  }

  function resetClock() {
    status.isPaused = false;
    status.startTime = performance.now();
    status.elapsedTime = 0;
    status.pauseTime = 0;
  }

  function toggleActive() {
    status.isActive = !status.isActive;
    if (status.isActive) {
      status.isOnBreak = false;
      resetClock();
    }
  }

  function toggleWorkBreak() {
    status.isOnBreak = !status.isOnBreak;
    resetClock();
  }

  function togglePause() {
    status.isPaused = !status.isPaused;
    if (status.isPaused) status.pauseTime = status.elapsedTime;
    if (!status.isPaused) status.startTime = performance.now();
  }

  function cycle() {
    const period = status.isOnBreak ? status.breakPeriod : status.workPeriod;
    const countdown = period - status.elapsedTime;

    if (!status.isPaused) {
      status.elapsedTime = (performance.now() - status.startTime) + status.pauseTime;
    }
    if (countdown < 1000) return minutesAndSeconds(0);

    return minutesAndSeconds(countdown);
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
  window.app.clocksModel = { // creates model object as property of app
    getTime,
    initClockSettings,
    getStatus,
    setStatus,
    resetClock,
    toggleActive,
    toggleWorkBreak,
    togglePause,
    cycle,
    audio,
    triggerSound,
  };
}());
/* ************************************************************************
CLOCKS VIEW
************************************************************************* */
(function makeClocksView() {
  const startButton = $('.start');
  const stopButton = $('.stop');
  const pauseButton = $('.pause');
  const resetButton = $('.reset');
  const workBreakButton = $('.work-break');
  const display = document.querySelector('.time-display p');

  function toggleActive(pomodoroIsActive) {
    if (pomodoroIsActive) {
      startButton.hide();
      stopButton.show();
      resetButton.show();
      pauseButton.show();
      workBreakButton.show();
    } else if (!pomodoroIsActive) {
      startButton.show();
      stopButton.hide();
      resetButton.hide();
      pauseButton.hide();
      workBreakButton.hide();
    }
  }

  function togglePause(pomodoroIsPaused) {
    pauseButton.text(`${pomodoroIsPaused ? 'Resume' : 'Pause'}`);
  }

  function toggleWorkBreak(pomodoroIsOnBreak) {
    workBreakButton.text(`${pomodoroIsOnBreak ? 'Work' : 'Break'}`);
  }

  function updateTime(time) {
    display.innerText = `${time}`;
  }

  function updateCountdown(countdown, task) {
    display.innerText = `${countdown} ${task}`;
  }

  function rangeDisplayUpdate(id, value) {
    const output = $(`#${id.substring(0, id.indexOf('-'))}-display`);
    output.text(value);
  }

  function initClockSettings(status) {
    $('#work-period, #work-display').val(status.workPeriod / 60000);
    $('#break-period, #break-display').val(status.breakPeriod / 60000);
    $('#time-format').val(status.timeFormat);
  }

  function toggleWorkPeriodInput(e) {
    if ($('#work-period-box').is(':visible') && e.target !== $('#work-period-box')[0]) {
      $('#work-period-box').hide();
    } else if (!$('#work-period-box').is(':visible') && e.target === $('#work-display')[0]) {
      $('#work-period-box').show();
      $('#work-period-box').focus();
    }
  }

  function toggleBreakPeriodInput(e) {
    if ($('#break-period-box').is(':visible') && e.target !== $('#break-period-box')[0]) {
      $('#break-period-box').hide();
    } else if (!$('#break-period-box').is(':visible') && e.target === $('#break-display')[0]) {
      $('#break-period-box').show();
      $('#break-period-box').focus();
    }
  }

  window.app.clocksView = {
    toggleActive,
    togglePause,
    toggleWorkBreak,
    updateTime,
    updateCountdown,
    rangeDisplayUpdate,
    initClockSettings,
    toggleWorkPeriodInput,
    toggleBreakPeriodInput,
  };
}());
