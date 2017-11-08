(function makeStickynoteModel() {
  const colorList = ['blue', 'yellow', 'green', 'purple', 'pink', 'grey', 'red'];
  let colorCounter = -1;

  function makeNote() {
    colorCounter++
    const color = colorList[colorCounter % (colorList.length)]; // cycles through the color list, rather than assigning a random color

    return {
      title: 'Sticky Note',
      barClass: `${color}Bar`,
      areaClass: `${color}Area`,
      text: '',
      left: 600,
      top: 50,
      id: Math.floor(performance.now()), // with performance.now(), in order to get a duplicate ID the user would have to create a new note less than one millisecond after the previous note. highly unlikely.
    };
  }

  function storeNote(note) {
    if (typeof localStorage.getItem('stickNoteStorage') !== 'string') { // If "stickNoteStorage" does not exist then we create it.
      localStorage.setItem('stickNoteStorage', JSON.stringify([]));
    }
    const noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
    noteRetrieve.push(note);
    localStorage.setItem('stickNoteStorage', JSON.stringify(noteRetrieve));
  }
  window.app.stickynoteModel = {
    makeNote,
    storeNote,
  };
}());

(function makeStickynoteView() {
  function makeNote(note) {
    const noteHTML = `
    <div style="display:none" id='${note.id}' class='draggable ui-widget-content stickyContainer ${note.areaClass}' >
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
          <li class="yellowBar"></li>
          <li class="greenBar"></li>
          <li class="blueBar"></li>
          <li class="purpleBar"></li>
          <li class="pinkBar"></li>
          <li class="greyBar"></li>
          <li class="redBar"></li>
        </ul>
      </div>
      <textarea spellcheck="false" class='stickNote ${note.areaClass}'>${note.text}</textarea>
    </div>
    `;

    $('.devtab-bg').append(noteHTML);
    $(`#${note.id}`).fadeIn(250);
    $(`#${note.id}`).css({ left: note.left, top: note.top });

    addEventListeners(note.id);
  }

  function addEventListeners(index) {
    const noteID = index; // When this function is created we will want this function to always remember the ID of a created sticky note.

    function updateStickStorage(notes) {
      localStorage.setItem('stickNoteStorage', JSON.stringify(notes));
    }

    $(`#${noteID} .fa-trash`).click(() => {
      const noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
      $(`#${noteID}`).fadeOut('fast'); // Its fades out for affect, the sticky note is visually removed but technically it still "exists" with a display: none; property.
      setTimeout(() => { $(`#${noteID}`).remove(); }, 1000);
      for (let x = 0; x < noteRetrieve.length; x += 1) {
        if (noteRetrieve[x].id === noteID) {
          noteRetrieve.splice(x, 1); // We splice the sticky note from the array of sticky notes.
          updateStickStorage(noteRetrieve); // updateStickStorage is a function that updates the localstorage.
        }
      }
    });

    $(`#${noteID} .stickLeft`).click(() => { // When the user clicks onto the three dots icon, it displays the sticky note pallete.
      $(`#${noteID} .stickBar`).hide();
      $(`#${noteID} .palleteBar`).fadeIn('slow');
    });

    $(`#${noteID}`).mouseup(() => { // When a user drags a stick note and then RELEASES the stick note or on mouseup, this function will record the left and top css properties.
      const noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
      for (let x = 0; x < noteRetrieve.length; x += 1) {
        if (noteRetrieve[x].id === noteID) { // As we iterate through the array, we check if the noteID is equal to noteRetrieve[x].id.
          // If noteID does equal to noteRetrieve[x].id, then that means we found the correct sticky note to remove.
          noteRetrieve[x].left = $(`#${noteID}`).css('left');
          noteRetrieve[x].top = $(`#${noteID}`).css('top');
          updateStickStorage(noteRetrieve);
        }
      }
    });

    $(`#${noteID}`).click(() => { // This records the text inside of the sticky note.
      $(`#${noteID} textarea`).keydown(() => { // Each time a key is pressed, it records the letter and pushes it into localStorage.
        const noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
        for (let y = 0; y < noteRetrieve.length; y += 1) {
          if (noteRetrieve[y].id === noteID) {
            ((y) => { // This creates an additional closure so that the setTimeout function can access pushRetrieve[y].
              setTimeout(() => { // The reason why we need a setTimeout is because when the keypress event is triggered, .val() will ignore the last letter of the input. setTimeout gives enough time for the input to update then we grab and push the text into localStorage.
                noteRetrieve[y].text = $(`#${noteID} textarea`).val();
                updateStickStorage(noteRetrieve);
                console.log(noteRetrieve[y].text); // This serves no purpose other than to help debug.
              }, 10);
            })(y);
          }
        }
      });
    });

    const colorArray = ['blue', 'yellow', 'green', 'purple', 'pink', 'grey', 'red'];

    for (let x = 0; x < colorArray.length; x += 1) {
      colorEvent(colorArray[x]);
    }

    function colorEvent(index) {
      $(`#${noteID} .palleteBar .${index}Bar`).click(() => {
        const noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
        for (let z = 0; z < noteRetrieve.length; z += 1) {
          if (noteRetrieve[z].id === noteID) {
            $(`#${noteID}`).removeClass(noteRetrieve[z].areaClass).addClass(`${index}Area`);
            $(`#${noteID} textarea`).removeClass(noteRetrieve[z].areaClass).addClass(`${index}Area`);
            $(`#${noteID} .stickBar`).removeClass(noteRetrieve[z].barClass).addClass(`${index}Bar`);

            noteRetrieve[z].areaClass = `${index}Area`;
            noteRetrieve[z].barClass = `${index}Bar`;

            $(`#${noteID} .palleteBar`).hide();
            $(`#${noteID} .stickBar`).fadeIn('slow');
            updateStickStorage(noteRetrieve);
          }
        }
      });
    }

    $(`#${noteID} .stickTitle`).click(() => {
      $(`#${noteID} .stickTitle`).hide();
      $(`#${noteID} .stickTitleInput`).fadeIn('slow');
    });

    $(`#${noteID} form`).submit((e) => {
      e.preventDefault();
      if ($(`#${noteID} .stickTitleInput`).val() == '') {
        $(`#${noteID} .stickTitle`).html('Sticky Note');
      } else {
        $(`#${noteID} .stickTitle`).html($(`#${noteID} .stickTitleInput`).val());
      }
      let noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
      for (let z = 0; z < noteRetrieve.length; z += 1) {
        if (noteRetrieve[z].id === noteID) {
          if ($(`#${noteID} .stickTitleInput`).val() == '') {
            noteRetrieve[z].title = 'Sticky Note';
            $(`#${noteID} .stickTitleInput`).val('');
            updateStickStorage(noteRetrieve);
          } else {
            noteRetrieve[z].title = $(`#${noteID} .stickTitleInput`).val();
            $(`#${noteID} .stickTitleInput`).val('');
            updateStickStorage(noteRetrieve);
          }
        }
      }
      $(`#${noteID} .stickTitleInput`).hide();
      $(`#${noteID} .stickTitle`).fadeIn('slow');
    });

    $('.draggable').draggable({ scroll: false }); // .draggable() makes the sticky notes draggable and scroll: false ensures that the sticky notes wont fly off the screen xD
  }

  function initNotes() {
    if (typeof localStorage.getItem('stickNoteStorage') === 'string') {
      const noteRetrieve = JSON.parse(localStorage.getItem('stickNoteStorage'));
      noteRetrieve.forEach((item) => {
        makeNote(item);
      });
    }
  }

  window.app.stickynoteView = {
    makeNote,
    initNotes,
  };
}());
