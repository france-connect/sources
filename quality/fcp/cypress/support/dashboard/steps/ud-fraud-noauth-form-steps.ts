import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../common/helpers';
import UdFraudNoAuthFormPage from '../pages/ud-fraud-noauth-form-page';

const udFraudNoAuthFormPage = new UdFraudNoAuthFormPage();

Given(
  'je navigue vers la page formulaire usurpation non connecté',
  function () {
    const { allAppsUrl: baseUrl } = this.env;
    const appId = 'ud-fraud-noauth-form';
    navigateTo({
      appId,
      baseUrl,
    });
  },
);

Then(
  /^je suis (?:redirigé vers|sur) la page (.+) du formulaire usurpation non connecté$/,
  function (stepName: string) {
    if (stepName === 'confirmation') {
      udFraudNoAuthFormPage.checkIsSuccessAlertDisplayed();
      return;
    }
    udFraudNoAuthFormPage.checkIsStepVisible(stepName);
  },
);

Then(
  `l'étape {int} sur {int} du formulaire usurpation non connecté est affichée`,
  function (currentStep: number, maxStep: number) {
    const stepState = `Étape ${currentStep} sur ${maxStep}`;
    udFraudNoAuthFormPage.getStepperState().should('contain', stepState);
  },
);

Then(
  `l'étape du formulaire usurpation non connecté est {string}`,
  function (formTitle: string) {
    udFraudNoAuthFormPage.getFormTitle().should('contain', formTitle);
  },
);

When(
  `j'entre {string} dans le champ {string} du formulaire usurpation non connecté`,
  function (value: string, key: string) {
    udFraudNoAuthFormPage.fillValue(key, value);
    // Update support detail
    this.fraudFormValues = {
      ...this.fraudFormValues,
      [key]: value,
    };
  },
);

When(
  `j'entre dans le champ {string} du formulaire usurpation non connecté le texte multi ligne :`,
  function (key: string, value: string) {
    udFraudNoAuthFormPage.fillValue(key, value);
    // Update support detail
    this.fraudFormValues = {
      ...this.fraudFormValues,
      [key]: value,
    };
  },
);

When(
  'je supprime la valeur du champ {string} du formulaire usurpation non connecté',
  function (key: string) {
    udFraudNoAuthFormPage.clearValue(key);
    // Update support detail
    this.fraudFormValues = {
      ...this.fraudFormValues,
      [key]: undefined,
    };
  },
);

Then(
  'le champ {string} a une erreur {string} dans le formulaire usurpation non connecté',
  function (name: string, errorMessage: string) {
    udFraudNoAuthFormPage.checkIsErrorMessageDisplayed(name);
    udFraudNoAuthFormPage.checkHasErrorMessage(name, errorMessage);
  },
);

Then(
  "le champ {string} n'a pas d'erreur dans le formulaire usurpation non connecté",
  function (name: string) {
    udFraudNoAuthFormPage.checkIsErrorMessageDisplayed(name, false);
  },
);

When('je continue avec le formulaire usurpation non connecté', function () {
  udFraudNoAuthFormPage.getSubmitButton().click();
});

Then(
  /^(\d+) connexions? existantes? (?:a|ont) été trouvées? avec le code d'identification$/,
  function (count: number) {
    udFraudNoAuthFormPage.getConnectionCards().should('have.length', count);
  },
);

Then(
  "aucune connexion existante n'a été trouvée avec le code d'identification",
  function () {
    udFraudNoAuthFormPage.getNoConnectionFoundAlert().should('be.visible');
  },
);

When('je valide les connexions correspondantes', function () {
  udFraudNoAuthFormPage.getValidateConnectionsButton().click();
});

When("je clique pour saisir un nouveau code d'identification", function () {
  udFraudNoAuthFormPage.getEnterNewCodeButton().click();
});

When(
  'je coche la case de consentement du formulaire usurpation non connecté',
  function () {
    udFraudNoAuthFormPage.getConsentCheckbox().check({ force: true });
  },
);

When(
  'je décoche la case de consentement du formulaire usurpation non connecté',
  function () {
    udFraudNoAuthFormPage.getConsentCheckbox().uncheck({ force: true });
  },
);

When('je valide le formulaire usurpation non connecté', function () {
  udFraudNoAuthFormPage.getSubmitButton().click();
});

When("je clique sur l'accordéon de code d'identification", function () {
  udFraudNoAuthFormPage.getIdentificationCodeAccordion().click();
});

Then(
  /^le contenu de l'accordéon de code d'identification (est|n'est pas) affiché$/,
  function (text: string) {
    const isVisible = text === 'est';
    udFraudNoAuthFormPage
      .getIdentificationCodeAccordionContent()
      .should(isVisible ? 'be.visible' : 'not.be.visible');
  },
);
