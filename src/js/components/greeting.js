/* ************************************************************************
USER GREETING MODEL
************************************************************************* */
(function makeGreetingModel() {
  const setUserName = name => localStorage.setItem('userName', name);
  const getUserName = () => localStorage.getItem('userName');

  window.app.greetingModel = {
    setUserName,
    getUserName,
  };
}());
/* ************************************************************************
USER GREETING VIEW
************************************************************************* */
(function makeGreetingView() {
  const nameForm = $('#name-form');
  const nameInput = $('#name-input');
  const name = $('#user-greeting-name');
  const time = $('#user-greeting-time');

  function showGreeting(userName) {
    if (userName) {
      name.html(`, <button>${userName}</button>.`);
    } else {
      name.html(', what\'s your <button>name</button>?');
    }
    nameForm.hide();
    nameInput.val('').blur();
    name.show();
    time.show();
  }

  function greetByTime(backgroundModel) {
    if (backgroundModel.picTime > 3 && backgroundModel.picTime < 12) {
      time.html('Good morning');
    } else if (backgroundModel.picTime > 12 && backgroundModel.picTime < 17) {
      time.html('Good afternoon');
    } else if (backgroundModel.picTime > 17 || backgroundModel.picTime < 3) {
      time.html('Good evening');
    }
    name.show();
    time.show();
  }

  function showNameInput() {
    nameForm.show();
    nameInput.focus();
    name.hide();
    time.hide();
  }

  function toggleNameInput(userName) {
    return function handler(e) {
      if (nameInput.is(':visible') && e.target !== nameInput[0]) {
        showGreeting(userName);
        greetByTime();
      } else if (!nameInput.is(':visible') && e.target === $('.user-greeting button')[0]) {
        showNameInput();
      }
    };
  }

  window.app.greetingView = {
    showGreeting,
    greetByTime,
    showNameInput,
    toggleNameInput,
  };
}());
