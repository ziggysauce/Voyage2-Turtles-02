
$(document).ready(function() {

	if(typeof localStorage.getItem("linkArray") == 'string') {//localStorage can only contain strings, if "linkArray" isnt a string then it cant exist.
															  //The reason I use this versus checking if the value is null is because
															  //"linkArray" could return null, NaN, and undefined and this creates less code and it is less messy.

		var retrieve = localStorage.getItem("linkArray");//We declare the retrieve variable and assign the "linkArray" object to retrieve.

		retrieve = JSON.parse(retrieve);//Since the objects in retrieve have been stringified we will parse them back together.

		for(var i = 0; i < retrieve.length; i++) {//We iterate through each object in retrieve and we push it to the HTML page.

			$(".quickList").append("<li><a href='" + retrieve[i].url + "'>" + retrieve[i].title + "</a></li>");

		}
	}

	else {
		//Since the object "linkArray" doesnt exist, we create the linkArray.

		var retrieve = //retrieve is an array of default values for the quickLinks.
		[//NOTE: The default sites that I added here are dev-based, if you guys prefer anything else or you guys would want to add then tell me :)
		{

			title: "Github",//A must for any developer ^^
			url: "https://Github.com",
			id: 1

		},
		{

			title: "MDN",
			url: "https://developer.mozilla.org/en-US/",
			id: 2

		},
		{

			title: "Stack Overflow",//Maybe FreeCodeCamp??
			url: "https://stackoverflow.com",
			id: 3

		}
		];

		for(var i = 0; i < retrieve.length; i++) {//This adds each object into the HTML page.

			$(".quickList").append("<li><a href='" + retrieve[i].url + "'>" + retrieve[i].title + "</a></li>");

		}

		localStorage.setItem("linkArray", JSON.stringify(retrieve));//Here, we create the "linkArray" object and we set retrieve as its value.

	}

	//Event Handlers

	$(".addSite").click(function() {

		$('.addUrl').fadeToggle("slow");

	});

	$("#targetForm").submit(function(e) {//When the quickLinks submit button is pressed, this will grab the input values and push it to localStorage.

		e.preventDefault();

		var titleInput = $("#titleInput").val();
		var urlInput = $("#urlInput").val();


			var newObject = {//In order to push this to localStorage we will want it in object form so that the for loop above can access these properties.

				title: titleInput,
				url: urlInput

			}

			retrieve.push(newObject);//We push our newObject into retrieve.

			$(".quickList").append("<li><a href='" + newObject.url + "'>" + newObject.title + "</a></li>");//Before we push this to localStorage, we need to add the new link to the HTML Page.

			localStorage.setItem("linkArray", JSON.stringify(retrieve));//localStorage only accepts string values so we stringify retrieve so it can be placed into localStorage.

			$('.addUrl').fadeOut('slow');

			//This resets the inputs so that it doesnt show the link you already put in.
			$("#titleInput").val("");
			$("#urlInput").val("");

		

	});
});