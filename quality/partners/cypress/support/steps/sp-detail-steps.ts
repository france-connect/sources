import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { serviceProviderStatus } from '../helpers';
import SPDetailPage from '../pages/sp-detail-page';
import { ServiceProvider } from '../types';

const spDetail = new SPDetailPage();

Then(
  /^je suis redirigé vers la page détail d'un fournisseur de service en (mode consultation|mode édition)$/,
  function (mode) {
    if (mode === 'mode consultation') {
      spDetail.checkIsViewMode();
    } else {
      spDetail.checkIsEditMode();
    }
  },
);

Then('le nom du fournisseur de service est affiché', function () {
  const { name }: ServiceProvider = this.serviceProvider;
  spDetail
    .getSpName()
    .should('be.visible')
    .invoke('text')
    .should('be.equal', name);
});

Then('la plateforme du fournisseur de service est affichée', function () {
  const { platform }: ServiceProvider = this.serviceProvider;
  spDetail
    .getPlatformName()
    .should('be.visible')
    .invoke('text')
    .should('be.equal', platform);
});

Then("l'état du fournisseur de service est affiché", function () {
  const { status }: ServiceProvider = this.serviceProvider;
  spDetail
    .getSpBadge()
    .should('be.visible')
    .should('have.text', serviceProviderStatus[status]);
});

When(
  'je clique sur le lien retour vers la liste des fournisseurs de service',
  function () {
    spDetail.getReturnToSpListButton().click();
  },
);
