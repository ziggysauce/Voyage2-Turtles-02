/* ************************************************************************
TOOLBOX VIEW
************************************************************************* */

(function makeToolboxView() {
  const htmlBox = $('.valid-container.html-validator');
  const cssBox = $('.valid-container.css-validator');
  const toolsBox = $('.tools-container');
  const speedBox = $('.page-speed-container');

  function toggleToolbox(e) {
    if (htmlBox.is(':visible') && !htmlBox.find(e.target).length) {
      htmlBox.fadeOut();
    } else if (!htmlBox.is(':visible') && e.target === $('#html-val')[0]) {
      toolsBox.fadeOut();
      htmlBox.fadeIn();
    } else if (speedBox.is(':visible') && !speedBox.find(e.target).length) {
      speedBox.fadeOut();
    } else if (!speedBox.is(':visible') && e.target === $('#insights')[0]) {
      toolsBox.fadeOut();
      speedBox.fadeIn();
    } else if (cssBox.is(':visible') && !cssBox.find(e.target).length) {
      cssBox.fadeOut();
    } else if (!cssBox.is(':visible') && e.target === $('#css-val')[0]) {
      toolsBox.fadeOut();
      cssBox.fadeIn();
    } else if (toolsBox.is(':visible') && !toolsBox.find(e.target).length) {
      toolsBox.fadeOut();
    } else if (!toolsBox.is(':visible') && e.target === $('.fa-wrench')[0]) {
      toolsBox.fadeIn();
    }
  }

  window.app.toolboxView = {
    toggleToolbox,
  };
}());

/* ************************************************************************
PAGE SPEED MODEL
************************************************************************* */
(function makePageSpeedModel() {
  // Object that will hold the callbacks that process results from the PageSpeed Insights API.
  const API_KEY = 'AIzaSyDKAeC02KcdPOHWVEZqdR1t5wwgaFJJKiM';
  const API_URL = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';

  window.app.pagespeedModel = {
    API_KEY,
    API_URL,
  };
}());

/* ************************************************************************
PAGE SPEED VIEW
************************************************************************* */

// (function makePageSpeedView() {
//   function generatePageSpeedBox() {
//     $('.returnresults').append(`
//       <pre id="output" class="page-speed-box"></pre>
//       <pre id="possible" class="page-speed-box"></pre>
//       <pre id="found" class="page-speed-box"></pre>
//     `);
//   }
//
//   window.app.pagespeedView = {
//     generatePageSpeedBox,
//   };
// }());

/* ************************************************************************
HTML VALIDATOR MODEL
************************************************************************* */
(function makeHtmlModel() {
  const format = function getData(data) {
    const useData = data.messages;
    function filter(filterdata) {
      return (`Type: ${filterdata.type}\nLine: ${filterdata.lastLine}\nMessage: ${filterdata.message}\n\n`);
    }

    return (useData.map(filter).join(''));
  };

  window.app.htmlModel = {
    format,
  };
}());

/* ************************************************************************
HTML VALIDATOR VIEW
************************************************************************* */

(function makeHtmlValidatorView() {
  const $output = $('#html-validated>code');

  function successOutput(result) {
    $output.text(result);
  }

  function errorOutput() {
    $output.text('Sorry, it looks like this code is outdated. Please update your extension or feel free to send a pull request with your own personal updates.');
  }

  window.app.htmlView = {
    successOutput,
    errorOutput,
  };
}());

/* ************************************************************************
CSS VALIDATOR MODEL
************************************************************************* */

(function makeCSSValidatorModel() {
  function format(type, line, message) {
    return `
    Type: ${type}
    Line: ${line}
    Message: ${message}
    `;
  }
  window.app.cssModel = {
    format,
  };
}());

/* ************************************************************************
CSS VALIDATOR VIEW
************************************************************************* */

(function makeCSSValidatorView() {
  const $output = $('#css-validated>code');

  function successOutput(results, format) {
    $output.text(results.map((item) => {
      return format(item.type, item.line, item.message);
    }).join(''));
  }

  function errorOutput() {
    $output.text('Error validating code. Please refresh, or try again later.');
  }
  window.app.cssView = {
    successOutput,
    errorOutput,
  };
}());
