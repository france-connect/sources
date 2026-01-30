import { Then } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderPage from '../../pages/service-provider-page';

const serviceProviderPage = new ServiceProviderPage();

Then(
  /^le titre du fournisseur de service "([^"]+)" est affiché$/,
  function (title: string) {
    serviceProviderPage.getTitle(title).should('be.visible');
  },
);

Then(
  'je suis redirigé vers la page détails du fournisseur de service',
  function () {
    serviceProviderPage.getDatapassRequestIdLink().should('be.visible');
  },
);

Then(
  "je suis redirigé vers la page d'erreur du fournisseur de service",
  function () {
    serviceProviderPage.checkIsErrorPageVisible();
  },
);
