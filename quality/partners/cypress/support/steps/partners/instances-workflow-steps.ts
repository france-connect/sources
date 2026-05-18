import { Given, Step } from '@badeball/cypress-cucumber-preprocessor';

Given(
  'je crée une instance {string} avec le nom {string} et demande Datapass {string}',
  function (description: string, name: string, datapassRequestId: string) {
    // See nested steps: https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/cucumber-basics.md#nested-steps
    Step(this, `je clique sur le lien d'ajout d'une instance`);
    Step(this, `je suis redirigé vers la page création d'instance`);
    Step(this, `j'utilise l'instance de FS "${description}"`);
    Step(this, `j'entre les valeurs par défaut pour mon instance`);
    Step(
      this,
      `j'entre "${name}" dans le champ "name" du formulaire de création d'instance`,
    );
    Step(
      this,
      `j'entre "${datapassRequestId}" dans le champ "signupId" du formulaire de création d'instance`,
    );
    Step(this, `je valide le formulaire de création d'instance`);
    Step(this, `je suis redirigé vers la page liste des instances`);
    Step(this, `la confirmation de création de l'instance est affichée`);
    Step(this, `l'instance créée est affichée`);
  },
);
