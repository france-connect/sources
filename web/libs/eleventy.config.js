module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require('./eleventy.config.dsfr.js'));

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'content',
      includes: '../_includes',
      data: '../_data',
      output: 'dist',
    },
    pathPrefix: '/',
  };
};
