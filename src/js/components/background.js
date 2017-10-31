
/* ************************************************************************
BACKGROUND MODEL
************************************************************************* */

(function makeBackgroundModel() {
  const curTime = new Date();
  const picTime = parseInt(curTime.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }), 10);

  const bgInfo = [
    {
      day: {
        author: 'Eberhard Grossgasteiger',
        url: 'https://www.pexels.com/u/eberhardgross/',
      },
      night: {
        author: 'Unknown',
        url: '',
      },
    },
    {
      day: {
        author: 'unknown',
        url: '',
      },
      night: {
        author: 'skeeze',
        url: 'https://pixabay.com/en/milky-way-night-landscape-1669986/',
      },
    },
    {
      day: {
        author: 'unknown',
        url: '',
      },
      night: {
        author: 'Nout Gons',
        url: 'https://www.pexels.com/u/nout-gons-80280/',
      },
    },
    {
      day: {
        author: 'Alex Mihis',
        url: 'https://www.pexels.com/u/mcraftpix/',
      },
      night: {
        author: 'Josh Sorenson',
        url: 'https://www.pexels.com/u/joshsorenson/',
      },
    },
    {
      day: {
        author: 'Paul Ijsendoorn',
        url: 'https://www.pexels.com/u/paul-ijsendoorn-148531/',
      },
      night: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/maldives-pier-dock-lights-bay-1768714/',
      },
    },
    {
      day: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/bled-slovenia-lake-mountains-1899264/',
      },
      night: {
        author: 'Eberhard Grossgasteiger',
        url: 'https://www.pexels.com/u/eberhardgross/',
      },
    },
    {
      day: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/sand-dunes-ripples-wind-wilderness-1550396/',
      },
      night: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/fog-dawn-landscape-morgenstimmung-1494433/',
      },
    },
    {
      day: {
        author: 'Mateusz Dach',
        url: 'https://www.pexels.com/u/mateusz-dach-99805/',
      },
      night: {
        author: 'Ales Krivec',
        url: 'https://www.pexels.com/u/ales-krivec-166939/',
      },
    },
    {
      day: {
        author: 'Matt Read',
        url: 'https://www.pexels.com/u/matt-read-14552/',
      },
      night: {
        author: 'Priseom',
        url: 'https://www.pexels.com/u/priseom-39551/',
      },
    },
    {
      day: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/gleise-old-railroad-tracks-seemed-1555348/',
      },
      night: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/storm-weather-atmosphere-cold-front-2211333/',
      },
    },
    {
      day: {
        author: 'Jonathan Peterson',
        url: 'https://www.pexels.com/u/grizzlybear/',
      },
      night: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/winter-sun-sun-so-sunbeam-sunset-1547273/',
      },
    },
    {
      day: {
        author: 'Jonathan Peterson',
        url: 'https://www.pexels.com/u/grizzlybear/',
      },
      night: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/autumn-fog-colorful-leaves-nature-1127616/',
      },
    },
    {
      day: {
        author: 'Despierres Cecile',
        url: 'https://www.pexels.com/u/despierres-cecile-93261/',
      },
      night: {
        author: 'Nikolai Ulltang',
        url: 'https://www.pexels.com/u/ulltangfilms/',
      },
    },
    {
      day: {
        author: 'Flo Dahm',
        url: 'https://www.pexels.com/u/flo-dahm-154317/',
      },
      night: {
        author: 'Snapwire',
        url: 'https://www.pexels.com/u/snapwire/',
      },
    },
    {
      day: {
        author: 'CC0 Creative Commons',
        url: 'https://pixabay.com/en/beach-rocks-water-sky-east-sunset-1336083/',
      },
      night: {
        author: 'Pixabay',
        url: 'https://www.pexels.com/u/pixabay/',
      },
    },
    {
      day: {
        author: 'Uncoated',
        url: 'https://www.pexels.com/u/uncoated/',
      },
      night: {
        author: 'Kaique Rocha',
        url: 'https://www.pexels.com/u/kaiquestr/',
      },
    },
    {
      day: {
        author: 'Margerretta',
        url: 'https://www.pexels.com/u/margerretta-157232/',
      },
      night: {
        author: 'Pixabay',
        url: 'https://www.pexels.com/u/pixabay/',
      },
    },
    {
      day: {
        author: 'Pixabay',
        url: 'https://www.pexels.com/u/pixabay/',
      },
      night: {
        author: 'Mateusz Dach',
        url: 'https://www.pexels.com/u/mateusz-dach-99805/',
      },
    },
    {
      day: {
        author: 'freestocks',
        url: 'https://www.pexels.com/u/freestocks/',
      },
      night: {
        author: 'Uncoated',
        url: 'https://www.pexels.com/u/uncoated/',
      },
    },
    {
      day: {
        author: 'Daniel Frank',
        url: 'https://www.pexels.com/u/fr3nks/',
      },
      night: {
        author: 'Kaique Rocha',
        url: 'https://www.pexels.com/u/kaiquestr/',
      },
    },
    {
      day: {
        author: 'Alexandre Perotto',
        url: 'https://www.pexels.com/u/alexandre-perotto-44133/',
      },
      night: {
        author: 'Photo Collections',
        url: 'https://www.pexels.com/u/photocollections/',
      },
    },
    {
      day: {
        author: 'Maria Portelles',
        url: 'https://www.pexels.com/u/helioz/',
      },
      night: {
        author: 'Pixabay',
        url: 'https://www.pexels.com/u/pixabay/',
      },
    },
  ];

  const randomNum = Math.floor(Math.random() * bgInfo.length);
  const userInput = 'https://static.pexels.com/photos/226465/pexels-photo-226465.jpeg';

  window.app.backgroundModel = {
    picTime,
    bgInfo,
    randomNum,
    userInput,
  };
}());

/* ************************************************************************
BACKGROUND MODEL
************************************************************************* */

// Store background picture information (day/night, authors, links)
(function makeBackgroundView() {
  function generateDayBg(backgroundModel) {
    $('.devtab-bg').css('background-image', `url('./assets/img/dayPics/sample${backgroundModel.randomNum}.jpeg')`);
    $('#pic-author').attr('href', backgroundModel.bgInfo[backgroundModel.randomNum].day.url);
    $('#pic-author').text(backgroundModel.bgInfo[backgroundModel.randomNum].day.author);
  }

  function generateNightBg(backgroundModel) {
    $('.devtab-bg').css('background-image', `url('./assets/img/nightPics/sample${backgroundModel.randomNum}.jpeg')`);
    $('#pic-author').attr('href', backgroundModel.bgInfo[backgroundModel.randomNum].night.url);
    $('#pic-author').text(backgroundModel.bgInfo[backgroundModel.randomNum].night.author);
  }

  function generateUserBg(backgroundModel) {
    $('.devtab-bg').css('background-image', `url(${backgroundModel.userInput})`);
    $('.credits p').text('');
  }

  window.app.backgroundView = {
    generateDayBg,
    generateNightBg,
    generateUserBg,
  };
}());
