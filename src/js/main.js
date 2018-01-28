
/*
The general software architecture pattern used here is known as Model-View-Controller (aka MVC).
reference: https://www.youtube.com/watch?v=fa8eUcu30Lw
Each individual component (Model, View or Controller)
is designed using the Revealing Module Pattern.
reference: https://www.youtube.com/watch?v=pOfwp6VlnlM
*/

/* ************************************************************************
CONTROLLER
************************************************************************* */
(function makeController() {
  const {
    clocksModel,
    clocksView,
    greetingModel,
    greetingView,
    newsfeedModel,
    newsfeedView,
    toolboxView,
    htmlModel,
    htmlView,
    cssModel,
    cssView,
    pagespeedModel,
    pagespeedView,
    colorpickerModel,
    colorpickerView,
    backgroundModel,
    backgroundView,
    stickynoteModel,
    stickynoteView,
    quicklinksModel,
    quicklinksView,
    settingsView,
  } = window.app;

  /* ***** POMODORO SECTION ******** */

  function togglePomodoroActive() {
    clocksModel.toggleActive();
    clocksView.toggleActive(clocksModel.getStatus().isActive);
    clocksView.togglePause(clocksModel.getStatus().isPaused);
    clocksView.toggleWorkBreak(clocksModel.getStatus().isOnBreak);
  }

  function togglePomodoroPause() {
    clocksModel.togglePause();
    clocksView.togglePause(clocksModel.getStatus().isPaused);
  }

  function toggleWorkBreak() {
    clocksModel.toggleWorkBreak();
    clocksView.toggleWorkBreak(clocksModel.getStatus().isOnBreak);
    clocksView.togglePause(clocksModel.getStatus().isPaused);
  }

  function resetPomodoro() {
    clocksModel.resetClock();
    clocksView.togglePause(clocksModel.getStatus().isPaused);
  }

  function setTimeFormat(e) {
    const format = e.target.options[e.target.selectedIndex].value;
    clocksModel.setStatus('timeFormat', format);
  }

  function setPomodoroWorkPeriod(e) {
    clocksModel.setStatus('workPeriod', e.target.value * 60000);
  }

  function setPomodoroBreakPeriod(e) {
    clocksModel.setStatus('breakPeriod', e.target.value * 60000);
  }

  function rangeDisplayUpdate(e) {
    clocksView.rangeDisplayUpdate(e.target.id, e.target.value);
  }

  function initClockSettings() {
    clocksModel.initClockSettings();
    clocksView.initClockSettings(clocksModel.getStatus());
  }

  // continuous loop that updates clock display. reference https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  function clocksHandler() {
    if (!clocksModel.getStatus().isActive) {
      clocksView.updateTime(clocksModel.getTime());
    } else if (clocksModel.getStatus().isActive) {
      const countdown = clocksModel.cycle();
      const task = clocksModel.getStatus().isOnBreak ? 'break' : 'work';

      if (countdown == '0:00') {
        clocksModel.triggerSound(clocksModel.alarm);
        toggleWorkBreak();
      }
      clocksView.updateCountdown(countdown, task);
    }
    setTimeout(clocksHandler, 1000);
  }

  // basic web audio API audio loading function. reference: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
  // free sound effects from soundbible.com

  function loadSounds() {
    fetch('./assets/audio/alarm.mp3')
      .then(response => response.arrayBuffer())
      .then((buffer) => {
        clocksModel.audio.decodeAudioData(buffer, (decodedData) => {
          clocksModel.alarm = decodedData;
        });
      });
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

  function toggleGreetingMessage() {
    if (greetingModel.getUserName) {
      greetingView.greetByTime(backgroundModel);
    }
  }

  /* ******** NEWSFEED SECTION ******* */

  function loadNewsArticles(sources) {
    sources.forEach((source) => {
      fetch(`https://newsapi.org/v1/articles?source=${source}&sortBy=top&apiKey=${newsfeedModel.APIKey}`)
        .then(response => response.json())
        .then((data) => {
          const content = data.articles.map((article) => {
            return newsfeedView.generateArticle(
              data.source,
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

  function disableNewsSources(sources) {
    $('.settings-newsfeed select').each((index, dropdownMenu) => {
      $(dropdownMenu).children().removeAttr('disabled');
      sources.forEach((source) => {
        const isNotSelected = $(`#${dropdownMenu.id} option:selected`).val() !== source;

        if (isNotSelected) {
          $(`#${dropdownMenu.id} option[value='${source}']`)
            .attr('disabled', 'disabled');
        }
      });
    });
  }

  function updateNewsSources(e) {
    const index = e.target.id.substring(e.target.id.length - 1);

    newsfeedModel
      .updateNewsSources(e.target.value, index, loadNewsArticles, disableNewsSources);
    newsfeedView.clear();
  }

  function initNewsSourceSelect(sources) {
    $('.settings-newsfeed select').each((index, dropdownMenu) => {
      $(dropdownMenu).val(sources[index]);
    });
  }

  function initNewsSources() {
    newsfeedModel
      .initNewsSources(loadNewsArticles, initNewsSourceSelect, disableNewsSources);
  }

  /* ********* STICKY NOTE SECTION ******* */

  function makeNewStickynote() {
    const newNote = stickynoteModel.makeNote();

    stickynoteModel.storeNote(newNote);
    stickynoteView.makeNote(newNote);
  }

  function deleteNote(e) {
    const noteID = $(e.target).closest('.stickyContainer').attr('id');

    stickynoteModel.deleteNote(noteID);
    stickynoteView.deleteNote(noteID);
  }

  function changeStickynoteColor(e) {
    const noteID = $(e.target).closest('.stickyContainer').attr('id');
    const previousColor = $(`#${noteID}`).data('color');
    const color = $(e.target).data('color');

    stickynoteModel.changeState(noteID, { color });
    stickynoteView.changeColor(noteID, previousColor, color);
  }

  function moveStickynote(e) {
    const noteID = $(e.target).closest('.stickyContainer').attr('id');
    const left = $(`#${noteID}`).css('left');
    const top = $(`#${noteID}`).css('top');
    var width = $(`#${noteID}`).css('width');
    width = width.split('');
    width.splice(width.length - 2, 2);
    width = width.join('');

    var height = $(`#${noteID}`).css('height');
    height = height.split('');
    height.splice(height.length -2, 2);
    height = height.join('');

    stickynoteModel.changeState(noteID, { left, top, width, height });
  }

  function addStickynoteText(e) {
    const noteID = $(e.target).closest('.stickyContainer').attr('id');
    const text = $(`#${noteID} textarea`).val();

    stickynoteModel.changeState(noteID, { text });
  }

  function changeStickynoteTitle(e) {
    e.preventDefault();
    const noteID = $(e.target).closest('.stickyContainer').attr('id');
    const title = $(`#${noteID} .stickTitleInput`).val() || ' ';

    stickynoteModel.changeState(noteID, { title });
    stickynoteView.changeTitle(noteID, title);
  }

  function clickAway(e) {
    e.preventDefault();
    const noteID = $(e.target).closest('.stickyContainer').attr('id');
    const title = $(`#${noteID} .stickTitleInput`).val() || ' ';

    if ($(`#${noteID} .stickTitleInput`).is(':visible') && !$(`#${noteID} .stickyForm`).find(e.target).length) {
      stickynoteModel.changeState(noteID, { title });
      stickynoteView.changeTitle(noteID, title);
    }
  }

  function toggleStickynoteColorOptions(e) {
    const noteID = $(e.target).closest('.stickyContainer').attr('id');

    stickynoteView.toggleColorOptions(noteID);
  }

  function toggleStickynoteTitleEdit(e) {
    const noteID = $(e.target).closest('.stickyContainer').attr('id');

    stickynoteView.toggleTitleEdit(noteID);
  }

  /* ********* QUICK LINK SECTION ********* */
  function handleLinkSubmit(e) {
    e.preventDefault();

    const title = $('#titleInput').val();
    const url = $('#urlInput').val();

    quicklinksModel.addLink({ title, url });
    quicklinksView.appendLinks();
    quicklinksView.toggleAddSite(true);
  }

  function deleteLink(e) {
    const index = $('.quickList li').index($(e.target).parent());
    quicklinksModel.deleteLink(index);
    quicklinksView.appendLinks();
  }

  /* ********* VALIDATOR SECTION ********** */

  function htmlValidatorCall(e) {
    e.preventDefault();
    $('#check-html').attr('disabled', 'disabled');

    const newdata = new FormData(this);

    $.ajax({
      url: 'https://validator.w3.org/nu/',
      data: newdata,
      method: 'POST',
      processData: false,
      contentType: false,
      success: (content) => {
        htmlView.successOutput(htmlModel.format(content, { type: 'error' }));
      },
      error: () => {
        htmlView.errorOutput();
      },
    });
    $('#check-html').removeAttr('disabled', 'disabled');
  }

  function CSSValidatorCall(e) {
    e.preventDefault();
    $('#check-css').attr('disabled', 'disabled');

    const content = encodeURIComponent($('#css-markup textarea').val());
    const validatorURL = `http://jigsaw.w3.org/css-validator/validator?text=${content}&profile=css3&output=json`;

    fetch(validatorURL)
      .then((response) => {
        if (!response.ok) {
          cssView.errorOutput();
          throw Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(results => cssView.successOutput(results.cssvalidation.errors, cssModel.format))
      .catch((error) => {
        cssView.errorOutput();
      });
    $('#check-css').removeAttr('disabled', 'disabled');
  }

  // Event listeners to clear content
  $('#clear-html').on('click', () => {
    $('#html-validated>code').empty();
  });
  $('#clear-css').on('click', () => {
    $('#css-validated>code').empty();
  });

  /* ********* PAGE SPEED SECTION ********** */

  function loadPageSpeedChecker() {
    function catchSpeedErrors(result) {
      if (result.responseJSON.error) {
        const errors = result.responseJSON.error.errors;
        for (let i = 0, len = errors.length; i < len; i += 1) {
          if (errors[i].reason === 'badRequest' && pagespeedModel.API_KEY === 'yourAPIKey') {
            $('#speed-page-error').append('Please specify your Google API key in the API_KEY variable.');
          } else {
            $('#speed-page-error').append(`${errors[i].message}`);
          }
        }
        $('#loader-icon').removeClass('spin').hide();
        $('#analyzePage').removeAttr('disabled', 'disabled');
        $('#clearPage').removeAttr('disabled', 'disabled');
        $('.toggle-custom-view').removeAttr('disabled', 'disabled');
      }
    }

    // Invokes the PageSpeed Insights API. The response will contain
    // JavaScript that invokes our callback with the PageSpeed results
    function runPagespeed() {
      let urlStrategy = '';

      // Check to see if user wants desktop or mobile speed
      if ($('.toggle-custom-view:checked').val() === 'mobile') {
        urlStrategy = `${pagespeedModel.API_URL}&key=${pagespeedModel.API_KEY}&strategy=mobile&url=${$('#path').val()}`;
      } else { urlStrategy = `${pagespeedModel.API_URL}&key=${pagespeedModel.API_KEY}&strategy=desktop&url=${$('#path').val()}`; }

      $.getJSON(urlStrategy, (result) => {
        pagespeedView.displayPageSpeedScore(result);
      })
        .fail((result) => {
          catchSpeedErrors(result);
        });
    }

    // Desktop & Mobile Score trigger from URL provided
    $('#analyzePage').on('click', (e) => {
      e.preventDefault();
      $('#speed-page-error').empty(); // Clear previous results
      $('.returnresults').slideUp(500);
      $('.page-speed-box').slideUp(500).empty();
      $('#analyzePage').addClass('active').attr('disabled', 'disabled'); // Cannot click again until fully loaded
      $('#clearPage').addClass('active').attr('disabled', 'disabled');
      $('.toggle-custom-view').attr('disabled', 'disabled'); // Cannot switch between desktop and mobile until fully loaded
      $('#loader-icon').show().addClass('spin'); // Loading icon to indicate user to be patient
      runPagespeed();
    });

    // Event listener to clear results
    $('#clearPage').on('click', () => {
      $('#speed-page-error').empty(); // Clear previous results
      $('.returnresults').slideUp(500);
      $('.page-speed-box').slideUp(500).empty();
    });
  }

  /* ********* COLOR PICKER SECTION ********** */

  function loadColorPicker() {
    function getSpectrumColor(e) {
      // reference: http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
      e.preventDefault();
      // get x/y coordinates
      let x = e.pageX - colorpickerModel.spectrumRect.left;
      let y = e.pageY - colorpickerModel.spectrumRect.top;
      // constrain x max
      if (x > colorpickerModel.spectrumRect.width) { x = colorpickerModel.spectrumRect.width; }
      if (x < 0) { x = 0; }
      if (y > colorpickerModel.spectrumRect.height) { y = colorpickerModel.spectrumRect.height; }
      if (y < 0) { y = 0.1; }
      // convert between hsv and hsl
      const xRatio = (x / colorpickerModel.spectrumRect.width) * 100;
      const yRatio = (y / colorpickerModel.spectrumRect.height) * 100;
      const hsvValue = 1 - (yRatio / 100);
      const hsvSaturation = xRatio / 100;
      colorpickerModel.lightness = (hsvValue / 2) * (2 - hsvSaturation);
      colorpickerModel.saturation = (hsvValue * hsvSaturation) / (1 - Math.abs((2 * colorpickerModel.lightness) - 1));
      const color = tinycolor(`hsl ${colorpickerModel.hue} ${colorpickerModel.saturation} ${colorpickerModel.lightness}`);
      colorpickerModel.setCurrentColor(color);
      colorpickerModel.setColorValues(color);
      colorpickerModel.updateSpectrumCursor(x, y);
    }

    function endGetSpectrumColor() {
      colorpickerModel.spectrumCursor.classList.remove('dragging');
      window.removeEventListener('mousemove', getSpectrumColor);
    }

    const startGetSpectrumColor = (e) => {
      getSpectrumColor(e);
      colorpickerModel.spectrumCursor.classList.add('dragging');
      window.addEventListener('mousemove', getSpectrumColor);
      window.addEventListener('mouseup', endGetSpectrumColor);
    };

    colorpickerModel.spectrumCanvas.addEventListener('mousedown', (e) => {
      startGetSpectrumColor(e);
    });

    function getHueColor(e) {
      e.preventDefault();
      let y = e.pageY - colorpickerModel.hueRect.top;
      if (y > colorpickerModel.hueRect.height) { y = colorpickerModel.hueRect.height; }
      if (y < 0) { y = 0; }
      const percent = y / colorpickerModel.hueRect.height;
      colorpickerModel.hue = 360 - (360 * percent);
      const hueColor = tinycolor('hsl '+ colorpickerModel.hue + ' 1 .5').toHslString();
      const color = tinycolor('hsl '+ colorpickerModel.hue + ' ' + colorpickerModel.saturation + ' ' + colorpickerModel.lightness).toHslString();
      colorpickerView.createShadeSpectrum(hueColor);
      colorpickerModel.updateHueCursor(y, hueColor);
      colorpickerModel.setCurrentColor(color);
      colorpickerModel.setColorValues(color);
    }

    function endGetHueColor() {
      colorpickerModel.hueCursor.classList.remove('dragging');
      window.removeEventListener('mousemove', getHueColor);
    }

    function startGetHueColor(e) {
      getHueColor(e);
      colorpickerModel.hueCursor.classList.add('dragging');
      window.addEventListener('mousemove', getHueColor);
      window.addEventListener('mouseup', endGetHueColor);
    }

    colorpickerModel.hueCanvas.addEventListener('mousedown', (e) => {
      startGetHueColor(e);
    });

    function colorToPos(color) {
      var color = tinycolor(color);
      const hsl = color.toHsl();
      colorpickerModel.hue = hsl.h;
      const hsv = color.toHsv();
      const x = colorpickerModel.spectrumRect.width * hsv.s;
      const y = colorpickerModel.spectrumRect.height * (1 - hsv.v);
      const hueY = colorpickerModel.hueRect.height - ((colorpickerModel.hue / 360) * colorpickerModel.hueRect.height);
      colorpickerModel.updateSpectrumCursor(x, y);
      colorpickerModel.updateHueCursor(hueY);
      colorpickerModel.setCurrentColor(color);
      colorpickerModel.setColorValues(color);
      colorpickerView.createShadeSpectrum(colorpickerModel.colorToHue(color));
    }

    // Add event listeners
    colorpickerModel.red.addEventListener('change', () => {
      const color = tinycolor(`rgb ${colorpickerModel.red.value} ${colorpickerModel.green.value} ${colorpickerModel.blue.value}`);
      colorToPos(color);
    });

    colorpickerModel.green.addEventListener('change', () => {
      const color = tinycolor(`rgb ${colorpickerModel.red.value} ${colorpickerModel.green.value} ${colorpickerModel.blue.value}`);
      colorToPos(color);
    });

    colorpickerModel.blue.addEventListener('change', () => {
      const color = tinycolor(`rgb ${colorpickerModel.red.value} ${colorpickerModel.green.value} ${colorpickerModel.blue.value}`);
      colorToPos(color);
    });

    colorpickerModel.hex.addEventListener('change', () => {
      var pushColor = `#${colorpickerModel.hex.value}`;
      pushColor = pushColor.split('');
      if (pushColor[0] === '#' && pushColor[1] === '#') {
        pushColor.shift();
      }
      pushColor = pushColor.join('');
      const color = tinycolor(pushColor);
      colorToPos(color);
    });

    colorpickerModel.huedisplay.addEventListener('change', () => {
      const color = tinycolor(`hsl ${colorpickerModel.huedisplay.value} ${colorpickerModel.saturationdisplay.value} ${colorpickerModel.lightnessdisplay.value}`);
      colorToPos(color);
    });

    colorpickerModel.saturationdisplay.addEventListener('change', () => {
      const color = tinycolor(`hsl ${colorpickerModel.huedisplay.value} ${colorpickerModel.saturationdisplay.value} ${colorpickerModel.lightnessdisplay.value}`);
      colorToPos(color);
    });

    colorpickerModel.lightnessdisplay.addEventListener('change', () => {
      const color = tinycolor(`hsl ${colorpickerModel.huedisplay.value} ${colorpickerModel.saturationdisplay.value} ${colorpickerModel.lightnessdisplay.value}`);
      colorToPos(color);
    });

    colorpickerModel.modeToggle.addEventListener('click', () => {
      if (colorpickerModel.hexField.classList.contains('active')) {
        colorpickerModel.hexField.classList.remove('active');
        colorpickerModel.rgbFields.classList.add('active');
      } else if (colorpickerModel.rgbFields.classList.contains('active')) {
        colorpickerModel.rgbFields.classList.remove('active');
        colorpickerModel.hslFields.classList.add('active');
      } else if (colorpickerModel.hslFields.classList.contains('active')) {
        colorpickerModel.hslFields.classList.remove('active');
        colorpickerModel.hexField.classList.add('active');
      }
    });

    colorpickerView.createShadeSpectrum();
    colorpickerView.createHueSpectrum();
  }

  /* ********* BACKGROUND SECTION ************ */

  function loadBackground() {
    function changeBg() {
      const hours = getHours();
      if (hours > 6 && hours < 19) {
        backgroundView.generateDayBg(backgroundModel);
      } else { backgroundView.generateNightBg(backgroundModel); }
    }

    function gallerySelect() {
      backgroundModel.imageIndex = JSON.parse(localStorage.getItem('gallery')).num;

      // If image selected is daytime, get daytime image
      // Otherwise get the nighttime image associated with the number value of the selected image
      if (JSON.parse(localStorage.getItem('gallery')).url.match(/day/g)) {
        backgroundView.generateDayBg(backgroundModel);
      } else { backgroundView.generateNightBg(backgroundModel); }
    }

    // Let user select a specific image from DevTab's gallery
    $('.gallery-container').on('click', (e) => {
      // Clear local storage
      backgroundModel.setUserImage('');
      $('.bg-user-store').hide();

      // Get number value from selected image
      const gallery = {
        num: $(e.target).attr('src').slice(-7).replace(/[^0-9]/g, ''),
        url: $(e.target).attr('src'),
      };
      localStorage.setItem('gallery', JSON.stringify(gallery));

      gallerySelect();
    });

    // Let user input their own image as the background
    $('#bg-user-url-submit').on('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('gallery');
      const userInput = $('#bg-user-url').val();
      if (userInput.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        backgroundModel.setUserImage($('#bg-user-url').val());
        backgroundView.generateUserBg(backgroundModel.getUserImage());
      } else {
        backgroundView.showUserBgError();
      }
    });

    // Let user use DevTab's gallery of rotating background images
    $('#rotate-bg-generator').on('click', () => {
      backgroundModel.imageIndex = randomNumber(0, backgroundModel.bgInfo.length);
      $('#rotate-bg-generator').addClass('spin-random-icon');
      $('#rotate-bg-generator').one('animationend', () => {
        // Clear local storage
        localStorage.removeItem('gallery');
        backgroundModel.setUserImage('');
        $('.bg-user-store').hide();
        changeBg();
        $('#rotate-bg-generator').removeClass('spin-random-icon');
      });
    });

    // If a user had added their own image, show it
    // If a user has selected an image from the gallery, show it
    // Otherwise default to DevTab image rotation
    if (backgroundModel.getUserImage()) {
      backgroundView.generateUserBg(backgroundModel.getUserImage());
    } else if (localStorage.getItem('gallery')) {
      gallerySelect();
    } else { changeBg(); }
  }

  /* ********* GENERAL ************ */

  function setupEventListeners() {
    $(window).on('load', () => {
      $('.devtab-bg').css({ visibility: 'visible' }).hide().fadeIn(1000);
    })
      .on('click', toggleNameInput())
      .on('click', newsfeedView.toggleNewsfeed)
      .on('click', toolboxView.toggleToolbox)
      .on('click', colorpickerView.toggleColorPicker)
      .on('click', quicklinksView.toggleQuickLinks)
      .on('click', settingsView.toggleSettings)
      .on('click', settingsView.toggleAbout)
      .on('click', settingsView.toggleContribute)
      .on('click', settingsView.toggleUpdates)
      .on('click', settingsView.togglePomodoroSettings)
      .on('click', settingsView.toggleBackgroundSettings)
      .on('click', settingsView.toggleNewsfeedSettings);
    $('#name-form').on('submit', setUserName);
    $('.start, .stop').on('click', togglePomodoroActive);
    $('.pause').on('click', togglePomodoroPause);
    $('.reset').on('click', resetPomodoro);
    $('.work-break').on('click', toggleWorkBreak);
    $('#html-markup').on('submit', htmlValidatorCall);
    $('#css-markup').on('submit', CSSValidatorCall);
    $('#newNote').on('click', makeNewStickynote);
    $('#work-period').on('input', setPomodoroWorkPeriod)
      .on('input', rangeDisplayUpdate);
    $('#break-period').on('input', setPomodoroBreakPeriod)
      .on('input', rangeDisplayUpdate);
    $('#time-format').on('change', setTimeFormat);
    $('.news-source-dropdown').on('change', updateNewsSources);
    $('#targetForm').submit(handleLinkSubmit);
    $('.addSite').on('click', quicklinksView.toggleAddSite.bind(null, false));
    $('.quickList').on('click', '.link-delete', deleteLink);
    $('.devtab-bg').on('submit', '.stickyContainer form', changeStickynoteTitle);
    $('.devtab-bg').on('click', '.stickNote', clickAway);
    $('.devtab-bg').on('click', '.title-and-cancel', toggleStickynoteTitleEdit);
    $('.devtab-bg').on('keyup', '.stickyContainer textarea', addStickynoteText);
    $('.devtab-bg').on('mouseup', '.stickyContainer', moveStickynote);
    $('.devtab-bg').on('click', '.colorBar', changeStickynoteColor);
    $('.devtab-bg').on('click', '.stickLeft', toggleStickynoteColorOptions);
    $('.devtab-bg').on('click', '.fa-trash', deleteNote);
  }

  function initialize() {
    $('.setting-controls-contribute, .setting-controls-updates, settings-pomodoro, .settings-newsfeed, .setting-controls-background, .tools-container, .valid-container, .page-speed-container, .returnresults, #loader-icon, .color-picker-panel, .quickDropdown').hide();
    greetingView.showGreeting(greetingModel.getUserName());
    toggleGreetingMessage();
    initClockSettings();
    clocksView.updateTime(clocksModel.getTime());
    loadSounds();
    initNewsSources();
    clocksHandler();
    loadPageSpeedChecker();
    loadColorPicker();
    loadBackground();
    stickynoteView.initNotes();
    quicklinksModel.addLink();
    quicklinksView.appendLinks();
    setupEventListeners();
  }

  window.app.controller = {
    initialize,
  };
}());

window.app.controller.initialize();
