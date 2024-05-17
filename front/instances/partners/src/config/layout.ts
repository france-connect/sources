/* istanbul ignore file */

// declarative file
import type { LayoutConfig } from '@fc/dsfr';
import { LogoFranceConnect } from '@fc/dsfr';

export const Layout: LayoutConfig = {
  bottomLinks: [
    {
      a11y: 'Plan du site',
      href: 'https://franceconnect.gouv.fr/plan-site',
      label: 'Plan du site',
    },
    {
      a11y: 'Accessibilité',
      href: 'https://franceconnect.gouv.fr/accessibilite',
      label: 'Accessibilité : non conforme',
    },
    {
      a11y: 'Mentions légales',
      href: 'https://franceconnect.gouv.fr/mentions-legales',
      label: 'Mentions légales',
    },
    {
      a11y: 'Données personnelles',
      href: 'https://franceconnect.gouv.fr/cgu',
      label: 'Données personnelles',
    },
    {
      a11y: 'Gestion des cookies',
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
      a11y: 'Home',
      href: '/',
      label: 'Home',
    },
    {
      a11y: 'Formulaires',
      href: '/form',
      label: 'Formulaires',
    },
  ],
};
