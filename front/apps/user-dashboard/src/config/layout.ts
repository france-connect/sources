/* istanbul ignore file */

// declarative file
import { LayoutConfig, LogoFranceConnect } from '@fc/dsfr';

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
      label: 'Accessibilité',
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
    'FranceConnect est un dispositif qui permet aux internautes de s’identifier sur un service en ligne par l’intermédiaire d’un compte existant (impots.gouv.fr, ameli.fr…).',
  footerLinkTitle: 'Agent connect',
  logo: LogoFranceConnect,
  navigationItems: [
    {
      a11y: 'Mon historique de connexion',
      href: '/history',
      label: 'Mon historique de connexion',
    },
    {
      a11y: 'Gérer mes accès',
      href: '/preferences',
      label: 'Gérer mes accès',
    },
  ],
};
