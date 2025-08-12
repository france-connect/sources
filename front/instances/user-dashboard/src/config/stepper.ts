import type { StepperConfigInterface } from '@fc/dsfr';

export const Stepper: StepperConfigInterface = {
  basePath: '/signalement-usurpation',
  steps: [
    {
      order: 1,
      path: './description-usurpation',
      title: 'Description de l’usurpation',
    },
    {
      order: 2,
      path: './code-identification',
      title: 'Code d’identification',
    },
    {
      order: 3,
      path: './identite-usurpee',
      title: 'Identité usurpée',
    },
    {
      order: 4,
      path: './contact',
      title: 'Contact',
    },
    {
      order: 5,
      path: './recapitulatif',
      title: 'Récapitulatif',
    },
  ],
};
