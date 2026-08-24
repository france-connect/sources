const statusUrl = document.getElementById('wb-sse-status-url').value;
const successUrl = document.getElementById('wb-sse-success-url').value;
const timeoutMs =
  parseInt(document.getElementById('wb-sse-timeout').value, 10) * 1000;
const redirectDelayMs =
  parseInt(document.getElementById('wb-sse-redirect-delay').value, 10) * 1000;

const qrcodeWrapper = document.getElementById('wb-qrcode-wrapper');
const statusLiveRegion = document.getElementById('wb-status-live-region');
const alertLiveRegion = document.getElementById('wb-alert-live-region');

// Clone into the live region: screen readers announce insertions, not unhiding
function showStatus(name) {
  const template = document.getElementById('wb-status-' + name + '-template');
  if (!template) {
    return;
  }

  const isAlert = name === 'error';
  const targetRegion = isAlert ? alertLiveRegion : statusLiveRegion;
  const otherRegion = isAlert ? statusLiveRegion : alertLiveRegion;

  otherRegion.replaceChildren();
  targetRegion.replaceChildren(template.content.cloneNode(true));

  ['pending', 'success', 'error'].forEach(function (key) {
    qrcodeWrapper.classList.toggle('wb-qrcode-wrapper--' + key, key === name);
  });
}

const es = new EventSource(statusUrl);

const timeoutId = setTimeout(function () {
  es.close();
}, timeoutMs);

es.onerror = function () {
  clearTimeout(timeoutId);
  es.close();
};

es.onmessage = function (event) {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (e) {
    console.error('oid4vp: failed to parse SSE message', e);
    return;
  }

  if (data.display) {
    showStatus(data.display);
  }

  if (data.final) {
    clearTimeout(timeoutId);
    es.close();
  }

  if (data.display === 'success') {
    setTimeout(function () {
      window.location.href = successUrl;
    }, redirectDelayMs);
  }
};
