(() => {
  const RESULTS_PER_PAGE = 10;

  const SEARCH_TERM_SELECTOR = '#search-term';
  const RESULT_COUNT_SELECTOR = '#result-count';
  const SEARCH_RESULTS_SELECTOR = '#search-results';

  const FULL_WIDTH_COL_CLASS = 'fr-col-12';

  const searchTermText = document.querySelector(SEARCH_TERM_SELECTOR);
  const resultCounter = document.querySelector(RESULT_COUNT_SELECTOR);
  const searchResultList = document.querySelector(SEARCH_RESULTS_SELECTOR);

  const getSearchResults = async () => {
    const pagefind = await import(PAGEFIND_URL);
    const queryParams = new URLSearchParams(window.location.search);
    const searchTerm = queryParams.get(SEARCH_PARAM);
    searchTermText.textContent = searchTerm;
    pagefind.init();
    const search = await pagefind.search(searchTerm);
    return search.results;
  };

  const getCardHtml = (title, excerpt, url) => {
    return `
<div class="fr-card fr-enlarge-link fr-card--horizontal">
  <div class="fr-card__body">
      <div class="fr-card__content">
          <h3 class="fr-card__title">
              <a href="${url}">${title}</a>
          </h3>
          <p class="fr-card__desc">${excerpt}</p>
      </div>
  </div>
</div>`;
  };

  const populateSearchResults = async (paginatedResults) => {
    paginatedResults.forEach((result) => {
      const cardCol = document.createElement('div');
      cardCol.className = FULL_WIDTH_COL_CLASS;
      cardCol.innerHTML = getCardHtml(result.meta.title, result.excerpt, result.url);
      searchResultList.appendChild(cardCol);
    });
  };

  const bottomIsReached = () => {
    return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight;
  };

  getSearchResults().then(async (searchResults) => {
    resultCounter.innerText = searchResults.length;

    let start = 0;
    let paginatedResults = await Promise.all(
      searchResults.slice(start, start + RESULTS_PER_PAGE).map((r) => r.data()),
    );

    await populateSearchResults(paginatedResults);

    window.addEventListener('scroll', async () => {
      if (bottomIsReached()) {
        start += RESULTS_PER_PAGE;
        paginatedResults = await Promise.all(
          searchResults.slice(start, start + RESULTS_PER_PAGE).map((r) => r.data()),
        );
        await populateSearchResults(paginatedResults);
      }
    });
  });
})();
