(function makeStickyApp() {
/*-----------------*/
/* -----MODEL----- */
/*-----------------*/
  function stickyNoteModel(newData) {
    if (typeof localStorage.getItem('stickNoteStorage') !== 'string') { // If "stickNoteStorage" does not exist then we create it.
      localStorage.setItem('stickNoteStorage', JSON.stringify([]));
    }

    let noteRetrieve = localStorage.getItem('stickNoteStorage'); // noteRetrieve is the data that will be used to update localStorage and to display the data onto the HTML.
    noteRetrieve = JSON.parse(noteRetrieve);

    if (typeof newData === 'object') {
      noteRetrieve.push(newData);
      localStorage.setItem('stickNoteStorage', JSON.stringify(noteRetrieve));
    }

    console.log(noteRetrieve);
    return noteRetrieve;
  }

  /*-----------------*/
  /* ------VIEW----- */
  /*-----------------*/
  function stickyNoteView(dataRecieve) {
    const modelData = dataRecieve();
    for (let i = 0; i < modelData.length; i += 1) {
      // appendStickNote creates the new sticky note and places data from noteRetrieve into the new sticky note.
      // This uses Template Literals which greatly increases the readability of the HTML below. Thanks @jmbothe for suggesting this!

      // We need to randomize an id for each sticky note but we also need to ensure that each id wont clash into each other.
      //There is an EXTREMELY slight change that 2 ids would be created but the change of it happening is so slight that it isnt worth going through the extra-lines of code to make it fool-proof.

      const appendStickNote = `
      <div style="display:none" id='${modelData[i].id}' class='draggable ui-widget-content stickyContainer ${modelData[i].areaClass}' >
        <div class='stickBar ${modelData[i].barClass}' >
          <i class='fa fa-ellipsis-v stickIcon stickLeft'></i>
          <p class="stickTitle">${modelData[i].title}</p>
          <form class="stickyForm">
          <input class="stickTitleInput" type="text" spellcheck="false" />
          </form>
          <i class='fa fa-trash stickIcon'></i>
        </div>
        <div class='palleteBar blueBar'>
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
        <textarea spellcheck="false" class='stickNote ${modelData[i].areaClass}'>${modelData[i].text} </textarea>
      </div>
      `;

      $('.devtab-bg').append(appendStickNote); // Adds appendStickNote to the HTML page.
      $(`#${modelData[i].id}`).fadeIn(250);
      // This places the sticky note where it was last placed by defining the CSS "left" and "top" properties.
      $(`#${modelData[i].id}`).css({ left: modelData[i].left, top: modelData[i].top });

      addEventListener(modelData[i].id); // The function is called and begins to listen for events.
    }
  }

  /*------------------*/
  /* ---CONTROLLER--- */
  /*------------------*/
  function addEventListener(index) {
    const noteID = index; // When this function is created we will want this function to always remember the ID of a created sticky note.
    const noteRetrieve = stickyNoteModel(); // Grabs data from model.

    function updateStickStorage() {
      localStorage.setItem('stickNoteStorage', JSON.stringify(noteRetrieve));
    }

    $(`#${noteID} .fa-trash`).click(() => {
      $(`#${noteID}`).fadeOut('fast'); // Its fades out for affect, the sticky note is visually removed but technically it still "exists" with a display: none; property.
      setTimeout(() => { $(`#${noteID}`).remove(); }, 1000);
      for (let x = 0; x < noteRetrieve.length; x += 1) {
        if (noteRetrieve[x].id === noteID) {
          noteRetrieve.splice(x, 1); // We splice the sticky note from the array of sticky notes.
          console.log(noteRetrieve); // The console.logs are simply for debugging purposes. I'll remove them when are code is product ready.
          console.log(noteID);
          updateStickStorage(); // updateStickStorage is a function that updates the localstorage.
        }
      }
    });

    $(`#${noteID} .stickLeft`).click(() => { // When the user clicks onto the three dots icon, it displays the sticky note pallete.
      $(`#${noteID} .stickBar`).hide();
      $(`#${noteID} .palleteBar`).fadeIn('slow');
    });

    $(`#${noteID}`).mouseup(() => { // When a user drags a stick note and then RELEASES the stick note or on mouseup, this function will record the left and top css properties.
      for (let x = 0; x < noteRetrieve.length; x += 1) {
        if (noteRetrieve[x].id === noteID) { // As we iterate through the array, we check if the noteID is equal to noteRetrieve[x].id.
          // If noteID does equal to noteRetrieve[x].id, then that means we found the correct sticky note to remove.
          noteRetrieve[x].left = $(`#${noteID}`).css('left');
          noteRetrieve[x].top = $(`#${noteID}`).css('top');
          updateStickStorage();
        }
      }
    });

    $(`#${noteID}`).click(() => { // This records the text inside of the sticky note.
      $(`#${noteID} textarea`).keydown(() => { // Each time a key is pressed, it records the letter and pushes it into localStorage.
        for (let y = 0; y < noteRetrieve.length; y += 1) {
          if (noteRetrieve[y].id === noteID) {
            ((y) => { // This creates an additional closure so that the setTimeout function can access pushRetrieve[y].
              setTimeout(() => { // The reason why we need a setTimeout is because when the keypress event is triggered, .val() will ignore the last letter of the input. setTimeout gives enough time for the input to update then we grab and push the text into localStorage.
                noteRetrieve[y].text = $(`#${noteID} textarea`).val();
                   updateStickStorage();
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
        for (let z = 0; z < noteRetrieve.length; z += 1) {
          if (noteRetrieve[z].id === noteID) {
            $(`#${noteID}`).removeClass(noteRetrieve[z].areaClass).addClass(`${index}Area`);
            $(`#${noteID} textarea`).removeClass(noteRetrieve[z].areaClass).addClass(`${index}Area`);
            $(`#${noteID} .stickBar`).removeClass(noteRetrieve[z].barClass).addClass(index + "Bar");

            noteRetrieve[z].areaClass = `${index}Area`;
            noteRetrieve[z].barClass = index + "Bar";

            $(`#${noteID} .palleteBar`).hide();
            $(`#${noteID} .stickBar`).fadeIn('slow');
            updateStickStorage();
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
      for (let z = 0; z < noteRetrieve.length; z += 1) {
        if (noteRetrieve[z].id === noteID) {
          if ($(`#${noteID} .stickTitleInput`).val() == '') {
          noteRetrieve[z].title = 'Sticky Note';
          $(`#${noteID} .stickTitleInput`).val('');
          updateStickStorage();
          }else {
          noteRetrieve[z].title = $(`#${noteID} .stickTitleInput`).val();
          $(`#${noteID} .stickTitleInput`).val('');
          updateStickStorage();
          }
        }
      }
      $(`#${noteID} .stickTitleInput`).hide();
      $(`#${noteID} .stickTitle`).fadeIn('slow');
    });

    $('.draggable').draggable({ scroll: false }); // .draggable() makes the sticky notes draggable and scroll: false ensures that the sticky notes wont fly off the screen xD
  }

  window.app.stickyApp = {
    stickyNoteModel,
    stickyNoteView,
  };
}());
