/* istanbul ignore file */

// declarative file
import { LogoFranceConnect } from '@fc/assets';
import type { LayoutConfig } from '@fc/layout';

export const Layout: LayoutConfig = {
  features: {
    showLicence: false,
    showServiceTitle: false,
  },
  footer: {
    description:
      'FranceConnect est le dispositif d’identification conçu par l’État pour vous faciliter l’accès à vos services en ligne. En utilisant un de vos comptes déjà existants, vous pourrez vous connecter de façon sécurisée à plus de 1000 services sans créer de nouveau mot de passe.',
    links: [
      {
        href: 'https://www.legifrance.gouv.fr',
        label: 'legifrance.gouv.fr',
        title: 'Accéder au site legifrance.gouv.fr nouvelle fenêtre',
      },
      {
        href: 'https://www.info.gouv.fr',
        label: 'info.gouv.fr',
        title: 'Accéder au site info.gouv.fr nouvelle fenêtre',
      },
      {
        href: 'https://www.service-public.fr/',
        label: 'service-public.fr',
        title: 'Accéder au site service-public.fr nouvelle fenêtre',
      },
      {
        href: 'https://data.gouv.fr',
        label: 'data.gouv.fr',
        title: 'Accéder au site data.gouv.fr nouvelle fenêtre',
      },
    ],
    navigation: [
      {
        href: 'https://franceconnect.gouv.fr/plan-site',
        label: 'Plan du site',
      },
      {
        href: 'https://franceconnect.gouv.fr/accessibilite',
        label: 'Accessibilité : non conforme',
      },
      {
        href: 'https://franceconnect.gouv.fr/mentions-legales',
        label: 'Mentions légales',
      },
      {
        href: 'https://franceconnect.gouv.fr/cgu',
        label: 'Données personnelles',
      },
      {
        href: 'https://franceconnect.gouv.fr/cgu',
        label: 'Gestion des cookies',
      },
    ],
  },
  navigation: [
    {
      href: '/history',
      label: 'Mon historique de connexion',
    },
    {
      href: '/preferences',
      label: 'Gérer mes accès',
    },
    {
      href: '/fraud/form',
      label: 'Signaler une usurpation',
    },
  ],
  service: {
    homepage: '/',
    logo: LogoFranceConnect,
  },
};
