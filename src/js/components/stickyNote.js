(function makeStickynoteModel() {
  const colorList = ['blue', 'yellow', 'green', 'purple', 'pink', 'grey', 'red'];
  let colorCounter = -1;

  function makeNote() {
    colorCounter++
    const color = colorList[colorCounter % (colorList.length)]; // cycles through the color list, rather than assigning a random color

    return {
      title: 'Sticky Note',
      color,
      barClass: `${color}Bar`,
      areaClass: `${color}Area`,
      text: '',
      left: 600,
      top: 50,
      id: Math.floor(performance.now()), // with performance.now(), in order to get a duplicate ID the user would have to create a new note less than one millisecond after the previous note. highly unlikely.
    };
  }

  function storeNote(note) {
    if (typeof localStorage.getItem('stickyNotes') !== 'string') { // If "stickyNotes" does not exist then we create it.
      localStorage.setItem('stickyNotes', JSON.stringify([]));
    }
    const noteRetrieve = JSON.parse(localStorage.getItem('stickyNotes'));
    noteRetrieve.push(note);
    localStorage.setItem('stickyNotes', JSON.stringify(noteRetrieve));
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
    })
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
    <div style="display:none" id='${note.id}' class='draggable ui-widget-content stickyContainer ${note.areaClass}' data-color="${note.color}" >
      <div class='stickBar ${note.barClass}' >
        <i class='fa fa-ellipsis-v stickIcon stickLeft'></i>
        <p class="stickTitle">${note.title}</p>
        <form class="stickyForm">
        <input class="stickTitleInput" type="text" spellcheck="false" />
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
      <textarea spellcheck="false" class='stickNote ${note.areaClass}'>${note.text}</textarea>
    </div>
    `;

    $('.devtab-bg').append(noteHTML);
    $(`#${note.id}`).fadeIn(250);
    $(`#${note.id}`).css({ left: note.left, top: note.top });
    $('.draggable').draggable({ scroll: false });
  }

  function deleteNote(noteID) {
    $(`#${noteID}`).fadeOut('fast'); // Its fades out for affect, the sticky note is visually removed but technically it still "exists" with a display: none; property.
    setTimeout(() => { $(`#${noteID}`).remove(); }, 1000);
  }

  function changeColor(noteID, previousColor, newColor) {
    $(`#${noteID}`).removeClass(`${previousColor}Area`).addClass(`${newColor}Area`);
    $(`#${noteID}`).data('color', newColor);
    $(`#${noteID} textarea`).removeClass(`${previousColor}Area`).addClass(`${newColor}Area`);
    $(`#${noteID} .stickBar`).removeClass(`${previousColor}Bar`).addClass(`${newColor}Bar`);
    $(`#${noteID} .palleteBar`).hide();
    $(`#${noteID} .stickBar`).fadeIn('slow');
  }

  function changeTitle(noteID, newTitle) {
    $(`#${noteID} .stickTitle`).html(newTitle);
    $(`#${noteID} .stickTitleInput`).hide();
    $(`#${noteID} .stickTitle`).fadeIn('slow');
  }

  function initNotes() {
    if (typeof localStorage.getItem('stickyNotes') === 'string') {
      const noteRetrieve = JSON.parse(localStorage.getItem('stickyNotes'));
      noteRetrieve.forEach((item) => {
        makeNote(item);
      });
    }
  }

  function toggleTitleEdit(noteID) {
    $(`#${noteID} .stickTitle`).hide();
    $(`#${noteID} .stickTitleInput`).fadeIn('slow');
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
