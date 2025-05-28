import { LogoFranceConnect } from '@fc/assets';
import type { LayoutConfig } from '@fc/layout';

export const Layout: LayoutConfig = {
  features: {
    showLicence: false,
    showServiceTitle: true,
  },
  footer: {
    description:
      'L’Espace partenaires FranceConnect est un dispositif qui permet aux partenaires de gérer leur fournisseur de service FranceConnect.',
    links: [
      {
        external: true,
        href: 'https://www.legifrance.gouv.fr',
        label: 'legifrance.gouv.fr',
        title: 'Accéder au site legifrance.gouv.fr nouvelle fenêtre',
      },
      {
        external: true,
        href: 'https://www.info.gouv.fr',
        label: 'info.gouv.fr',
        title: 'Accéder au site info.gouv.fr nouvelle fenêtre',
      },
      {
        external: true,
        href: 'https://www.service-public.fr/',
        label: 'service-public.fr',
        title: 'Accéder au site service-public.fr nouvelle fenêtre',
      },
      {
        external: true,
        href: 'https://data.gouv.fr',
        label: 'data.gouv.fr',
        title: 'Accéder au site data.gouv.fr nouvelle fenêtre',
      },
    ],
    navigation: [
      {
        external: false,
        href: '/plan-du-site',
        label: 'Plan du site',
      },
      {
        external: true,
        href: 'https://franceconnect.gouv.fr/accessibilite',
        label: 'Accessibilité : non conforme',
      },
      {
        external: false,
        href: '/mentions-legales',
        label: 'Mentions légales',
      },
      {
        external: true,
        href: 'https://franceconnect.gouv.fr/cgu',
        label: 'Données personnelles',
      },
      {
        external: true,
        href: 'https://franceconnect.gouv.fr/cgu',
        label: 'Gestion des cookies',
      },
    ],
  },
  service: {
    baseline: 'Espace Partenaires',
    homepage: '/',
    logo: LogoFranceConnect,
    name: 'FranceConnect',
  },
  sitemap: [
    {
      href: '/',
      label: 'Accueil',
    },
    {
      href: '/mentions-legales',
      label: 'Mentions Légales',
    },
    {
      external: true,
      href: 'https://franceconnect.gouv.fr/licence',
      label: 'Licence',
    },
    {
      external: true,
      href: 'https://franceconnect.gouv.fr/accessibilite',
      label: 'Accessibilité',
    },
  ],
};
