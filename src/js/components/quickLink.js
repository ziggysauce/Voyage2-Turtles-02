(function makeQuicklinksModel() {
  function addLink(newData) {
    if (typeof localStorage.getItem('quickLinks') !== 'string') {
      const linksArray = // here linksArray is an array of default values for the quickLinks.
      [
        {
          title: 'Github',
          url: 'https://Github.com',
        },
        {
          title: 'MDN',
          url: 'https://developer.mozilla.org/en-US/',
        },
        {
          title: 'Stack Overflow',
          url: 'https://stackoverflow.com',
        },
      ];

      localStorage.setItem('quickLinks', JSON.stringify(linksArray));
    } else if (newData) {
      const linksArray = JSON.parse(localStorage.getItem('quickLinks'));
      linksArray.push(newData);
      localStorage.setItem('quickLinks', JSON.stringify(linksArray));
    }
  }

  function deleteLink(index) {
    const linksArray = JSON.parse(localStorage.getItem('quickLinks'));
    linksArray.splice(index, 1);
    localStorage.setItem('quickLinks', JSON.stringify(linksArray));
  }

  window.app.quicklinksModel = {
    addLink,
    deleteLink,
  };
}());

(function makeQuicklinksView() {
  function appendLinks() {
    const linksArray = JSON.parse(localStorage.getItem('quickLinks'));

    $('.quickList').empty();

    for (let i = 0; i < linksArray.length; i++) {
      $(`
        <li>
          <a href="${linksArray[i].url}" target="_blank" rel="noopener">${linksArray[i].title}</a>
          <button class="link-delete">x</button>
        </li>
      `).appendTo($('.quickList'));
    }
  }

  function toggleAddSite(shouldHideInputs) {
    if (shouldHideInputs) {
      $('.addUrl').hide();
      $('.addSite').fadeIn('slow');
      $('#titleInput').val('');
      $('#urlInput').val('');
    } else {
      $('.addSite').hide();
      $('.addUrl').fadeIn('slow');
    }
  }

  function toggleQuickLinks(e) {
    const qlBox = $('.quickDropdown');
    if (qlBox.is(':visible') && !qlBox.find(e.target).length && !$(e.target).is('.link-delete')) {
      qlBox.fadeOut();
      toggleAddSite(true);
    } else if (!qlBox.is(':visible') && e.target === $('.qlToggle')[0]) {
      qlBox.fadeIn();
    }
  }

  window.app.quicklinksView = {
    appendLinks,
    toggleQuickLinks,
    toggleAddSite,
  };
}());
