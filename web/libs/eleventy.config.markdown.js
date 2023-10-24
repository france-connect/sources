const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItContainer = require('markdown-it-container');

const customMarkdownContainers = require('./markdown-custom-containers');

module.exports = function (eleventyConfig) {
  // Customize Markdown library settings:
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: 'after',
        class: 'header-anchor',
        symbol: '#',
        ariaHidden: false,
      }),
      level: [1, 2, 3, 4],
      slugify: eleventyConfig.getFilter('slugify'),
    });
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItAttrs);
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItContainer, 'callout', customMarkdownContainers.callout(mdLib));
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItContainer, 'quote', customMarkdownContainers.quote(mdLib));
  });
};
