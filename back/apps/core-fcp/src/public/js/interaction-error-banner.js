/**
 * Interaction error banner focus and scroll handler.
 *
 * This script focuses and scrolls to the error banner when it is present on the page.
 * It uses requestAnimationFrame to ensure the DOM is fully rendered before attempting
 * to focus and scroll to the banner.
 */
const initInteractionErrorBanner = () => {
  const errorBanner = document.getElementById('interaction-error-banner');
  if (errorBanner) {
    requestAnimationFrame(function () {
      errorBanner.focus();
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
};

document.addEventListener('DOMContentLoaded', initInteractionErrorBanner);
