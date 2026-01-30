import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { getScopeByType } from '../../common/helpers';
import InfoConsentPage from '../pages/info-consent-page';

const infoConsentPage = new InfoConsentPage();

Given(
  'je bloque temporairement la navigation de la page pour continuer sur le fournisseur de service',
  function () {
    infoConsentPage.getConsentForm().then(($form) => {
      const form = $form[0];

      form.addEventListener(
        'submit',
        (e) => {
          e.preventDefault();
        },
        { capture: true, once: true },
      );
    });
  },
);

Then('je suis redirigé vers la page confirmation de connexion', function () {
  infoConsentPage.checkIsVisible();
});

Then("je suis redirigé vers la page d'information", function () {
  infoConsentPage.checkIsVisible();
  infoConsentPage.getConsentCheckbox().should('not.exist');
  infoConsentPage.getConsentButton().should('be.enabled');
});

Then('je suis redirigé vers la page de consentement', function () {
  infoConsentPage.checkIsVisible();
  infoConsentPage.getConsentCheckboxLabel().should('be.visible');
  infoConsentPage.getConsentCheckbox().should('not.be.checked');
});

When('je clique pour afficher les claims', function () {
  infoConsentPage.getShowClaimsToggle().click();
  // Wait for accordion opened
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});

Then(
  /les informations demandées par le fournisseur de service correspondent aux? scopes? "([^"]+)"/,
  function (type: string) {
    const scope = getScopeByType(this.scopes, type);
    const { explicitConsent } = this.serviceProvider;
    infoConsentPage.checkInformationConsent(scope, explicitConsent);
  },
);

Then(
  'aucune information n\'est demandée par le fournisseur de service pour le scope "anonyme"',
  function () {
    infoConsentPage.checkAnonymousScope();
  },
);

When(
  'je consens à transmettre mes informations au fournisseur de service',
  function () {
    infoConsentPage.getConsentCheckboxLabel().click();
  },
);

Then(
  /^le bouton continuer sur le FS est (actif|désactivé)$/,
  function (text: string) {
    const beEnabledOrNot = text === 'actif' ? 'be.enabled' : 'be.disabled';
    infoConsentPage.getConsentButton().should(beEnabledOrNot);
  },
);

When('je mets {string} dans le csrf de consentement', function (csrf: string) {
  infoConsentPage.getConsentCsrfInput().invoke('attr', 'value', csrf);
});

When('je retire le csrf de consentement', function () {
  infoConsentPage.getConsentCsrfInput().invoke('remove');
});

When('je continue sur le fournisseur de service', function () {
  infoConsentPage.getConsentButton().click();
});

When(
  'je double-clique sur le bouton continuer sur le fournisseur de service',
  function () {
    infoConsentPage.getConsentButton().dblclick();
  },
);

Then(
  'le bouton continuer sur le fournisseur de service est désactivé',
  function () {
    infoConsentPage.getConsentButton().should('be.disabled');
  },
);

Then(
  'la modale de chargement du fournisseur de service est affichée',
  function () {
    infoConsentPage.checkIsLoadingModalVisible();
  },
);
