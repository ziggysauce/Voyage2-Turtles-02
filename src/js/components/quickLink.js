(function quickLinkFunc() {
  function quickModel(newData) {
    if (typeof localStorage.getItem('linkArray') !== 'string') {
      const retrieve = // retrieve is an array of default values for the quickLinks.
      [// Note: The default sites that I added here are dev-based, if you guys prefer anything else or you guys would want to add then tell me :)
        {
          title: 'Github', // A must for any developer ^^
          url: 'https://Github.com',
          id: Math.floor((Math.random() * 1000) + 1),
        },
        {
          title: 'MDN',
          url: 'https://developer.mozilla.org/en-US/',
          id: Math.floor((Math.random() * 1000) + 1),
        },
        {
          title: 'Stack Overflow', // Maybe FreeCodeCamp??
          url: 'https://stackoverflow.com',
          id: Math.floor((Math.random() * 1000) + 1),
        },
      ];

      localStorage.setItem('linkArray', JSON.stringify(retrieve)); // Here, we create the "linkArray" object and we set retrieve as its value.
    }

    let retrieve = localStorage.getItem('linkArray'); // We declare the retrieve variable and assign the "linkArray" object to retrieve.
    retrieve = JSON.parse(retrieve); // Since the objects in retrieve have been stringified we will parse them back together.

    if (typeof newData === 'object') {
      retrieve.push(newData);
      localStorage.setItem('linkArray', JSON.stringify(retrieve));
    }
    return retrieve;
  }

  function quickView(dataRecieve) {
  	$('.quickList li').remove();
  	$('.cancelDelete').hide();
  	$('.deleteDesc').hide();
  	$('.addUrl').hide();
  	$('.addSite').fadeIn('slow');
  	$('.deleteSite').fadeIn('slow');
    const retrieve = dataRecieve();
    for (let i = 0; i < retrieve.length; i += 1) { // This adds each object into the HTML page.
      $('.quickList').append(`<li id='${retrieve[i].id}'><a href="${retrieve[i].url}">${retrieve[i].title}</a></li>`);
    }
  }

  // Fade in/out buggy
  function toggleQuickLinks(e) {
    const qlBox = $('.quickDropdown');
    if (qlBox.is(':visible') && !qlBox.find(e.target).length) {
      qlBox.hide();
    } else if (!qlBox.is(':visible') && e.target === $('.qlToggle')[0]) {
      qlBox.show();
    }
  }

  function deleteView(dataRecieve) {
  	$('.quickList li').remove();
  	const retrieve = dataRecieve();
  	for (let i = 0; i < retrieve.length; i++) {
  		$('.quickList').append(`<li id='${retrieve[i].id}' class="deleteItem">${retrieve[i].title}</li>`);
  		deleteControl(retrieve[i].id);
  	}
  	$('.addSite').hide();
  	$('.deleteSite').hide();
  	$('.deleteDesc').fadeIn('slow');
  	$('.cancelDelete').fadeIn('slow');
  }

  function deleteControl(recieveID) {

  	var linkID = recieveID;

  	var linkRetrieve = quickModel();

  	$('#' + linkID).click(function() {

  		for(var x = 0; x < linkRetrieve.length; x++) {

  			if (linkRetrieve[x].id == linkID) {

  				linkRetrieve.splice(x, 1);

  				$('#' + linkID).fadeOut('slow');

  				localStorage.setItem('linkArray', JSON.stringify(linkRetrieve));

  			}

  		}

  	});

  }

  window.app.quickLinkApp = {
    quickModel,
    quickView,
    deleteView,
    toggleQuickLinks,
  };
}());
