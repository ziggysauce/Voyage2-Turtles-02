/* ************************************************************************
PAGE SPEED MODEL
************************************************************************* */
(function makePageSpeedModel() {
  // Object that will hold the callbacks that process results from the PageSpeed Insights API.
  // const callbacks = {};
  const API_KEY = 'AIzaSyDKAeC02KcdPOHWVEZqdR1t5wwgaFJJKiM';
  const API_URL = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';

  window.app.pagespeedModel = {
    API_KEY,
    API_URL,
    // callbacks,
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
