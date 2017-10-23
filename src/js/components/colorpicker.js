
/* ************************************************************************
COLOR PICKER MODEL
************************************************************************* */

// (function makeColorPickerModel() {
//   const APIKey = 'dcbb5b4e58ce4a95941e5a3f5ba1c9b8';
//   const sources = ['hacker-news', 'recode', 'techcrunch'];
//   const articlesList = [];
//
//   window.app.newsfeedModel = {
//     APIKey,
//     sources,
//     articlesList,
//   };
// }());

/* ************************************************************************
COLOR PICKER VIEW
************************************************************************* */
(function makeColorPickerView() {
  const colorpicker = $('.color-picker-panel');

  function toggleColorPicker(e) {
    if (colorpicker.is(':visible') && !colorpicker.find(e.target).length) {
      colorpicker.fadeOut();
    } else if (!colorpicker.is(':visible') && e.target === $('.fa-paint-brush')[0]) {
      colorpicker.fadeIn();
    }
  }

  window.app.colorpickerView = {
    toggleColorPicker,
  };
}());
