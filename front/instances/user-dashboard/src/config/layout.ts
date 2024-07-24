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
    'FranceConnect est le dispositif d’identification conçu par l’État pour vous faciliter l’accès à vos services en ligne. En utilisant un de vos comptes déjà existants, vous pourrez vous connecter de façon sécurisée à plus de 1000 services sans créer de nouveau mot de passe.',
  footerLinkTitle: 'Mon tableau de bord',
  homepage: '/',
  logo: LogoFranceConnect,
  navigationItems: [
    {
      href: '/history',
      label: 'Mon historique de connexion',
    },
    {
      href: '/preferences',
      label: 'Gérer mes accès',
    },
  ],
};
