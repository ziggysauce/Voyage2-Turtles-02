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
  const greeting = $('.user-greeting h1');

  function showGreeting(userName) {
    if (userName) {
      greeting.html(`Hello, <button>${userName}</button>.`);
    } else {
      greeting.html('Hello. What\'s your <button>name</button>?');
    }
    nameForm.hide();
    nameInput.val('').blur();
    greeting.show();
  }

  function showNameInput() {
    nameForm.show();
    nameInput.focus();
    greeting.hide();
  }

  function toggleNameInput(userName) {
    return function handler(e) {
      if (nameInput.is(':visible') && e.target !== nameInput[0]) {
        showGreeting(userName);
      } else if (!nameInput.is(':visible') && e.target === $('.user-greeting button')[0]) {
        showNameInput();
      }
    };
  }

  window.app.greetingView = {
    showGreeting,
    showNameInput,
    toggleNameInput,
  };
}());
