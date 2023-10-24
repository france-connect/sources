const SEARCH_PARAM = "term";

(() => {
    const SEARCH_SELECTOR = "#header-search";

    const searchBox = document.querySelector(SEARCH_SELECTOR);
    const searchInput = searchBox.querySelector("input");
    const searchBtn = searchBox.querySelector("button");

    const search = () => {
        const searchResultsUrl = new URL(SEARCH_RESULTS_URL, window.location.origin);
        searchResultsUrl.searchParams.append(SEARCH_PARAM, searchInput.value);
        window.location.href = searchResultsUrl;
    }

    searchInput.addEventListener("keydown", async (event) => {
        if (event.code === "Enter") {
            await search();
        }
    });
    searchBtn.addEventListener("click", async () => {
        await search();
    });
})();
