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
  const newsfeed = $('.settings-newsfeed');

  function toggleSettings(e) {
    if (settingWrapper.is(':visible') && !settingWrapper.find(e.target).length) {
      settingWrapper.fadeOut();
    } else if (!settingWrapper.is(':visible') && e.target === $('.fa-cog')[0]) {
      settingWrapper.fadeIn();
      about.fadeIn();
    }
  }

  function toggleAbout(e) {
    if ($('.setting-aside').find(e.target).length || e.target === $('.setting-aside')[0]) {
      if (e.target !== $('.setting-contribute')[0] && e.target !== $('.setting-clock')[0] && e.target !== $('.setting-news')[0] && e.target !== $('.setting-background')[0]) {
        about.fadeIn();
      }
    }
  }

  function toggleContribute(e) {
    if (contribute.is(':visible') && !contribute.find(e.target).length && e.target !== contribute[0] && e.target !== $('.setting-contribute')[0]) {
      contribute.fadeOut();
    } else if (!contribute.is(':visible') && e.target === $('.setting-contribute')[0]) {
      contribute.fadeIn();
      about.hide();
    }
  }

  function togglePomodoroSettings(e) {
    if (pomodoroSettings.is(':visible') && !pomodoroSettings.find(e.target).length && e.target !== pomodoroSettings[0] && e.target !== $('.setting-clock')[0]) {
      pomodoroSettings.fadeOut();
    } else if (!pomodoroSettings.is(':visible') && e.target === $('.setting-clock')[0]) {
      pomodoroSettings.fadeIn();
      about.hide();
    }
  }

  function toggleBackgroundSettings(e) {
    if (background.is(':visible') && !background.find(e.target).length && e.target !== background[0] && e.target !== $('.setting-background')[0]) {
      background.fadeOut();
      $('.gallery-container').empty();
    } else if (!background.is(':visible') && e.target === $('.setting-background')[0]) {
      $(`
        <img src="assets/img/dayPics/sample0.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample0.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample1.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample1.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample2.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample2.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample3.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample3.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample4.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample4.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample5.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample5.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample6.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample6.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample7.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample7.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample8.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample8.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample9.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample9.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample10.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample10.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample11.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample11.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample12.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample12.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample13.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample13.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample14.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample14.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample15.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample15.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample16.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample16.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample17.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample17.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample18.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample18.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample19.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample19.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample20.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample20.jpeg" alt="nighttime image">
        <img src="assets/img/dayPics/sample21.jpeg" alt="daytime image">
        <img src="assets/img/nightPics/sample21.jpeg" alt="nighttime image">
        `).appendTo($('.gallery-container')).hide().fadeIn();
      background.fadeIn();
      about.hide();
    }
  }

  function toggleNewsfeedSettings(e) {
    if (newsfeed.is(':visible') && !newsfeed.find(e.target).length && e.target !== newsfeed[0] && e.target !== $('.setting-news')[0]) {
      newsfeed.fadeOut();
    } else if (!newsfeed.is(':visible') && e.target === $('.setting-news')[0]) {
      newsfeed.fadeIn();
      about.hide();
    }
  }

  window.app.settingsView = {
    toggleSettings,
    toggleAbout,
    toggleContribute,
    togglePomodoroSettings,
    toggleBackgroundSettings,
    toggleNewsfeedSettings,
  };
}());
