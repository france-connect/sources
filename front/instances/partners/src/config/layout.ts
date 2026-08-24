import { LogoFranceConnect10Ans } from '@fc/assets';
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
        title: 'Accéder au site legifrance.gouv.fr',
      },
      {
        external: true,
        href: 'https://www.info.gouv.fr',
        label: 'info.gouv.fr',
        title: 'Accéder au site info.gouv.fr',
      },
      {
        external: true,
        href: 'https://www.service-public.gouv.fr/',
        label: 'service-public.gouv.fr',
        title: 'Accéder au site service-public.gouv.fr',
      },
      {
        external: true,
        href: 'https://data.gouv.fr',
        label: 'data.gouv.fr',
        title: 'Accéder au site data.gouv.fr',
      },
    ],
    navigation: [
      {
        external: false,
        href: '/plan-du-site',
        label: 'Plan du site',
      },
      {
        external: false,
        href: '/accessibilite',
        label: 'Accessibilité : non conforme',
      },
      {
        external: false,
        href: '/mentions-legales',
        label: 'Mentions légales',
      },
      {
        external: true,
        href: 'https://www.franceconnect.gouv.fr/cgu/politique-protection-donnees-personnelles/',
        label: 'Données personnelles',
      },
      {
        external: true,
        href: 'https://www.franceconnect.gouv.fr/gestion-cookies/',
        label: 'Gestion des cookies',
      },
    ],
  },
  header: {
    navigation: [
      {
        href: '/fournisseurs-de-service',
        label: 'Mes fournisseurs de service',
      },
      {
        href: '/instances',
        label: 'Mes accès au bac à sable',
      },
    ],
    toolsLinks: [
      {
        external: true,
        href: 'https://docs.partenaires.franceconnect.gouv.fr/',
        label: 'Documentation',
      },
    ],
  },
  service: {
    baseline: 'Espace Partenaires',
    homepage: '/',
    logo: LogoFranceConnect10Ans,
    logoTitle: 'FranceConnect, 10 ans de simplification de l’accès aux démarches',
    name: 'FranceConnect',
  },
  sitemap: [
    {
      href: '/fournisseurs-de-service',
      label: 'Mes fournisseurs de service',
    },
    {
      href: '/instances',
      label: 'Mes accès au bac à sable',
    },
    {
      href: '/mentions-legales',
      label: 'Mentions Légales',
    },
    {
      external: true,
      href: 'https://www.franceconnect.gouv.fr/licence/',
      label: 'Licence',
    },
    {
      external: false,
      href: '/accessibilite',
      label: 'Accessibilité',
    },
  ],
};
