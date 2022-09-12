/* istanbul ignore file */

// declarative file
import { LayoutConfig, LogoFranceConnect, NavigationLink } from '@fc/dsfr';

const navigationItems: NavigationLink[] = [
  {
    a11y: 'Accéder à votre liste de fournisseurs',
    href: '/service-providers',
    // @TODO add i18n key to translate menu items
    // into main navigation component
    label: 'Mes fournisseurs de service',
  },
];

export const Layout: LayoutConfig = {
  bottomLinks: [],
  footerDescription:
    'Partenaires France Connect est un dispositif qui permet aux administrateurs FC de gérer les partenaires France Connnect',
  footerLinkTitle: 'Partenaires FC',
  logo: LogoFranceConnect,
  navigationItems,
  service: {
    name: 'Espace partenaire',
    title: 'Accueil - Espace partenaire - République Française',
  },
};
