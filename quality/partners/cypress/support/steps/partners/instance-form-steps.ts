import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

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
  function (value: string, key: string) {
    instanceFormPage.fillValue(key, value);
    this.instance = {
      ...this.instance,
      [key]: value,
    };
  },
);

When(
  /^j'entre un nom aléatoire dans le champ "(instance_name)" du formulaire de (?:création|modification) d'instance$/,
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

Then(
  /^le champ "([^"]+)" contient "([^"]*)" dans le formulaire de (?:création|modification) d'instance$/,
  function (name: string, value: string) {
    instanceFormPage.checkHasValue(name, value);
  },
);

Then(
  /^le champ "(instance_name)" contient le nom de l'instance dans le formulaire de modification d'instance$/,
  function (name: string) {
    const { instance_name: instanceName } = this.instance;
    instanceFormPage.checkHasValue(name, instanceName);
  },
);

When(
  /^je valide le formulaire de (?:création|modification) d'instance$/,
  function () {
    instanceFormPage.getValidationButton().click();
  },
);
