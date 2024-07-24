/* istanbul ignore file */

// declarative file
import type { LayoutConfig } from '@fc/dsfr';
import { LogoFranceConnect } from '@fc/dsfr';

export const Layout: LayoutConfig = {
  bottomLinks: [
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
  footerDescription:
    'Partenaires France Connect est un dispositif qui permet aux administrateurs FC de gérer les partenaires France Connnect.',
  footerLinkTitle: 'Espace Partenaires',
  homepage: '/',
  logo: LogoFranceConnect,
  navigationItems: [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/form',
      label: 'Formulaires',
    },
  ],
  service: {
    baseline: 'Espace Partenaires',
    name: 'FranceConnect / FranceConnect+',
    title: 'Retourner à l’accueil',
  },
};
