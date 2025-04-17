import { useEffect } from 'react';

import { Options } from '../enums';

declare global {
  interface Window {
    _paq?: unknown[];
  }
}

export const useMatomo = ({ siteId, url }: { siteId: number; url: string }) => {
  useEffect(() => {
    // @NOTE check if the element with the ID exist
    const matomoScript = document.getElementById(Options.HTML_SCRIPT_ID);

    if (!matomoScript) {
      // eslint-disable-next-line no-underscore-dangle, no-multi-assign
      const _paq = (window._paq = window._paq || []);

      _paq.push(['setExcludedQueryParams', ['simulationId', '_csrf']]);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);

      const scriptTag = document.createElement('script');
      scriptTag.id = 'matomo-script';
      scriptTag.innerHTML = `
        var _paq = window._paq = window._paq || [];
        _paq.push(["setExcludedQueryParams", ["simulationId", "_csrf"]]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="${url}";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', ${siteId}]);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
      `;

      document.body.appendChild(scriptTag);
    }
  }, [url, siteId]);
};
