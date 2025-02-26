import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import InstanceFormPage from '../../pages/instance-form-page';

const instanceFormPage = new InstanceFormPage();

Then(/^je suis (redirigé vers|sur) la page création d'instance$/, function () {
  instanceFormPage.checkIsCreatePageVisible();
});

Then(
  /^je suis (redirigé vers|sur) la page modification d'instance$/,
  function () {
    instanceFormPage.checkIsUpdatePageVisible();
  },
);

When("j'entre les valeurs par défaut pour mon instance", function () {
  instanceFormPage.fillDefaultValues(this.instance);
});

When(
  /^j'entre "([^"]+)" dans le champ "([^"]+)" du formulaire de (?:création|modification) d'instance$/,
  function (value: string, name: string) {
    instanceFormPage.fillValue(name, value);
    this.instance = {
      ...this.instance,
      [name]: value,
    };
  },
);

When(
  /^j'entre les valeurs dans les champs suivants du formulaire de (?:création|modification) d'instance$/,
  function (dataTable: DataTable) {
    dataTable.hashes().forEach(({ name, value }) => {
      instanceFormPage.fillValue(name, value);
      this.instance = {
        ...this.instance,
        [name]: value,
      };
    });
  },
);

When(
  /^j'entre les chaines de caractères longues dans les champs suivants du formulaire de (?:création|modification) d'instance$/,
  function (dataTable: DataTable) {
    dataTable.hashes().forEach(({ name, prefix, suffix, totalLength }) => {
      const length = parseInt(totalLength, 10);
      const fillingLength = length - prefix.length - suffix.length;
      const filling = 'a'.repeat(fillingLength);
      const value = `${prefix}${filling}${suffix}`;
      instanceFormPage.fillValue(name, value);
      this.instance = {
        ...this.instance,
        [name]: value,
      };
    });
  },
);

When(
  /^j'entre un nom aléatoire dans le champ "(name)" du formulaire de (?:création|modification) d'instance$/,
  function (key: string) {
    const randomId = Cypress._.random(0, 1e6);
    const instanceName = `bdd_${randomId}`;
    instanceFormPage.fillValue(key, instanceName);
    this.instance = {
      ...this.instance,
      [key]: instanceName,
    };
  },
);

When(
  /^j'ajoute un champ "([^"]+)" dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string) {
    instanceFormPage.getInputAddButton(name).click();
  },
);

When(
  /^je supprime le champ "([^"]+)" dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string) {
    instanceFormPage.getInputRemoveButton(name).click();
  },
);

Then(
  /^le bouton "supprimer" du champ "([^"]+)" est (actif|désactivé) dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, state: string) {
    const isDisabled = state === 'désactivé';
    instanceFormPage
      .getInputRemoveButton(name)
      .should(isDisabled ? 'be.disabled' : 'be.enabled');
  },
);

Then(
  /^le champ "([^"]+)" (est|n'est pas) affiché dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, text: string) {
    const isVisible = text === 'est';
    instanceFormPage.checkIsFieldVisible(name, isVisible);
  },
);

Then(
  /^les champs suivants (sont|ne sont pas) affichés dans le formulaire de (?:création|modification) d'instance$/,
  function (text: string, dataTable: DataTable) {
    const isVisible = text === 'sont';
    dataTable.hashes().forEach(({ name }) => {
      instanceFormPage.checkIsFieldVisible(name, isVisible);
    });
  },
);

Then(
  /^le champ "([^"]+)" (est|n'est pas) visible à l'écran dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, text: string) {
    const isWithinViewport = text === 'est';
    instanceFormPage.checkIsFieldWithinViewport(name, isWithinViewport);
  },
);

Then(
  /^le champ "([^"]+)" contient "([^"]*)" dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, value: string) {
    instanceFormPage.checkHasValue(name, value);
  },
);

Then(
  /^les champs suivants sont initialisés dans le formulaire de (?:création|modification) d'instance$/,
  function (dataTable: DataTable) {
    dataTable.hashes().forEach(({ name, value }) => {
      instanceFormPage.checkHasValue(name, value);
    });
  },
);

Then(
  /^le champ "(name)" contient le nom de l'instance dans le formulaire de modification d'instance$/,
  function (key: string) {
    const { name: instanceName } = this.instance;
    instanceFormPage.checkHasValue(key, instanceName);
  },
);

Then(
  /^le champ "([^"]+)" (est|n'est pas) en erreur dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, text: string) {
    const hasError = text === 'est';
    instanceFormPage.checkHasError(name, hasError);
  },
);

Then(
  /^l'erreur du champ "([^"]+)" contient "([^"]+)" dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, errorMessage: string) {
    instanceFormPage.checkHasErrorMessage(name, errorMessage);
  },
);

Then(
  /^les champs suivants sont en erreur dans le formulaire de (?:création|modification) d'instance$/,
  function (dataTable: DataTable) {
    dataTable.hashes().forEach(({ errorMessage, name }) => {
      instanceFormPage.checkHasError(name, true);
      instanceFormPage.checkHasErrorMessage(name, errorMessage);
    });
  },
);

Then(
  /^les champs suivants ne sont pas en erreur dans le formulaire de (?:création|modification) d'instance$/,
  function (dataTable: DataTable) {
    dataTable.hashes().forEach(({ name }) => {
      instanceFormPage.checkHasError(name, false);
    });
  },
);

When(
  /^je valide le formulaire de (?:création|modification) d'instance$/,
  function () {
    instanceFormPage.getValidationButton().click();
  },
);
