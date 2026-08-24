import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderCreateContributorPage from '../../pages/service-provider-create-contributor-page';

const serviceProviderCreateContributorPage =
  new ServiceProviderCreateContributorPage();

Then(
  "je suis sur la page du formulaire d'ajout d'un contributeur",
  function () {
    serviceProviderCreateContributorPage.getTitle().should('be.visible');
    serviceProviderCreateContributorPage.checkIsVisible();
  },
);

Then("je suis redirigé vers la page ajout d'un contributeur", function () {
  serviceProviderCreateContributorPage.getTitle().should('be.visible');
  serviceProviderCreateContributorPage.checkIsVisible();
});

When(
  /^j'entre "([^"]+)" dans le champ "([^"]+)" du formulaire d'ajout d'un contributeur$/,
  function (value: string, name: string) {
    serviceProviderCreateContributorPage.fillValue(name, value);
  },
);

When(
  /^je clique sur le bouton "sauvegarder" du formulaire d'ajout d'un contributeur$/,
  function () {
    serviceProviderCreateContributorPage.getValidationButton().click();
  },
);

Then(
  "une erreur est affichée dans le formulaire d'ajout d'un contributeur",
  function () {
    serviceProviderCreateContributorPage
      .getFormErrorAlert()
      .should('be.visible');
  },
);

Then(
  /^le champ "([^"]+)" (est|n'est pas) en erreur dans le formulaire d'ajout d'un contributeur$/,
  function (name: string, text: string) {
    const hasError = text === 'est';
    serviceProviderCreateContributorPage.checkHasError(name, hasError);
  },
);

Then(
  /^l'erreur du champ "([^"]+)" contient "([^"]+)" dans le formulaire d'ajout d'un contributeur$/,
  function (name: string, errorMessage: string) {
    serviceProviderCreateContributorPage.checkHasErrorMessage(
      name,
      errorMessage,
    );
  },
);

Then(
  /^les champs suivants sont en erreur dans le formulaire d'ajout d'un contributeur$/,
  function (dataTable: DataTable) {
    dataTable.hashes().forEach(({ errorMessage, name }) => {
      serviceProviderCreateContributorPage.checkHasError(name, true);
      serviceProviderCreateContributorPage.checkHasErrorMessage(
        name,
        errorMessage,
      );
    });
  },
);
