$(document).ready(function (){	

			if (typeof localStorage.getItem("stickNoteStorage") != 'string') {//If "stickNoteStorage" does not exist then we create it.

				localStorage.setItem("stickNoteStorage", JSON.stringify([]));

			}

			var noteRetrieve = localStorage.getItem("stickNoteStorage");//noteRetrieve is the data that will be used to update localStorage and to display the data onto the HTML.

			noteRetrieve = JSON.parse(noteRetrieve);

			console.log(localStorage.getItem("stickNoteStorage"));

			


			/*-----------------*/
			/***--IMPORTANT--***/
			/*-----------------*/	

			for (var i = 0; i < noteRetrieve.length; i++) {

				//appendStickNote creates the new sticky note and places data from noteRetrieve into the new sticky note.
				//This uses Template Literals which greatly increases the readability of the HTML below. Thanks @jmbothe for suggesting this! 

				noteRetrieve[i].id = Math.floor((Math.random() * 1000) + 1); //We need to randomize an id for each sticky note but we also need to ensure that each id wont clash into each other.
																			 //There is an EXTREMELY slight change that 2 ids would be created but the change of it happening is so slight that it isnt worth going through the extra-lines of code to make it fool-proof.

				var appendStickNote =` 

				<div id='${noteRetrieve[i].id}' class='draggable ui-widget-content stickyContainer ${noteRetrieve[i].areaClass}' >

					<div class='stickBar ${noteRetrieve[i].barClass}' >

						<i class='fa fa-ellipsis-v stickIcon stickLeft'></i>

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

						</ul>

					</div>

					<textarea class='stickNote ${noteRetrieve[i].areaClass}'>${noteRetrieve[i].text} </textarea>

				</div>

				`
			
				

				$("body").append(appendStickNote);//Adds appendStickNote to the HTML page.

				//This places the sticky note where it was last placed by defining the CSS "left" and "top" properties.
				$("#" + noteRetrieve[i].id).css({left: noteRetrieve[i].left, top: noteRetrieve[i].top});

				addEventListener(noteRetrieve[i].id);//The function is called and begins to listen for events. 
			}

			/*-------------------------------------------------------------------------------------------------------*/
				//Each time the for loop is iterated, a NEW function is run. Each event listener within the function is unique thanks to Closure. 
				//What problem does this solve? If I were to use class selectors to provide a listener to ALL sticky notes, all the stick notes
				//would be deleted. If I wanted to change the color of a sticky note, ALL sticky notes would change color. The function below creates appropriate event listeners for the SPECIFIC sticky note that was clicked on.

				function addEventListener(index) {

					var noteID = index; //When this function is created we will want this function to always remember the ID of a created sticky note.
													 // noteID grabs noteRetrieve[index].id and stores it within the function so that the function can grab it when an event listener is triggered.

					$("#" + noteID + " .fa-trash").click(function() {

						$("#" + noteID).fadeOut("fast");//Its fades out for affect, the sticky note is visually removed but technically it still "exists" with a display: none; property.

						setTimeout(function(){$("#" + noteID).remove();}, 1000);

						//We need to actually remove the sticky note from localstorage so we need to splice the sticky object from noteRetrieve..
						for (var x = 0; x < noteRetrieve.length; x++) {

							if (noteRetrieve[x].id == noteID) {//As we iterate through the array, we check if the noteID is equal to noteRetrieve[x].id.
															   //If noteID does equal to pushRetrieve[x].id, then that means we found the correct sticky note to remove.

								noteRetrieve.splice(x, 1);//We splice the sticky note from the array of sticky notes.

								console.log(noteRetrieve);//The console.logs are simply for debugging purposes. I'll remove them when are code is product ready.
								
								console.log(noteID);

								updateStickStorage();//updateStickStorage is a function that updates the localstorage.

							}

						}


					});

					$("#" + noteID + " .stickLeft").click(function() {//When the user clicks onto the three dots icon, it displays the sticky note pallete.

						$("#" + noteID + " .stickBar").hide();

						$("#" + noteID + " .palleteBar").fadeIn("slow");

					}); 

					$("#" + noteID).mouseup(function() {//When a user drags a stick note and then RELEASES the stick note or on mouseup, this function will record the left and top css properties.

						for (var x = 0; x < noteRetrieve.length; x++) {

							if (noteRetrieve[x].id == noteID) {//As we iterate through the array, we check if the noteID is equal to noteRetrieve[x].id.
															   //If noteID does equal to noteRetrieve[x].id, then that means we found the correct sticky note to remove.

								noteRetrieve[x].left = $("#" + noteID).css("left");

								noteRetrieve[x].top	 = $("#" + noteID).css("top");						  

								updateStickStorage();

							}

						}

					});

					$("#" + noteID).click(function() {//This records the text inside of the sticky note.

						$("#" + noteID + " textarea").keypress(function() {//Each time a key is pressed, it records the letter and pushes it into localStorage.

							for (var y = 0; y < noteRetrieve.length; y++) {

								if (noteRetrieve[y].id == noteID) {

									(function(y) {//This creates an additional closure so that the setTimeout function can access pushRetrieve[y].

										setTimeout(function() {//The reason why we need a setTimeout is because when the keypress event is triggered, .val() will ignore the last letter of the input. setTimeout gives enough time for the input to update then we grab and push the text into localStorage.

											noteRetrieve[y].text = $("#" + noteID + " textarea").val()

											updateStickStorage();

											console.log(noteRetrieve[y].text);//This serves no purpose other than to help debug.

										}, 100);

									})(y);

								}

							}

						});

					});

					/*After a good bit of effort, I took Dan's advice and took another whack at minimizing the insane list of event listeners and it works! :D thanks @ziggysauce!
					This reduces the amount of code by almost 100 lines!*/
					var colorArray = [//These are the names of classes that have already been defined in the CSS.

					{

						areaClass: "yellowArea",
						barClass: "yellowBar"

					},

					{

						areaClass: "greenArea",
						barClass: "greenBar"

					},

					{

						areaClass: "blueArea",
						barClass: "blueBar"

					},

					{

						areaClass: "purpleArea",
						barClass: "purpleBar"

					},

					{

						areaClass: "pinkArea",
						barClass: "pinkBar"

					},

					{

						areaClass: "greyArea",
						barClass: "greyBar"

					}
					
					];

					for (var x = 0; x < colorArray.length; x++) {//
						
						colorEvent(colorArray[x]);

					}

					function colorEvent(index) {

						$("#" + noteID + " .palleteBar" + " ." + index.barClass).click(function() {

							for(var z = 0; z < noteRetrieve.length; z++) {

								if(noteRetrieve[z].id == noteID) {

									$("#" + noteID).removeClass(noteRetrieve[z].areaClass).addClass(index.areaClass);
									$("#" + noteID + " textarea").removeClass(noteRetrieve[z].areaClass).addClass(index.areaClass);
									$("#" + noteID + " .stickBar").removeClass(noteRetrieve[z].barClass).addClass(index.barClass);

									noteRetrieve[z].areaClass = index.areaClass;
									noteRetrieve[z].barClass = index.barClass;

									$("#" + noteID + " .palleteBar").hide();

									$("#" + noteID + " .stickBar").fadeIn("slow");

									updateStickStorage();

								}

							}

						}); 

					}

					function updateStickStorage() {//This updates the localStorage.

						localStorage.setItem("stickNoteStorage", JSON.stringify(noteRetrieve));

					}

				}


			$(".draggable").draggable({scroll: false});//.draggable() makes the sticky notes draggable and scroll: false ensures that the sticky notes wont fly off the screen xD


			$("#newNote").click(function() {//When the new note button is clicked, a new note is created, appended into the HTML page, and then pushed into localStorage.

				var newStickObject = {

					text: "",
					areaClass: "blueArea",
					barClass: "blueBar",
					left: 1000,
					top: 50,
					id: Math.floor((Math.random() * 1000) + 1)

				}

				var newStickNote =` 

				<div id='${newStickObject.id}' class='draggable ui-widget-content stickyContainer ${newStickObject.areaClass}' >

					<div class='stickBar ${newStickObject.barClass}' >

						<i class='fa fa-ellipsis-v stickIcon stickLeft'></i>

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

						</ul>

					</div>

					<textarea class='stickNote ${newStickObject.areaClass}'>${newStickObject.text}</textarea>

				</div>

				`


				// pushRetrieve.push(newStickObject);
				noteRetrieve.push(newStickObject);

				$("body").append(newStickNote);

				$("#" + newStickObject.id).css({left: newStickObject.left, top: newStickObject.top});

				$(".draggable").draggable({scroll: false});//We have to make sure the newly created sticky note is draggable.

				addEventListener(newStickObject.id);//We need to make a set of event listeners for the new stick note so we declare the addEventListener function.
				console.log(noteRetrieve);
			});

			
		});