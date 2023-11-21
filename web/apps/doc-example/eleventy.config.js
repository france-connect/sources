const mermaidPlugin = require('@kevingimbel/eleventy-plugin-mermaid');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    './node_modules/mermaid/dist/mermaid.min.js': '/js/mermaid.min.js',
  });

  eleventyConfig.addPlugin(require('./eleventy.config.dsfr.js'));

  eleventyConfig.addPlugin(mermaidPlugin);

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
