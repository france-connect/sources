module.exports = {
  callout: (md) => {
    const re = /^callout(\s+.*)?$/;
    return {
      validate: (params) => {
        return params.trim().match(re);
      },

      render: (tokens, idx) => {
        const params = tokens[idx].info.trim().match(re);

        if (tokens[idx].nesting === 1) {
          // opening tag
          return `
<div class="fr-callout">
    <h3 class="fr-callout__title">${md.utils.escapeHtml(params?.[1]) || ''}</h3>
    <div class="fr-callout__text">
`;
        } else {
          // closing tag
          return '</div></div>\n';
        }
      },
    };
  },
  quote: (md) => {
    const re = /^quote(\s+.*)?$/;
    let params = undefined;
    return {
      validate: (params) => {
        return params.trim().match(re);
      },

      render: (tokens, idx) => {
        params = tokens[idx].info.trim().match(re) || params;

        if (tokens[idx].nesting === 1) {
          // opening tag
          return `
<figure class="fr-quote fr-quote--column">
  <blockquote>
`;
        } else {
          // closing tag
          const imageBlock =
            params && params[1]
              ? `
    <figcaption>
        <div class="fr-quote__image">
            <img src="${md.utils.escapeHtml(params[1]) || ''}" class="fr-responsive-img" alt="" />
        </div>
    </figcaption>`
              : undefined;
          return `
    ${imageBlock || ''}
  </blockquote>
</figure>
<br>
\n`;
        }
      },
    };
  },
};
