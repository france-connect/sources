import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { getScopeByType } from '../helpers';
import InfoConsentPage from '../pages/info-consent-page';

const infoConsentPage = new InfoConsentPage();

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
});

Then(
  /les informations demandées par le fournisseur de service correspondent aux? scopes? "([^"]+)"/,
  function (type) {
    const scope = getScopeByType(this.scopes, type);
    const { explicitConsent } = this.serviceProvider;
    infoConsentPage.checkInformationConsent(scope, explicitConsent);
  },
);

Then(
  'aucune information n\'est demandée par le fournisseur de service pour le scope "anonyme"',
  function () {
    // TODO: Remove once FC+ uses the DSFR design
    const platform: string = Cypress.env('PLATFORM');
    if (platform === 'fcp-high') {
      infoConsentPage.checkAnonymousScopeFcPlus();
      return;
    }
    infoConsentPage.checkAnonymousScope();
  },
);

When(
  'je consens à transmettre mes informations au fournisseur de service',
  function () {
    infoConsentPage.getConsentCheckboxLabel().click();
  },
);

Then(/^le bouton continuer sur le FS est (actif|désactivé)$/, function (text) {
  const beEnabledOrNot = text === 'actif' ? 'be.enabled' : 'be.disabled';
  infoConsentPage.getConsentButton().should(beEnabledOrNot);
});

When('je continue sur le fournisseur de service', function () {
  infoConsentPage.getConsentButton().click();
});
