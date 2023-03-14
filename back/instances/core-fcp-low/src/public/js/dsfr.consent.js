const submit = document.querySelector('button[type=submit]');

// active or not the 'Continue button'
function toggleConsent(canConsent) {
  submit.ariaDisabled = !canConsent;
  submit.disabled = !canConsent;
}

// display or not the error
function displayError(display) {
  const cmd = display ? 'add' : 'remove';
  const groupCheckbox = document.querySelector('.fr-checkbox-group');
  groupCheckbox.classList[cmd]('fr-checkbox-group--error');

  const failed = document.querySelector('#checkbox-error-desc-error');
  // remove fr-error-text class to use hidden attribute because class force displaying
  failed.classList[cmd]('fr-error-text');
  failed.hidden = !display;
}

// override Submit action to display error if no consent
function bypassSubmit(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  displayError(true);
  toggleConsent(false);
}

// catch click event if consent was not done to display error
function blockUser(canConsent) {
  const cmd = canConsent ? 'remove' : 'add';
  submit[`${cmd}EventListener`]('click', bypassSubmit);
}

// check if consent was clicked to allow the next step
function validateConsent(elmt) {
  const checked = elmt.checked;
  displayError(false);
  toggleConsent(checked);
  blockUser(checked);
}

function init() {
  const consent = document.querySelector('#consent');
  consent.addEventListener('change', function (evt) {
    validateConsent(evt.target);
  });
  validateConsent(consent);
}

init();

