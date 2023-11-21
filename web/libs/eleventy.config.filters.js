module.exports = function (eleventyConfig) {
  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('applyFilter', function applyFilter(table, filters) {
    return (table || []).map((row) => {
      return (row || []).map((col, i) => {
        const filter = eleventyConfig.getFilter(filters[i]?.[0]);
        return filter?.call(this, col, ...filters[i].slice(1)) || col;
      });
    });
  });
};
