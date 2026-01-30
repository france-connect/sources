const SELECTORS = {
  FORM: 'form[data-prevent-double-submit]',
  SUBMIT_BUTTON: 'button[type="submit"]',
  LOADING_MODAL: 'loading-modal',
};

const preventDoubleSubmit = () => {
  const forms = document.querySelectorAll(SELECTORS.FORM);

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      // check if a form has already been submitted
      const allForms = document.querySelectorAll(SELECTORS.FORM);
      const alreadySubmitted = Array.from(allForms).some((f) => f.dataset.submitted === 'true');

      if (alreadySubmitted) {
        event.preventDefault();
        return false;
      }

      // mark this form as submitted
      form.dataset.submitted = 'true';

      // disable all submit buttons
      allForms.forEach((f) => {
        f.querySelectorAll(SELECTORS.SUBMIT_BUTTON).forEach((button) => {
          button.disabled = true;
          button.ariaDisabled = 'true';
        });
      });

      // display the loading modal
      const loadingModal = document.getElementById(SELECTORS.LOADING_MODAL);
      if (loadingModal && window.dsfr) {
        setTimeout(() => {
          if (loadingModal && window.dsfr && window.dsfr(loadingModal)) {
            window.dsfr(loadingModal).modal.disclose();
          }
        }, 500);
      }
    });
  });
};

const resetFormsOnPageShow = () => {
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) {
      return;
    }

    // the page is loaded from the cache (back navigation)
    const forms = document.querySelectorAll(SELECTORS.FORM);

    forms.forEach((form) => {
      form.dataset.submitted = 'false';

      form.querySelectorAll(SELECTORS.SUBMIT_BUTTON).forEach((button) => {
        button.disabled = false;
        button.ariaDisabled = 'false';
      });
    });

    // close the modal if it is open
    const loadingModal = document.getElementById(SELECTORS.LOADING_MODAL);
    if (loadingModal && window.dsfr) {
      window.dsfr(loadingModal).modal.conceal();
    }
  });
};

const init = () => {
  if (!document.querySelector(SELECTORS.FORM)) {
    return;
  }

  preventDoubleSubmit();
  resetFormsOnPageShow();
};

document.addEventListener('DOMContentLoaded', init);
