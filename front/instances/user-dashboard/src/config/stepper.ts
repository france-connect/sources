import type { StepperConfigInterface } from '@fc/dsfr';

export const Stepper: StepperConfigInterface = {
  basePath: '/signalement-usurpation',
  steps: [
    {
      order: 10,
      path: './description-usurpation',
      title: 'Description de l’usurpation',
    },
    {
      order: 20,
      path: './code-identification',
      title: 'Code d’identification',
    },
    {
      order: 25,
      path: './connexions-existantes',
      title: 'Connexion(s) correspondante(s)',
    },
    {
      order: 30,
      path: './identite-usurpee',
      title: 'Identité usurpée',
    },
    {
      order: 40,
      path: './contact',
      title: 'Contact',
    },
    {
      order: 50,
      path: './recapitulatif',
      title: 'Récapitulatif',
    },
  ],
};
