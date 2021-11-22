(function () {
  const openCloseMenu = document.querySelector('#openCloseMenu');
  const toggleOpenCloseMenu = document.querySelector('#toggleOpenCloseMenu');
  const moreInformations = document.querySelector('.more-informations');
  const askConsent = document.querySelector('#fc-ask-consent');
  const checkbox = document.querySelector('#fc-ask-consent-checkbox')
  const button = document.querySelector('#consent');

  if (askConsent !== null) {
    window.addEventListener('load', () => {
      button.setAttribute('disabled', true);
      openCloseMenu.classList.toggle('open');
    });
    checkbox.addEventListener('click', () => {
      if (checkbox.checked) {
        button.removeAttribute('disabled');
      } else {
        button.setAttribute('disabled', true);
      }
    }, true);
  }

  if (toggleOpenCloseMenu !== null) {
    toggleOpenCloseMenu.addEventListener('click', () => {
      openCloseMenu.classList.toggle('open');
    }, true);

    toggleOpenCloseMenu.addEventListener('keydown', (evt) => {
      const allowedKeys = [" ", "Enter", "Spacebar"];
      const canToggle = allowedKeys.includes(evt.key);
      if (canToggle) {
        openCloseMenu.classList.toggle('open');
      }
    }, true);

    toggleOpenCloseMenu.addEventListener('focus', () => {
      toggleOpenCloseMenu.classList.add('border-focus');
    }, true);

    toggleOpenCloseMenu.addEventListener('blur', () => {
      toggleOpenCloseMenu.classList.remove('border-focus');
    }, true);
  }

  if (moreInformations !== null) {
    moreInformations.addEventListener('focus', () => {
      openCloseMenu.classList.add('open');
    }, true);
  }
})();
