import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../common/helpers';
import UdFraudFormPage from '../pages/ud-fraud-form-page';

let udFraudFormPage: UdFraudFormPage;

Given(
  /^je navigue directement vers la page formulaire usurpation( avec le paramètre fraudSurveyOrigin égal à "identite-inconnue")?$/,
  function (fraudSurveyOrigin?: string) {
    const { allAppsUrl } = this.env;
    const appId = fraudSurveyOrigin
      ? 'ud-fraud-form-unknown-identity'
      : 'ud-fraud-form';
    navigateTo({
      appId,
      baseUrl: allAppsUrl,
    });
  },
);

Then(
  /^je suis redirigé vers la page formulaire usurpation(?: avec le paramètre fraudSurveyOrigin égal à "([^"]+)")?$/,
  function (fraudSurveyOrigin?: string) {
    const { udRootUrl } = this.env;
    udFraudFormPage = new UdFraudFormPage(udRootUrl);
    udFraudFormPage.checkIsVisible();
    if (fraudSurveyOrigin) {
      udFraudFormPage.checkHasFraudSurveyOriginQueryParam(fraudSurveyOrigin);
    }
  },
);

Then('le formulaire usurpation est affiché', function () {
  udFraudFormPage.getValidationButton().should('be.visible');
});

Given(
  /^je force la donnée "fraudSurveyOrigin" à "([^"]+)" dans le localStorage(?: datée d'il y a (\d+) minutes)?$/,
  (paramValue: string, delayInMinutes?: string) => {
    cy.window().then((win) => {
      let delay = 0;
      if (delayInMinutes) {
        delay = parseInt(delayInMinutes, 10) * 60000;
      }
      const expirableValue = {
        createdAt: Date.now() - delay,
        value: paramValue,
      };
      win.localStorage.setItem(
        'fraudSurveyOrigin',
        JSON.stringify(expirableValue),
      );
    });
  },
);

Then(
  'le localStorage contient la donnée "fraudSurveyOrigin" égale à {string}',
  function (fraudSurveyOrigin: string) {
    // Wait for the localStorage to be updated
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.window().then((win) => {
      const localValue = win.localStorage.getItem('fraudSurveyOrigin');
      expect(localValue).to.exist;
      expect(JSON.parse(localValue).value).to.equal(fraudSurveyOrigin);
    });
  },
);

Then(
  'le localStorage ne contient pas la donnée "fraudSurveyOrigin"',
  function () {
    // Wait for the localStorage to be updated
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.window().then((win) => {
      const localValue = win.localStorage.getItem('fraudSurveyOrigin');
      expect(localValue).not.to.exist;
    });
  },
);

Then('je suis redirigé vers le questionnaire fraude', function () {
  cy.url().should(
    'eq',
    'https://aide.franceconnect.gouv.fr/erreurs/signalement/etape-1/',
  );
});

When(
  `j'entre les valeurs par défaut sur le formulaire usurpation`,
  function () {
    expect(this.fraudFormValues).to.exist;
    udFraudFormPage.fillDefaultValues(this.fraudFormValues);
  },
);

When('je valide le formulaire usurpation', function () {
  udFraudFormPage.validateForm();
});

When('je clique sur le button vers le questionnaire fraude', function () {
  udFraudFormPage.getFraudSurveyButton().click();
});

Given('le bouton vers le questionnaire fraude est affiché', function () {
  udFraudFormPage.getFraudSurveyButton().should('be.visible');
});

Then('la demande de support est prise en compte', function () {
  udFraudFormPage.checkIsSuccessAlertDisplayed();
});

When(
  `j'entre {string} dans le champ {string} du formulaire usurpation`,
  function (value: string, key: string) {
    udFraudFormPage.fillValue(key, value);
    // Update support detail
    this.fraudFormValues = {
      ...this.fraudFormValues,
      [key]: value,
    };
  },
);

When(
  'je supprime la valeur du champ {string} du formulaire usurpation',
  function (key: string) {
    udFraudFormPage.clearValue(key);
    // Update support detail
    this.fraudFormValues = {
      ...this.fraudFormValues,
      [key]: undefined,
    };
  },
);

When('je coche la case de consentement du formulaire usurpation', function () {
  udFraudFormPage.getConsentCheckbox().check({ force: true });
});

Then(
  'le lien vers la page historique de connexion est affiché sur le formulaire usurpation',
  function () {
    udFraudFormPage.getHistoryLink().should('be.visible');
  },
);

Then(
  `le champ "contactEmail" contient l'email du compte FI dans le formulaire usurpation`,
  function () {
    const { email } = this.user.claims as {
      email: string;
    };
    udFraudFormPage.checkHasValue('contactEmail', email);
  },
);

Then(
  'le champ {string} a une erreur {string} dans le formulaire usurpation',
  function (name: string, errorMessage: string) {
    udFraudFormPage.checkIsErrorMessageDisplayed(name);
    udFraudFormPage.checkHasErrorMessage(name, errorMessage);
  },
);
