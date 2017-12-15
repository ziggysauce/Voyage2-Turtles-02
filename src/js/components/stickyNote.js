(function makeStickynoteModel() {
  const colorList = ['blue', 'yellow', 'green', 'purple', 'pink', 'grey', 'red'];
  let colorCounter = -1;

  function makeNote() {
    colorCounter++;
    const color = colorList[colorCounter % (colorList.length)]; // cycles through the color list, rather than assigning a random color

    return {
      title: 'Click to change',
      color,
      text: '',
      left: 600,
      top: 50,
      id: Math.floor(performance.now()), // with performance.now(), in order to get a duplicate ID the user would have to create a new note less than one millisecond after the previous note. highly unlikely.
    };
  }

  function storeNote(note) {
    const nothingInStorage = typeof localStorage.getItem('stickyNotes') !== 'string';

    if (nothingInStorage) {
      localStorage.setItem('stickyNotes', JSON.stringify([]));
    }
    const stickyNotes = JSON.parse(localStorage.getItem('stickyNotes'));

    stickyNotes.push(note);
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));
  }

  function deleteNote(noteID) {
    const stickyNotes = JSON.parse(localStorage.getItem('stickyNotes'));
    const index = stickyNotes.findIndex(note => note.id == noteID);

    stickyNotes.splice(index, 1);
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));
  }

  function changeState(noteID, obj) {
    const stickyNotes = JSON.parse(localStorage.getItem('stickyNotes'));
    const index = stickyNotes.findIndex(note => note.id == noteID);

    Object.keys(obj).forEach((item) => {
      stickyNotes[index][item] = obj[item];
    });
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));
  }
  window.app.stickynoteModel = {
    makeNote,
    storeNote,
    deleteNote,
    changeState,
  };
}());

(function makeStickynoteView() {
  function makeNote(note) {
    const noteHTML = `
    <div style="display:none" id='${note.id}'
      class='draggable resizable ui-widget-content ui-state-active stickyContainer ${note.color}Area'
      data-color="${note.color}">
      <div class='stickBar ${note.color}Bar' >
        <i class='fa fa-ellipsis-v stickIcon stickLeft'></i>
        <div class="title-and-cancel">
          <p class="stickTitle">${note.title}</p>
        </div>
        <form class="stickyForm">
          <input class="stickTitleInput" placeholder="title" type="text" spellcheck="false" autofocus="autofocus" />
        </form>
        <i class='fa fa-trash stickIcon'></i>
      </div>
      <div class='palleteBar'>
        <ul>
          <li class="yellowBar colorBar" data-color="yellow"></li>
          <li class="greenBar colorBar" data-color="green"></li>
          <li class="blueBar colorBar" data-color="blue"></li>
          <li class="purpleBar colorBar" data-color="purple"></li>
          <li class="pinkBar colorBar" data-color="pink"></li>
          <li class="greyBar colorBar" data-color="grey"></li>
          <li class="redBar colorBar" data-color="red"></li>
        </ul>
      </div>
      <textarea spellcheck="false" class='stickNote ${note.color}Area'>${note.text}</textarea>
    </div>
    `;

    $('.devtab-bg').append(noteHTML);
    $(`#${note.id}`).fadeIn(250);
    $(`#${note.id}`).css({ left: note.left, top: note.top });
    $('.draggable').draggable({ scroll: false });
  }

  function deleteNote(noteID) {
    $(`#${noteID}`).fadeOut('fast', () => $(`#${noteID}`).remove());
  }

  function changeColor(noteID, previousColor, newColor) {
    $(`#${noteID}`)
      .removeClass(`${previousColor}Area`)
      .addClass(`${newColor}Area`)
      .data('color', newColor);

    $(`#${noteID} textarea`)
      .removeClass(`${previousColor}Area`)
      .addClass(`${newColor}Area`);

    $(`#${noteID} .stickBar`)
      .removeClass(`${previousColor}Bar`)
      .addClass(`${newColor}Bar`);

    $(`#${noteID} .palleteBar`).hide();
    $(`#${noteID} .stickBar`).fadeIn('slow');
  }

  function changeTitle(noteID, newTitle) {
    $(`#${noteID} .stickTitle`).html(newTitle).fadeIn();
    $(`#${noteID} .stickTitleInput`).hide();
    $(`#${noteID} .title-and-cancel`).fadeIn();
  }

  function initNotes() {
    const storageExists = typeof localStorage.getItem('stickyNotes') === 'string';

    if (storageExists) {
      const stickyNotes = JSON.parse(localStorage.getItem('stickyNotes'));

      stickyNotes.forEach((note) => {
        makeNote(note);
      });
    }
  }

  function toggleTitleEdit(noteID) {
    $(`#${noteID} .stickTitle`).hide();
    $(`#${noteID} .stickTitleInput`).fadeIn('slow');
    $(`#${noteID} .stickTitleInput`).focus();
    $(`#${noteID} .title-and-cancel`).hide();
  }

  function toggleColorOptions(noteID) {
    $(`#${noteID} .stickBar`).hide();
    $(`#${noteID} .palleteBar`).fadeIn('slow');
  }

  window.app.stickynoteView = {
    makeNote,
    deleteNote,
    initNotes,
    changeColor,
    changeTitle,
    toggleTitleEdit,
    toggleColorOptions,
  };
}());
