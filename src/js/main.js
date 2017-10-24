
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
(function makeController(
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
  colorpickerModel,
  colorpickerView,
  backgroundModel,
) {
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
    requestAnimationFrame(clocksHandler);
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

  /* ******** NEWSFEED SECTION ******* */

  function loadNewsArticles() {
    newsfeedModel.sources.forEach((source) => {
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

  /* ********* VALIDATOR SECTION ********** */

  function htmlValidatorCall(e) {
    e.preventDefault();

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
  }

  function CSSValidatorCall(e) {
    e.preventDefault();

    const content = $('#css-markup textarea').val().replace(/\n/ig, '%0A');
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';
    const validatorURL = `http://jigsaw.w3.org/css-validator/validator?text=${content}&profile=css3&output=json`;

    fetch(proxyURL + validatorURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        cssView.errorOutput();
        throw new Error('Network response was not ok.');
      })
      .then(results => cssView.successOutput(results.cssvalidation.errors, cssModel.format));
  }

  /* ********* PAGE SPEED SECTION ********** */

  function loadPageSpeedChecker() {
    const callbacks = {};

    $('.returnresults').hide();
    $('#loader-icon').hide();

    callbacks.displayPageSpeedScore = (result) => {
      // pagespeedView.generatePageSpeedBox();
      const region = document.getElementById('output');
      const rules = result.formattedResults.ruleResults;
      const redirects = rules.AvoidLandingPageRedirects;
      const compress = rules.EnableGzipCompression;
      const caching = rules.LeverageBrowserCaching;
      const responseTime = rules.MainResourceServerResponseTime;
      const minCss = rules.MinifyCss;
      const minHtml = rules.MinifyHTML;
      const minJs = rules.MinifyJavaScript;
      const resources = rules.MinimizeRenderBlockingResources;
      const images = rules.OptimizeImages;
      const content = rules.PrioritizeVisibleContent;
      const rulesArray = [redirects, compress, caching, responseTime, minCss, minHtml,
        minJs, resources, images, content];
      const possibleRules = [];
      const foundRules = [];

      rulesArray.map((i) => {
        if (i.ruleImpact > 0) {
          possibleRules.push(i);
          possibleRules.sort((a, b) => b.ruleImpact - a.ruleImpact);
        } else {
          foundRules.push(i);
        }
        return i;
      });

      $('#output').hide().slideDown(500);
      $('#possible').hide().slideDown(500);
      $('#found').hide().slideDown(500);

      $(`
        <div class="speed-score-box">
          <h4 id="results-speed-title">Score: ${result.score}</h4>
          <span>URL: ${result.id}</span>
        </div>
        `).appendTo(region);
      if ($('.toggle-custom-view:checked').val() === 'mobile') {
        $('#results-speed-title').prepend('Mobile ');
      } else {
        $('#results-speed-title').prepend('Desktop ');
      }

      // Make container for possible optimizations
      const possible = document.getElementById('possible');
      if (possibleRules.length > 0) {
        $('<h1 class=optimizationTitles>Possible Optimizations</h1>').appendTo(possible);
      } else {
        $('<h1 class=optimizationTitles>Congratulations! No issues found.</h1>').appendTo(possible);
      }

      possibleRules.map((i) => {
        $(`<h4 class="speedTitles">${i.localizedRuleName}</h4>`).appendTo(possible);
        // possible.append(`${i.localizedRuleName}\n`);
        $(`
          <button class="click-details inactive" type="submit" id="${possibleRules.indexOf(i)}button">More Details</button>
          <div class="addInfo" id="${possibleRules.indexOf(i)}">
            <span id="${possibleRules.indexOf(i)}info"></span>
            <span><a href="#" id="${possibleRules.indexOf(i)}link" class="learn-more-link" target="_blank"></a></span>
            <span id="${possibleRules.indexOf(i)}these"></span>
          </div>
        `).appendTo(possible);

        const first = $(`#${possibleRules.indexOf(i)}info`);
        const second = $(`#${possibleRules.indexOf(i)}link`);
        const third = $(`#${possibleRules.indexOf(i)}these`);

        $('#output').hide().slideDown(500);
        $('#possible').hide().slideDown(500);
        $('#found').hide().slideDown(500);
        $(`#${possibleRules.indexOf(i)}`).hide();

        // Show more info when clicking 'More Details' button
        $(`#${possibleRules.indexOf(i)}button`).on('click', () => {
          if ($(`#${possibleRules.indexOf(i)}button`)[0].className === 'click-details inactive') {
            $(`#${possibleRules.indexOf(i)}button`).removeClass('inactive');
            $(`#${possibleRules.indexOf(i)}button`).addClass('active');
            $(`#${possibleRules.indexOf(i)}button`).text('Less Details');

            // Show possible optimizations
            // Specific test cases per rule
            for (let j = 0; j < i.urlBlocks.length; j += 1) {
              if (i.urlBlocks.length > 2 && j === 1) {
                first.append(`${i.urlBlocks[j].header.format}\n`);
              }
              if (i.urlBlocks.length > 2 && j === 2) {
                second.append(`${i.urlBlocks[j].header.format}\n`);
                second.attr('href', `${i.urlBlocks[j].header.args[0].value}`);
                for (let k = 0; k < i.urlBlocks[j].urls.length; k += 1) {
                  third.append(`${i.urlBlocks[j].urls[k].result.args[0].value}\n`);
                }
              }
              if (i.urlBlocks.length <= 2) {
                if (j === 0) {
                  if (i.localizedRuleName === 'Reduce server response time') {
                    first.append(`In our test, your server responded in ${i.urlBlocks[j].header.args[0].value}. There are many factors that can slow down your server response time. Please read our recommendations to learn how you can monitor and measure where your server is spending the most time.\n`);
                    second.append('Learn More');
                    second.attr('href', `${i.urlBlocks[j].header.args[1].value}`);
                  } else {
                    first.append(`${i.urlBlocks[j].header.format}\n`);
                  }
                }
                if (j === 1) {
                  if (i.localizedRuleName === 'Prioritize visible content') {
                    third.append(`${i.urlBlocks[j].header.format}\n`);
                    second.append(`${i.localizedRuleName}\n`);
                    second.attr('href', `${i.urlBlocks[j].header.args[0].value}`);
                  } else if (i.localizedRuleName === 'Reduce server response time') {
                    first.append(`In our test, your server responded in ${i.urlBlocks[j].header.args[0].value}. There are many factors that can slow down your server response time. Please read our recommendations to learn how you can monitor and measure where your server is spending the most time.\n`);
                    second.append('Learn More');
                    second.attr('href', `${i.urlBlocks[j].header.args[1].value}`);
                  } else {
                    second.append(`${i.localizedRuleName} of the following:\n`);
                    second.attr('href', `${i.urlBlocks[j].header.args[0].value}`);
                    for (let k = 0; k < i.urlBlocks[j].urls.length; k += 1) {
                      third.append(`${i.urlBlocks[j].urls[k].result.args[0].value}\n`);
                    }
                  }
                }
              }
            }
            $(`#${possibleRules.indexOf(i)}`).slideDown(500);
          } else {
            $(`#${possibleRules.indexOf(i)}button`).removeClass('active');
            $(`#${possibleRules.indexOf(i)}button`).addClass('inactive');
            $(`#${possibleRules.indexOf(i)}button`).text('More Details');
            $(`#${possibleRules.indexOf(i)}`).slideUp(500, () => {
              first.empty();
              second.empty();
              second.attr('href', '#');
              third.empty();
            });
          }
        });
        return i;
      });

      // Create top of found optimizations container
      const found = document.getElementById('found');
      $('<h1 class=optimizationTitles>Optimizations Found</h1>').appendTo(found);
      $('<button class="click-details inactive" type="submit" id="moreFoundOptimizations">More Details</button><div class="addFoundOptimizations"</div>').appendTo(found);

      // Show more info when clicking 'More Details' button
      $('#moreFoundOptimizations').on('click', () => {
        if ($('#moreFoundOptimizations')[0].className === 'click-details inactive') {
          $('#moreFoundOptimizations').removeClass('inactive');
          $('#moreFoundOptimizations').addClass('active');
          $('#moreFoundOptimizations').text('Less Details');
          $('.addFoundOptimizations').hide();

          foundRules.map((m) => {
            $(`
              <h4 id="${foundRules.indexOf(m)}title" class="speedTitles"></h4>
              <div class="addFoundInfo">
                <div id="${foundRules.indexOf(m)}content"></div>
                <div><a href="#" id="${foundRules.indexOf(m)}anchor" class="learn-more-link" target="_blank"></a></div>
              </div>
              `).appendTo($('.addFoundOptimizations'));

            const title = $(`#${foundRules.indexOf(m)}title`);
            const top = $(`#${foundRules.indexOf(m)}content`);
            const bottom = $(`#${foundRules.indexOf(m)}anchor`);

            // Show found optimizations
            // Fill container for found optimizations
            title.append(`${m.localizedRuleName}`);
            top.append(`${m.urlBlocks[0].header.format}`);
            bottom.append('Learn More');
            bottom.attr('href', `${m.urlBlocks[0].header.args[0].value}`);
            // $(`#${foundRules.indexOf(m)}`).slideDown(500);
            return m;
          });
          $('.addFoundOptimizations').slideDown(500);
        } else {
          $('#moreFoundOptimizations').removeClass('active');
          $('#moreFoundOptimizations').addClass('inactive');
          $('#moreFoundOptimizations').text('More Details');
          $('.addFoundOptimizations').slideUp(500, () => {
            $('.addFoundOptimizations').empty();
          });
        }
      });
      $('.returnresults').slideDown(500);
      $('#loader-icon').removeClass('spin').hide();
      $('#analyzePage').removeAttr('disabled', 'disabled');
      $('.toggle-custom-view').removeAttr('disabled', 'disabled');
    };

    // Invokes the PageSpeed Insights API. The response will contain
    // JavaScript that invokes our callback with the PageSpeed results
    function runPagespeed() {
      if ($('.toggle-custom-view:checked').val() === 'mobile') {
        $.ajax({
          url: `${pagespeedModel.API_URL}&key=${pagespeedModel.API_KEY}&strategy=mobile&url=${$('#path').val()}`,
          method: 'GET',
          dataType: 'JSONP',
          async: false,
          processData: false,
          contentType: false,
          success: (result) => {
            // JSONP callback. Checks for errors, then invokes callback handlers
            if (result.error) {
              const errors = result.error.errors;
              for (var i = 0, len = errors.length; i < len; ++i) {
                if (errors[i].reason === 'badRequest' && pagespeedModel.API_KEY === 'yourAPIKey') {
                  // console.log('Please specify your Google API key in the API_KEY variable.');
                  $('#speed-page-error').append('Please specify your Google API key in the API_KEY variable.');
                } else {
                  // console.log(errors[i].message);
                  $('#speed-page-error').append(`${errors[i].message}`);
                }
              }
              $('#loader-icon').removeClass('spin').hide();
              $('#analyzePage').removeAttr('disabled', 'disabled');
              $('.toggle-custom-view').removeAttr('disabled', 'disabled');
              return;
            }

            // Dispatch to each function on callbacks object.
            for (const fn in callbacks) {
              const f = callbacks[fn];
              if (typeof f == 'function') {
                callbacks[fn](result);
              }
            }
          },
        });
      } else {
        $.ajax({
          url: `${pagespeedModel.API_URL}&key=${pagespeedModel.API_KEY}&strategy=desktop&url=${$('#path').val()}`,
          method: 'GET',
          dataType: 'JSONP',
          async: false,
          processData: false,
          contentType: false,
          success: (result) => {
            // JSONP callback. Checks for errors, then invokes callback handlers
            if (result.error) {
              const errors = result.error.errors;
              for (var i = 0, len = errors.length; i < len; ++i) {
                if (errors[i].reason === 'badRequest' && pagespeedModel.API_KEY === 'yourAPIKey') {
                  // console.log('Please specify your Google API key in the API_KEY variable.');
                  $('#speed-page-error').append('Please specify your Google API key in the API_KEY variable.');
                } else {
                  // console.log(errors[i].message);
                  $('#speed-page-error').append(`${errors[i].message}`);
                }
              }
              $('#loader-icon').removeClass('spin').hide();
              $('#analyzePage').removeAttr('disabled', 'disabled');
              $('.toggle-custom-view').removeAttr('disabled', 'disabled');
              return;
            }

            // Dispatch to each function on callbacks object.
            for (const fn in callbacks) {
              const f = callbacks[fn];
              if (typeof f == 'function') {
                callbacks[fn](result);
              }
            }
          },
        });
      }
    }

    // Desktop & Mobile Score trigger from URL provided
    $('#analyzePage').on('click', () => {
      $('#speed-page-error').empty(); // Clear previous results
      $('.returnresults').slideUp(500);
      $('.page-speed-box').slideUp(500).empty();
      $('#analyzePage').addClass('active').attr('disabled', 'disabled'); // Cannot click again until fully loaded
      $('.toggle-custom-view').attr('disabled', 'disabled'); // Cannot switch between desktop and mobile until fully loaded
      $('#loader-icon').show().addClass('spin'); // Loading icon to indicate user to be patient
      runPagespeed();
    });
  }

  /* ********* COLOR PICKER SECTION ********** */

  function loadColorPicker() {
    $('.color-picker-panel').hide();

    function refreshElementRects() {
      colorpickerModel.spectrumRect = colorpickerModel.spectrumCanvas.getBoundingClientRect();
      colorpickerModel.hueRect = colorpickerModel.hueCanvas.getBoundingClientRect();
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
      colorpickerModel.red.value = rgbValues.r;
      colorpickerModel.green.value = rgbValues.g;
      colorpickerModel.blue.value = rgbValues.b;
      colorpickerModel.hex.value = hexValue;
      colorpickerModel.huedisplay.value = Math.round(hslValues.h);
      colorpickerModel.saturationdisplay.value = Math.round(hslValues.s * 100);
      colorpickerModel.lightnessdisplay.value = Math.round(hslValues.l * 100);
    }

    function setCurrentColor(color) {
      color = tinycolor(color);
      colorpickerModel.colorIndicator.style.backgroundColor = color;
      colorpickerModel.spectrumCursor.style.backgroundColor = color;
      colorpickerModel.hueCursor.style.backgroundColor = 'hsl('+ color.toHsl().h +', 100%, 50%)';
    }

    function updateHueCursor(y) {
      colorpickerModel.hueCursor.style.top = y + 'px';
    }

    function updateSpectrumCursor(x, y) {
      // assign position
      colorpickerModel.spectrumCursor.style.left = x + 'px';
      colorpickerModel.spectrumCursor.style.top = y + 'px';
    }

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
      const color = tinycolor('hsl ' + colorpickerModel.hue + ' ' + colorpickerModel.saturation + ' ' + colorpickerModel.lightness);
      setCurrentColor(color);
      setColorValues(color);
      updateSpectrumCursor(x, y);
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

    function createShadeSpectrum(color) {
      const canvas = colorpickerModel.spectrumCanvas;
      const ctx = colorpickerModel.spectrumCtx;
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
      let y = e.pageY - colorpickerModel.hueRect.top;
      if (y > colorpickerModel.hueRect.height) { y = colorpickerModel.hueRect.height; }
      if (y < 0) { y = 0; }
      const percent = y / colorpickerModel.hueRect.height;
      colorpickerModel.hue = 360 - (360 * percent);
      const hueColor = tinycolor('hsl '+ colorpickerModel.hue + ' 1 .5').toHslString();
      const color = tinycolor('hsl '+ colorpickerModel.hue + ' ' + colorpickerModel.saturation + ' ' + colorpickerModel.lightness).toHslString();
      createShadeSpectrum(hueColor);
      updateHueCursor(y, hueColor)
      setCurrentColor(color);
      setColorValues(color);
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

    function createHueSpectrum() {
      const canvas = colorpickerModel.hueCanvas;
      const ctx = colorpickerModel.hueCtx;
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
      colorpickerModel.hue = hsl.h;
      const hsv = color.toHsv();
      const x = colorpickerModel.spectrumRect.width * hsv.s;
      const y = colorpickerModel.spectrumRect.height * (1 - hsv.v);
      const hueY = colorpickerModel.hueRect.height - ((colorpickerModel.hue / 360) * colorpickerModel.hueRect.height);
      updateSpectrumCursor(x, y);
      updateHueCursor(hueY);
      setCurrentColor(color);
      createShadeSpectrum(colorToHue(color));
    }

    // Add event listeners
    colorpickerModel.red.addEventListener('change', () => {
      const color = tinycolor('rgb ' + colorpickerModel.red.value + ' ' + colorpickerModel.green.value + ' ' + colorpickerModel.blue.value );
      colorToPos(color);
    });

    colorpickerModel.green.addEventListener('change', () => {
      const color = tinycolor('rgb ' + colorpickerModel.red.value + ' ' + colorpickerModel.green.value + ' ' + colorpickerModel.blue.value );
      colorToPos(color);
    });

    colorpickerModel.blue.addEventListener('change', () => {
      const color = tinycolor('rgb ' + colorpickerModel.red.value + ' ' + colorpickerModel.green.value + ' ' + colorpickerModel.blue.value );
      colorToPos(color);
    });

    colorpickerModel.hex.addEventListener('change', () => {
      let color = tinycolor('#' + colorpickerModel.hex.value );
      colorToPos(color);
    });

    colorpickerModel.huedisplay.addEventListener('change', () => {
      const color = tinycolor('hsl ' + colorpickerModel.huedisplay.value + ' ' + colorpickerModel.saturationdisplay.value + ' ' + colorpickerModel.lightnessdisplay.value );
      colorToPos(color);
    });

    colorpickerModel.saturationdisplay.addEventListener('change', () => {
      const color = tinycolor('hsl ' + colorpickerModel.huedisplay.value + ' ' + colorpickerModel.saturationdisplay.value + ' ' + colorpickerModel.lightnessdisplay.value );
      colorToPos(color);
    });

    colorpickerModel.lightnessdisplay.addEventListener('change', () => {
      const color = tinycolor('hsl ' + colorpickerModel.huedisplay.value + ' ' + colorpickerModel.saturationdisplay.value + ' ' + colorpickerModel.lightnessdisplay.value );
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

    window.addEventListener('resize', () => {
      refreshElementRects();
    });

    (function ColorPicker() {
      createShadeSpectrum();
      createHueSpectrum();
    }());
  }

  /* ********* BACKGROUND SECTION ************ */

  /*
   * Randomly selects background image and associated author and reference link for page
   * Background images change every time tab is opened or page is refreshed
   * Background images categorized into daytime (7AM-6:59PM) and nighttime (7PM-6:59AM)
   * Background image shown depends on user's local time (day/night)
   */

  function loadBackground() {
    const curTime = new Date();
    const picTime = parseInt(curTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }), 10);
    if (picTime > 6 && picTime < 19) {
      $('.devtab-bg').css('background-image', `url('./assets/img/dayPics/sample${backgroundModel.randomNum}.jpeg')`);
      $('.credits p a').attr('href', backgroundModel.bgInfo[backgroundModel.randomNum].day.url);
      $('#pic-author').text(backgroundModel.bgInfo[backgroundModel.randomNum].day.author);
    } else {
      $('.devtab-bg').css('background-image', `url('./assets/img/nightPics/sample${backgroundModel.randomNum}.jpeg')`);
      $('#pic-author').attr('href', backgroundModel.bgInfo[backgroundModel.randomNum].night.url);
      $('#pic-author').text(backgroundModel.bgInfo[backgroundModel.randomNum].night.author);
    }
  }

  /* ********* GENERAL ************ */

  function setupEventListeners() {
    $(window).on('load', loadBackground);
    $(window).on('click', toggleNameInput())
      .on('click', newsfeedView.toggleNewsfeed)
      .on('click', toolboxView.toggleToolbox)
      .on('click', colorpickerView.toggleColorPicker);
    $('#name-form').on('submit', setUserName);
    $('.start, .stop').on('click', togglePomodoroActive);
    $('.pause').on('click', togglePomodoroPause);
    $('.reset').on('click', resetPomodoro);
    $('.work-break').on('click', toggleWorkBreak);
    $('#html-markup').on('submit', htmlValidatorCall);
    $('#css-markup').on('submit', CSSValidatorCall);
  }

  function initialize() {
    greetingView.showGreeting(greetingModel.getUserName());
    clocksView.updateTime(clocksModel.getTime());
    setupEventListeners();
    loadSounds();
    loadNewsArticles();
    clocksHandler();
    loadPageSpeedChecker();
    loadColorPicker();
    $('.tools-container').hide();
    $('.valid-container').hide();
    $('.page-speed-container').hide();
    $('.devtab-bg').hide().fadeIn(3000);
  }

  window.app.controller = {
    initialize,
  };
}(
  window.app.clocksModel,
  window.app.clocksView,
  window.app.greetingModel,
  window.app.greetingView,
  window.app.newsfeedModel,
  window.app.newsfeedView,
  window.app.toolboxView,
  window.app.htmlModel,
  window.app.htmlView,
  window.app.cssModel,
  window.app.cssView,
  window.app.pagespeedModel,
  window.app.colorpickerModel,
  window.app.colorpickerView,
  window.app.backgroundModel,
));

window.app.controller.initialize();
