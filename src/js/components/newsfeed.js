/* ************************************************************************
NEWSFEED MODEL
************************************************************************* */
(function makeNewsfeedModel() {
  const APIKey = 'dcbb5b4e58ce4a95941e5a3f5ba1c9b8';
  const sources = ['hacker-news', 'recode', 'techcrunch'];
  const articlesList = [];

  function updateNewsSources(source, index) {
    sources[index] = source;
  }

  window.app.newsfeedModel = {
    APIKey,
    sources,
    articlesList,
    updateNewsSources,
  };
}());
/* ************************************************************************
NEWSFEED VIEW
************************************************************************* */
(function makeNewsfeedView() {
  const newsfeedWrapper = $('.newsfeed-wrapper');

  function toggleNewsfeed(e) {
    if (newsfeedWrapper.is(':visible') && e.target !== newsfeedWrapper[0]) {
      newsfeedWrapper.fadeOut();
    } else if (!newsfeedWrapper.is(':visible') && e.target === $('.fa-newspaper-o')[0]) {
      newsfeedWrapper.fadeIn();
    }
  }

  function generateArticle(source, url, image, title, author) {
    author = author == null || author == '' ? 'unnamed author' : author.toLowerCase().replace(/^by/, '');
    image = image == null ? './assets/img/scuba-turtle.png' : image;

    return `
      <li class="article">
      <a class="article-image" href="${url}" style="background-image: url(${image})" target="_blank">
      </a>
      <div class"artcle-body">
        <a class="headline" href="${url}" target="_blank">${title}</a>
        <p class="source">${author} - ${source}</p>
      </div>
    </li>
    `;
  }

  function append(sourceArticles) {
    $('.newsfeed').append(`${sourceArticles}`);
  }

  function clear() {
    $('.newsfeed').empty();
  }

  window.app.newsfeedView = {
    toggleNewsfeed,
    generateArticle,
    append,
    clear,
  };
}());
