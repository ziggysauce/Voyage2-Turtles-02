/* ************************************************************************
SETTINGS MODEL
************************************************************************* */
// (function makeSettingsModel() {
//
//   window.app.settingsModel = {
//
//   };
// }());

/* ************************************************************************
SETTINGS VIEW
************************************************************************* */
(function makeSettingsView() {
  const settingWrapper = $('.setting-wrapper');
  const about = $('.setting-controls-about');
  const contribute = $('.setting-controls-contribute');
  const pomodoroSettings = $('.settings-pomodoro');
  const background = $('.setting-controls-background');

  function toggleSettings(e) {
    if (settingWrapper.is(':visible') && !settingWrapper.find(e.target).length) {
      settingWrapper.fadeOut();
    } else if (!settingWrapper.is(':visible') && e.target === $('.fa-cog')[0]) {
      settingWrapper.fadeIn();
    }
  }

  function toggleAbout(e) {
    if (about.is(':visible') && !about.find(e.target).length && e.target !== about[0] && e.target !== $('.setting-about')[0]) {
      about.fadeOut();
    } else if (!about.is(':visible') && e.target === $('.setting-about')[0]) {
      about.fadeIn();
    }
  }

  function toggleContribute(e) {
    if (contribute.is(':visible') && !contribute.find(e.target).length && e.target !== contribute[0] && e.target !== $('.setting-contribute')[0]) {
      contribute.fadeOut();
    } else if (!contribute.is(':visible') && e.target === $('.setting-contribute')[0]) {
      contribute.fadeIn();
    }
  }

  function togglePomodoroSettings(e) {
    if (pomodoroSettings.is(':visible') && !pomodoroSettings.find(e.target).length && e.target !== pomodoroSettings[0] && e.target !== $('.setting-clock')[0]) {
      pomodoroSettings.fadeOut();
    } else if (!pomodoroSettings.is(':visible') && e.target === $('.setting-clock')[0]) {
      pomodoroSettings.fadeIn();
    }
  }

  function toggleBackgroundSettings(e) {
    if (background.is(':visible') && !background.find(e.target).length && e.target !== background[0] && e.target !== $('.setting-background')[0]) {
      background.fadeOut();
    } else if (!background.is(':visible') && e.target === $('.setting-background')[0]) {
      background.fadeIn();
    }
  }

  window.app.settingsView = {
    toggleSettings,
    toggleAbout,
    toggleContribute,
    togglePomodoroSettings,
    toggleBackgroundSettings,
  };
}());
