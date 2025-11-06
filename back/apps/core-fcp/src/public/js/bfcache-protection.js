/**
 * BFCache (Back/Forward Cache) protection mechanism.
 *
 * This code prevents the browser's back/forward cache from serving stale pages
 * when users navigate using browser history buttons. This is necessary because:
 *
 * 1. BFCache can restore pages with outdated authentication states or session data
 * 2. Sensitive information might be displayed from cache without proper validation
 * 3. Dynamic content may not reflect the current application state
 *
 * The pageshow listener detects when a page is restored from BFCache (event.persisted === true)
 * and forces a reload to ensure fresh content and valid session state.
 *
 * The pagehide listener prevents the page from being stored in BFCache by adding
 * an event listener, as browsers typically exclude pages with pagehide listeners
 * from the cache.
 */
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

window.addEventListener('pagehide', function () {});
