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
  const content = $('.setting-controls');
  const about = $('.setting-controls-about');
  const contribute = $('.setting-controls-contribute');


  function toggleSettings(e) {
    if (settingWrapper.is(':visible') && !settingWrapper.find(e.target).length) {
      settingWrapper.fadeOut();
      content.empty();
    } else if (!settingWrapper.is(':visible') && e.target === $('.fa-cog')[0]) {
      settingWrapper.fadeIn();
    }
  }

  function toggleSettingsFeatures(e) {
    if (!about.is(':visible') && e.target === $('.setting-about')[0]) {
      content.empty();
      $(`
        <div class="setting-controls-about">
          <img src="assets/img/scuba-turtle.png" alt="DevTab Thumbnail">
          <h1>DevTab</h1>
          <span>Personal Dashboard with a Front-End Developer Focus</span>
          <span>v1.0.0</span>
          <h3>Thank you for your support!</h3>
        </div>
        `).appendTo(content).hide().fadeIn();
    } else if (!contribute.is(':visible') && e.target === $('.setting-contribute')[0]) {
      content.empty();
      $(`
        <div class="setting-controls-contribute">
          <h2>DevTab is an open source project</h2>
          <a id="gh-repo" href="https://github.com/chingu-coders/Voyage2-Turtles-02">GitHub</a>
          <span>Created by</span>
          <span class="ghlinks">
            <a href="https://github.com/ziggysauce">Dan</a>
            <a href="https://github.com/jmbothe">Jeff</a>
            <a href="https://github.com/HTMLNoob">Tyler</a>
          </span>
        </div>
        `).appendTo(content).hide().fadeIn();
    }
  }

  window.app.settingsView = {
    toggleSettings,
    toggleSettingsFeatures,
  };
}());
