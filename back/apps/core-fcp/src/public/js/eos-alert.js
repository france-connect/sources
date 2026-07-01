const revealSessionExpirationAlert = () => {
  const template = document.getElementById('session-expiration-alert-template');
  const liveRegion = document.getElementById(
    'session-expiration-alert-live-region',
  );

  if (!template || !liveRegion) {
    return;
  }

  liveRegion.replaceChildren(template.content.cloneNode(true));
};

const scheduleSessionExpirationAlert = () => {
  const delayInput = document.getElementById('session-alert-delay');
  if (!delayInput) {
    return;
  }

  const delayInSeconds = parseInt(delayInput.value, 10);
  if (Number.isNaN(delayInSeconds)) {
    return;
  }

  const delayInMs = Math.max(delayInSeconds, 0) * 1000;

  window.setTimeout(revealSessionExpirationAlert, delayInMs);
};

document.addEventListener('DOMContentLoaded', scheduleSessionExpirationAlert);
