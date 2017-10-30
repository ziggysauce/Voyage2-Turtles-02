(function quickLinkFunc() {

	function quickModel(newData) {

		if(typeof localStorage.getItem("linkArray") != 'string') {

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

			localStorage.setItem("linkArray", JSON.stringify(retrieve));//Here, we create the "linkArray" object and we set retrieve as its value.
			
		}

		var retrieve = localStorage.getItem("linkArray");//We declare the retrieve variable and assign the "linkArray" object to retrieve.

		retrieve = JSON.parse(retrieve);//Since the objects in retrieve have been stringified we will parse them back together.

		if (typeof newData == 'object') {

			retrieve.push(newData);
			localStorage.setItem("linkArray", JSON.stringify(retrieve));

		}

		return retrieve;

	}

	function quickView(dataRecieve) {

		var retrieve = dataRecieve();

		for (var i = 0; i < retrieve.length; i++) {//This adds each object into the HTML page.

			$(".quickList").append("<li><a href='" + retrieve[i].url + "'>" + retrieve[i].title + "</a></li>");

		}

	}

	window.app.quickLinkApp = {

	quickModel,
	quickView,

	}
}());